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

	describe('menubar keyboard navigation', () => {
		it('ArrowRight/ArrowLeft move focus between top-level triggers', async () => {
			renderBar();
			const fileTrigger = screen.getByRole('menuitem', { name: 'File' });
			const editTrigger = screen.getByRole('menuitem', { name: 'Edit' });
			fileTrigger.focus();
			await userEvent.keyboard('{ArrowRight}');
			expect(document.activeElement).toBe(editTrigger);
			await userEvent.keyboard('{ArrowLeft}');
			expect(document.activeElement).toBe(fileTrigger);
		});

		it('ArrowRight wraps from the last trigger to the first', async () => {
			renderBar();
			const fileTrigger = screen.getByRole('menuitem', { name: 'File' });
			const editTrigger = screen.getByRole('menuitem', { name: 'Edit' });
			editTrigger.focus();
			await userEvent.keyboard('{ArrowRight}');
			expect(document.activeElement).toBe(fileTrigger);
		});

		it('ArrowDown on a focused trigger opens its menu', async () => {
			renderBar();
			const fileTrigger = screen.getByRole('menuitem', { name: 'File' });
			fileTrigger.focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menu')).toBeInTheDocument();
			expect(screen.getByText('New')).toBeInTheDocument();
		});

		it('ArrowUp on a focused trigger opens its menu', async () => {
			renderBar();
			const fileTrigger = screen.getByRole('menuitem', { name: 'File' });
			fileTrigger.focus();
			await userEvent.keyboard('{ArrowUp}');
			expect(screen.getByRole('menu')).toBeInTheDocument();
		});

		it('ArrowDown opens a menu and focuses the first submenu item', async () => {
			renderBar();
			screen.getByRole('menuitem', { name: 'File' }).focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menu')).toBeInTheDocument();
			expect(document.activeElement).toBe(screen.getByText('New'));
		});
	});

	describe('in-menu keyboard navigation', () => {
		function renderNavMenu() {
			return render(() => (
				<MenuBar.Root>
					<MenuBar.Menu value='file'>
						<MenuBar.Trigger>File</MenuBar.Trigger>
						<MenuBar.Content>
							<MenuBar.Item>Apple</MenuBar.Item>
							<MenuBar.Item>Banana</MenuBar.Item>
							<MenuBar.Item>Cherry</MenuBar.Item>
						</MenuBar.Content>
					</MenuBar.Menu>
				</MenuBar.Root>
			));
		}

		it('focuses the first item on open with roving tabindex', async () => {
			renderNavMenu();
			await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
			const items = screen.getAllByRole('menuitem').filter((el) => el.getAttribute('role') === 'menuitem' && !el.hasAttribute('aria-haspopup'));
			expect(document.activeElement).toBe(items[0]);
			expect(items[0]).toHaveAttribute('tabindex', '0');
			expect(items[1]).toHaveAttribute('tabindex', '-1');
		});

		it('ArrowDown/ArrowUp move focus between items', async () => {
			renderNavMenu();
			await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
			const items = screen.getAllByRole('menuitem').filter((el) => !el.hasAttribute('aria-haspopup'));
			await userEvent.keyboard('{ArrowDown}');
			expect(document.activeElement).toBe(items[1]);
			await userEvent.keyboard('{ArrowUp}');
			expect(document.activeElement).toBe(items[0]);
		});

		it('Home/End jump to first/last item', async () => {
			renderNavMenu();
			await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
			const items = screen.getAllByRole('menuitem').filter((el) => !el.hasAttribute('aria-haspopup'));
			await userEvent.keyboard('{End}');
			expect(document.activeElement).toBe(items[2]);
			await userEvent.keyboard('{Home}');
			expect(document.activeElement).toBe(items[0]);
		});

		it('typeahead focuses a matching item', async () => {
			renderNavMenu();
			await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
			const items = screen.getAllByRole('menuitem').filter((el) => !el.hasAttribute('aria-haspopup'));
			await userEvent.keyboard('c');
			expect(document.activeElement).toBe(items[2]);
		});

		it('Escape closes the menu and restores focus to the trigger', async () => {
			renderNavMenu();
			const trigger = screen.getByRole('menuitem', { name: 'File' });
			await userEvent.click(trigger);
			expect(screen.getByRole('menu')).toBeInTheDocument();
			await userEvent.keyboard('{Escape}');
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
			expect(document.activeElement).toBe(trigger);
		});

		it('Tab closes the menu', async () => {
			renderNavMenu();
			await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
			expect(screen.getByRole('menu')).toBeInTheDocument();
			await userEvent.keyboard('{Tab}');
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});
	});
});
