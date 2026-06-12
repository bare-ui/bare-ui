import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { ContextMenu } from '.';

const {
	Root: ContextMenuRoot,
	Trigger: ContextMenuTrigger,
	Content: ContextMenuContent,
	Item: ContextMenuItem,
	Separator: ContextMenuSeparator,
} = ContextMenu;

function renderCM() {
	return render({
		template: `
			<ContextMenuRoot>
				<ContextMenuTrigger data-testid="trigger">Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Cut</ContextMenuItem>
					<ContextMenuItem>Copy</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem :disabled="true">Paste</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenuRoot>
		`,
		components: {
			ContextMenuRoot,
			ContextMenuTrigger,
			ContextMenuContent,
			ContextMenuItem,
			ContextMenuSeparator,
		},
	});
}

async function openMenu() {
	fireEvent.contextMenu(screen.getByTestId('trigger'), { clientX: 50, clientY: 50 });
	await nextTick();
}

describe('ContextMenu — screen reader semantics', () => {
	it('exposes no menu before the right-click opens it', () => {
		renderCM();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('exposes the cursor-positioned content as a menu once open', async () => {
		renderCM();
		await openMenu();
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('exposes each enabled action as a menuitem by its accessible name', async () => {
		renderCM();
		await openMenu();
		const menu = screen.getByRole('menu');
		expectExposedAs('menuitem', 'Cut', {}, menu);
		expectExposedAs('menuitem', 'Copy', {}, menu);
	});

	it('exposes a disabled item as a disabled menuitem', async () => {
		renderCM();
		await openMenu();
		const menu = screen.getByRole('menu');
		const paste = expectExposedAs('menuitem', 'Paste', {}, menu);
		expect(paste).toHaveAttribute('aria-disabled', 'true');
	});

	it('exposes a separator between item groups', async () => {
		renderCM();
		await openMenu();
		expect(within(screen.getByRole('menu')).getByRole('separator')).toBeInTheDocument();
	});
});

describe('ContextMenu — focus management', () => {
	it('focuses the first enabled item when the menu opens', async () => {
		renderCM();
		await openMenu();
		expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
	});

	it('sets roving tabindex: only the focused item has tabindex=0', async () => {
		renderCM();
		await openMenu();
		const tabbable = screen
			.getAllByRole('menuitem')
			.filter((i) => i.getAttribute('tabindex') === '0');
		expect(tabbable).toHaveLength(1);
		expect(tabbable[0]).toHaveAccessibleName('Cut');
	});

	it('ArrowDown/ArrowUp move focus and skip disabled items', async () => {
		renderCM();
		await openMenu();
		expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
		// "Paste" is disabled and excluded; ArrowDown wraps back to "Cut".
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
		await userEvent.keyboard('{ArrowUp}');
		expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
	});
});
