import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { MenuBar } from './MenuBar';

function renderBar() {
	return render(() => (
		<MenuBar.Root>
			<MenuBar.Menu value='file'>
				<MenuBar.Trigger>File</MenuBar.Trigger>
				<MenuBar.Content>
					<MenuBar.Item>New</MenuBar.Item>
					<MenuBar.Item>Open</MenuBar.Item>
				</MenuBar.Content>
			</MenuBar.Menu>
			<MenuBar.Menu value='edit'>
				<MenuBar.Trigger>Edit</MenuBar.Trigger>
				<MenuBar.Content>
					<MenuBar.Item>Cut</MenuBar.Item>
					<MenuBar.Item>Copy</MenuBar.Item>
				</MenuBar.Content>
			</MenuBar.Menu>
		</MenuBar.Root>
	));
}

describe('MenuBar', () => {
	it('renders a menubar landmark', () => {
		renderBar();
		expect(screen.getByRole('menubar')).toBeInTheDocument();
		expect(screen.getAllByRole('menuitem')).toHaveLength(2);
	});

	it('clicking a trigger opens its menu', async () => {
		renderBar();
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByText('New')).toBeInTheDocument();
	});

	it('hovering another trigger while one is open switches the open menu', async () => {
		renderBar();
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		await userEvent.hover(screen.getByRole('menuitem', { name: 'Edit' }));
		expect(screen.getByText('Cut')).toBeInTheDocument();
		expect(screen.queryByText('New')).not.toBeInTheDocument();
	});

	it('item.onSelect fires and closes the menu', async () => {
		const onSelect = vi.fn();
		render(() => (
			<MenuBar.Root>
				<MenuBar.Menu value='file'>
					<MenuBar.Trigger>File</MenuBar.Trigger>
					<MenuBar.Content>
						<MenuBar.Item onSelect={onSelect}>New</MenuBar.Item>
					</MenuBar.Content>
				</MenuBar.Menu>
			</MenuBar.Root>
		));
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		await userEvent.click(screen.getByText('New'));
		expect(onSelect).toHaveBeenCalled();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('Escape closes the open menu', async () => {
		renderBar();
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});
});
