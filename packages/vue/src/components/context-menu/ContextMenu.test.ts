import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { ContextMenu } from '.';

const {
	Root: ContextMenuRoot,
	Trigger: ContextMenuTrigger,
	Content: ContextMenuContent,
	Item: ContextMenuItem,
	Separator: ContextMenuSeparator,
} = ContextMenu;

function renderCM(onSelect = vi.fn()) {
	return render({
		template: `
			<ContextMenuRoot>
				<ContextMenuTrigger data-testid="trigger">Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem :onSelect="onSelect">Cut</ContextMenuItem>
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
		setup() {
			return { onSelect };
		},
	});
}

async function openMenu() {
	fireEvent.contextMenu(screen.getByTestId('trigger'), { clientX: 50, clientY: 50 });
	await nextTick();
}

describe('ContextMenu', () => {
	it('starts closed', () => {
		renderCM();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('opens on contextmenu event', async () => {
		renderCM();
		await openMenu();
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getAllByRole('menuitem').length).toBe(3);
	});

	it('Item.onSelect fires and closes the menu', async () => {
		const onSelect = vi.fn();
		renderCM(onSelect);
		await openMenu();
		await userEvent.click(screen.getByText('Cut'));
		expect(onSelect).toHaveBeenCalled();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('disabled item is aria-disabled and does not select', async () => {
		const onSelect = vi.fn();
		render({
			template: `
				<ContextMenuRoot>
					<ContextMenuTrigger data-testid="trigger">x</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem :disabled="true" :onSelect="onSelect">Paste</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenuRoot>
			`,
			components: {
				ContextMenuRoot,
				ContextMenuTrigger,
				ContextMenuContent,
				ContextMenuItem,
			},
			setup() {
				return { onSelect };
			},
		});
		fireEvent.contextMenu(screen.getByTestId('trigger'));
		await nextTick();
		const item = screen.getByText('Paste');
		expect(item).toHaveAttribute('aria-disabled', 'true');
		await userEvent.click(item);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('closes on Escape', async () => {
		renderCM();
		await openMenu();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	describe('keyboard navigation', () => {
		it('focuses the first item when opened', async () => {
			renderCM();
			await openMenu();
			expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
		});

		it('ArrowDown/ArrowUp move focus and skip disabled items', async () => {
			renderCM();
			await openMenu();
			expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
			// "Paste" is disabled and excluded; ArrowDown wraps to "Cut".
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
			await userEvent.keyboard('{ArrowUp}');
			expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
		});

		it('only one item is tabbable at a time (roving tabindex)', async () => {
			renderCM();
			await openMenu();
			const tabbable = screen
				.getAllByRole('menuitem')
				.filter((i) => i.getAttribute('tabindex') === '0');
			expect(tabbable).toHaveLength(1);
			expect(tabbable[0]).toHaveAccessibleName('Cut');
		});

		it('Enter on a focused item selects it and closes', async () => {
			const onSelect = vi.fn();
			renderCM(onSelect);
			await openMenu();
			await userEvent.keyboard('{Enter}');
			expect(onSelect).toHaveBeenCalled();
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});
	});
});
