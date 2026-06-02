import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu } from './ContextMenu';

function renderCM(onSelect = vi.fn()) {
	return render(
		<ContextMenu.Root>
			<ContextMenu.Trigger data-testid='trigger'>Right-click here</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item onSelect={onSelect}>Cut</ContextMenu.Item>
				<ContextMenu.Item>Copy</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Item disabled>Paste</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>,
	);
}

describe('ContextMenu', () => {
	it('starts closed', () => {
		renderCM();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('opens on contextmenu event', () => {
		renderCM();
		fireEvent.contextMenu(screen.getByTestId('trigger'), { clientX: 50, clientY: 50 });
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getAllByRole('menuitem').length).toBe(3);
	});

	it('Item.onSelect fires and closes the menu', async () => {
		const onSelect = vi.fn();
		renderCM(onSelect);
		fireEvent.contextMenu(screen.getByTestId('trigger'));
		await userEvent.click(screen.getByText('Cut'));
		expect(onSelect).toHaveBeenCalled();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('disabled item is aria-disabled and does not select', async () => {
		const onSelect = vi.fn();
		render(
			<ContextMenu.Root>
				<ContextMenu.Trigger data-testid='trigger'>x</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item disabled onSelect={onSelect}>Paste</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>,
		);
		fireEvent.contextMenu(screen.getByTestId('trigger'));
		const item = screen.getByText('Paste');
		expect(item).toHaveAttribute('aria-disabled', 'true');
		await userEvent.click(item);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('closes on Escape', async () => {
		renderCM();
		fireEvent.contextMenu(screen.getByTestId('trigger'));
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	describe('keyboard navigation', () => {
		it('focuses the first item when opened', () => {
			renderCM();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
		});

		it('ArrowDown/ArrowUp move focus and skip disabled items', async () => {
			renderCM();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
			// "Paste" is disabled and excluded; ArrowDown wraps to "Cut".
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
			await userEvent.keyboard('{ArrowUp}');
			expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
		});

		it('only one item is tabbable at a time (roving tabindex)', () => {
			renderCM();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			const tabbable = screen
				.getAllByRole('menuitem')
				.filter((i) => i.getAttribute('tabindex') === '0');
			expect(tabbable).toHaveLength(1);
			expect(tabbable[0]).toHaveAccessibleName('Cut');
		});

		it('Enter on a focused item selects it and closes', async () => {
			const onSelect = vi.fn();
			renderCM(onSelect);
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			await userEvent.keyboard('{Enter}');
			expect(onSelect).toHaveBeenCalled();
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});
	});
});
