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
});
