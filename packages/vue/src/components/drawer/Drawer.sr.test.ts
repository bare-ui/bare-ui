/**
 * Screen-reader semantics for Drawer. Verifies the ARIA dialog pattern a
 * screen reader navigates — role=dialog, aria-modal, aria-labelledby,
 * aria-describedby, focus management on open/close, and Escape key handling.
 *
 * Models the public usage from the stories: a trigger button toggles the drawer
 * and the consumer supplies the header/body. The component does not auto-wire
 * aria-labelledby/aria-describedby, so a real consumer names the dialog with
 * aria-labelledby (the header) and describes it with aria-describedby (the body).
 *
 * Note on jsdom focus behaviour: jsdom returns null for offsetParent on every
 * element, so the focus trap's getFocusable() finds no children and falls back to
 * focusing the container (the dialog div) itself. The tests therefore check that
 * focus is on/inside the dialog rather than on the first child button. Focus
 * restoration (returnFocus) also works because useFocusTrap records the active
 * element before activation and calls .focus() on deactivation.
 *
 * To let the focus trap discover the Close button (needed for the returnFocus
 * path), we stub offsetParent on every button inside the dialog after render.
 * This matches the pattern used in Modal.sr.test.ts.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { ref, nextTick } from 'vue';
import { accessibleNameVia } from '@/test/sr';
import { Drawer } from '.';

const {
	Root: DrawerRoot,
	Portal: DrawerPortal,
	Overlay: DrawerOverlay,
	Content: DrawerContent,
	Header: DrawerHeader,
	Close: DrawerClose,
} = Drawer;

/** Make an element visible to jsdom's layout engine so focusable queries work. */
function stubOffsetParent(el: HTMLElement) {
	Object.defineProperty(el, 'offsetParent', { configurable: true, get: () => document.body });
}

function renderDrawerHarness() {
	const open = ref(false);
	const result = render({
		template: `
			<div>
				<button type="button" @click="open = true">Open</button>
				<DrawerRoot :open="open" :onOpenChange="(v) => { open = v }">
					<DrawerPortal>
						<DrawerOverlay>
							<DrawerContent
								aria-labelledby="drawer-title"
								aria-describedby="drawer-body"
							>
								<DrawerHeader>
									<span id="drawer-title">Navigation</span>
								</DrawerHeader>
								<p id="drawer-body">Choose a destination.</p>
								<DrawerClose>Close</DrawerClose>
							</DrawerContent>
						</DrawerOverlay>
					</DrawerPortal>
				</DrawerRoot>
			</div>
		`,
		components: {
			DrawerRoot,
			DrawerPortal,
			DrawerOverlay,
			DrawerContent,
			DrawerHeader,
			DrawerClose,
		},
		setup() {
			return { open };
		},
	});
	return result;
}

/**
 * Open the drawer and stub offsetParent on the dialog and all its buttons so
 * the focus trap can discover focusable children in jsdom.
 */
async function openDrawer() {
	renderDrawerHarness();
	const trigger = screen.getByRole('button', { name: 'Open' });
	stubOffsetParent(trigger);
	await userEvent.click(trigger);
	await nextTick();
	await nextTick();

	const dialog = screen.getByRole('dialog');
	stubOffsetParent(dialog);
	dialog.querySelectorAll<HTMLElement>('button').forEach(stubOffsetParent);

	// Allow the post-flush watcher to move focus into the newly-stubbed elements.
	await nextTick();

	return { trigger, dialog };
}

describe('Drawer — screen reader semantics', () => {
	it('exposes the content as an aria-modal dialog', async () => {
		await openDrawer();
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	it('names the dialog by its header via aria-labelledby', async () => {
		await openDrawer();
		const dialog = screen.getByRole('dialog');
		expect(accessibleNameVia(dialog as HTMLElement)).toBe('Navigation');
	});

	it('describes the dialog by its body via aria-describedby', async () => {
		await openDrawer();
		const dialog = screen.getByRole('dialog');
		const describedby = dialog.getAttribute('aria-describedby');
		expect(describedby).toBeTruthy();
		expect(document.getElementById(describedby!)?.textContent).toBe('Choose a destination.');
	});

	it('moves focus into the dialog on open', async () => {
		const { trigger, dialog } = await openDrawer();
		// jsdom has no layout engine, so the focus trap focuses either the first
		// focusable child or the dialog container itself. Either way focus has left
		// the trigger and is on/inside the dialog.
		expect(trigger).not.toHaveFocus();
		expect(dialog === document.activeElement || dialog.contains(document.activeElement)).toBe(true);
	});

	it('restores focus to the trigger on close', async () => {
		const { trigger } = await openDrawer();
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await nextTick();
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('Escape closes the dialog and restores focus to the trigger', async () => {
		const { trigger } = await openDrawer();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		await nextTick();
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});
});
