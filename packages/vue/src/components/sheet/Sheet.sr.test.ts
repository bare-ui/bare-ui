/**
 * Screen-reader semantics for Sheet. Verifies the ARIA dialog pattern a
 * screen reader navigates — role=dialog, aria-modal, aria-labelledby,
 * aria-describedby, focus management on open/close, and Escape key handling.
 *
 * Sheet auto-wires aria-labelledby (via SheetTitle) and aria-describedby
 * (via SheetDescription) through context IDs — unlike Modal, the consumer
 * does not need to pass these manually.
 *
 * The Trigger advertises the popup via aria-haspopup="dialog" and toggles
 * aria-expanded on open/close.
 *
 * Note on jsdom focus behaviour: jsdom returns null for offsetParent on every
 * element, so the focus trap's getFocusable() finds no children and falls back
 * to focusing the container (the dialog div) itself. Tests check that focus is
 * on/inside the dialog rather than on the first child button. Focus restoration
 * (returnFocus) works because useFocusTrap records the active element before
 * activation and calls .focus() on deactivation.
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
import { Sheet } from '.';

const {
	Root: SheetRoot,
	Trigger: SheetTrigger,
	Portal: SheetPortal,
	Overlay: SheetOverlay,
	Content: SheetContent,
	Handle: SheetHandle,
	Title: SheetTitle,
	Description: SheetDescription,
	Close: SheetClose,
} = Sheet;

/** Make an element visible to jsdom's layout engine so focusable queries work. */
function stubOffsetParent(el: HTMLElement) {
	Object.defineProperty(el, 'offsetParent', { configurable: true, get: () => document.body });
}

function renderSheetHarness() {
	const open = ref(false);
	const result = render({
		template: `
			<div>
				<SheetRoot :open="open" :onOpenChange="(v) => { open = v }" :snapPoints="[0.4]">
					<SheetTrigger>Open</SheetTrigger>
					<SheetPortal>
						<SheetOverlay />
						<SheetContent>
							<SheetHandle />
							<SheetTitle>Settings</SheetTitle>
							<SheetDescription>Adjust your preferences</SheetDescription>
							<SheetClose>Done</SheetClose>
						</SheetContent>
					</SheetPortal>
				</SheetRoot>
			</div>
		`,
		components: {
			SheetRoot,
			SheetTrigger,
			SheetPortal,
			SheetOverlay,
			SheetContent,
			SheetHandle,
			SheetTitle,
			SheetDescription,
			SheetClose,
		},
		setup() {
			return { open };
		},
	});
	return result;
}

/**
 * Open the sheet and stub offsetParent on the dialog and all its buttons so
 * the focus trap can discover focusable children in jsdom.
 */
async function openSheet() {
	renderSheetHarness();
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

describe('Sheet — screen reader semantics', () => {
	it('advertises the dialog on the trigger via aria-haspopup and aria-expanded', async () => {
		renderSheetHarness();
		const trigger = screen.getByRole('button', { name: 'Open' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes the content as an aria-modal dialog', async () => {
		await openSheet();
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	it('names the dialog by its Title via aria-labelledby', async () => {
		await openSheet();
		const dialog = screen.getByRole('dialog');
		expect(accessibleNameVia(dialog as HTMLElement)).toBe('Settings');
	});

	it('describes the dialog by its Description via aria-describedby', async () => {
		await openSheet();
		const dialog = screen.getByRole('dialog');
		const describedby = dialog.getAttribute('aria-describedby');
		expect(describedby).toBeTruthy();
		expect(document.getElementById(describedby!)?.textContent).toBe('Adjust your preferences');
	});

	it('moves focus into the dialog on open', async () => {
		const { trigger, dialog } = await openSheet();
		// jsdom has no layout engine, so the focus trap focuses either the first
		// focusable child or the dialog container itself. Either way focus has left
		// the trigger and is on/inside the dialog.
		expect(trigger).not.toHaveFocus();
		expect(dialog === document.activeElement || dialog.contains(document.activeElement)).toBe(true);
	});

	it('restores focus to the trigger on close', async () => {
		const { trigger } = await openSheet();
		await userEvent.click(screen.getByRole('button', { name: 'Done' }));
		await nextTick();
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('Escape closes the dialog and restores focus to the trigger', async () => {
		const { trigger } = await openSheet();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		await nextTick();
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});
});
