import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { ContextMenu } from './ContextMenu';

function renderCM(onSelect = vi.fn()) {
	return render(() => (
		<ContextMenu.Root>
			<ContextMenu.Trigger data-testid='trigger'>Right-click here</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item onSelect={onSelect}>Cut</ContextMenu.Item>
				<ContextMenu.Item>Copy</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Item disabled>Paste</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	));
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
		render(() => (
			<ContextMenu.Root>
				<ContextMenu.Trigger data-testid='trigger'>x</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item
						disabled
						onSelect={onSelect}>
						Paste
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>
		));
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
		function renderNav() {
			return render(() => (
				<ContextMenu.Root>
					<ContextMenu.Trigger data-testid='trigger'>Right-click here</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item>Apple</ContextMenu.Item>
						<ContextMenu.Item>Banana</ContextMenu.Item>
						<ContextMenu.Item>Cherry</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Root>
			));
		}

		it('focuses the first item on open with roving tabindex', () => {
			renderNav();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			const items = screen.getAllByRole('menuitem');
			expect(document.activeElement).toBe(items[0]);
			expect(items[0]).toHaveAttribute('tabindex', '0');
			expect(items[1]).toHaveAttribute('tabindex', '-1');
		});

		it('ArrowDown/ArrowUp move focus between items', async () => {
			renderNav();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			const items = screen.getAllByRole('menuitem');
			await userEvent.keyboard('{ArrowDown}');
			expect(document.activeElement).toBe(items[1]);
			expect(items[1]).toHaveAttribute('tabindex', '0');
			await userEvent.keyboard('{ArrowUp}');
			expect(document.activeElement).toBe(items[0]);
		});

		it('Home/End jump to first/last item', async () => {
			renderNav();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			const items = screen.getAllByRole('menuitem');
			await userEvent.keyboard('{End}');
			expect(document.activeElement).toBe(items[2]);
			await userEvent.keyboard('{Home}');
			expect(document.activeElement).toBe(items[0]);
		});

		it('typeahead focuses a matching item', async () => {
			renderNav();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			const items = screen.getAllByRole('menuitem');
			await userEvent.keyboard('c');
			expect(document.activeElement).toBe(items[2]);
		});

		it('Tab closes the menu', async () => {
			renderNav();
			fireEvent.contextMenu(screen.getByTestId('trigger'));
			expect(screen.getByRole('menu')).toBeInTheDocument();
			await userEvent.keyboard('{Tab}');
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});
	});
});
