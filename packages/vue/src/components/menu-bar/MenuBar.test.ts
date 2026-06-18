import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { MenuBar } from '.';

const {
	Root: MenuBarRoot,
	Menu: MenuBarMenu,
	Trigger: MenuBarTrigger,
	Content: MenuBarContent,
	Item: MenuBarItem,
} = MenuBar;

function renderBar() {
	return render({
		template: `
			<MenuBarRoot>
				<MenuBarMenu value="file">
					<MenuBarTrigger>File</MenuBarTrigger>
					<MenuBarContent>
						<MenuBarItem>New</MenuBarItem>
						<MenuBarItem>Open</MenuBarItem>
					</MenuBarContent>
				</MenuBarMenu>
				<MenuBarMenu value="edit">
					<MenuBarTrigger>Edit</MenuBarTrigger>
					<MenuBarContent>
						<MenuBarItem>Cut</MenuBarItem>
						<MenuBarItem>Copy</MenuBarItem>
					</MenuBarContent>
				</MenuBarMenu>
			</MenuBarRoot>
		`,
		components: { MenuBarRoot, MenuBarMenu, MenuBarTrigger, MenuBarContent, MenuBarItem },
	});
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
		render({
			template: `
				<MenuBarRoot>
					<MenuBarMenu value="file">
						<MenuBarTrigger>File</MenuBarTrigger>
						<MenuBarContent>
							<MenuBarItem :onSelect="onSelect">New</MenuBarItem>
						</MenuBarContent>
					</MenuBarMenu>
				</MenuBarRoot>
			`,
			components: { MenuBarRoot, MenuBarMenu, MenuBarTrigger, MenuBarContent, MenuBarItem },
			setup() {
				return { onSelect };
			},
		});
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

	describe('keyboard navigation', () => {
		it('ArrowRight/ArrowLeft move focus between top-level triggers', async () => {
			renderBar();
			screen.getByRole('menuitem', { name: 'File' }).focus();
			await userEvent.keyboard('{ArrowRight}');
			expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
			await userEvent.keyboard('{ArrowLeft}');
			expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
		});

		it('ArrowDown opens a menu and focuses the first submenu item', async () => {
			renderBar();
			screen.getByRole('menuitem', { name: 'File' }).focus();
			await userEvent.keyboard('{ArrowDown}');
			await nextTick();
			expect(screen.getByRole('menu')).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
		});

		it('ArrowDown/ArrowUp move focus within an open submenu', async () => {
			renderBar();
			screen.getByRole('menuitem', { name: 'File' }).focus();
			await userEvent.keyboard('{ArrowDown}'); // open, focus New
			await nextTick();
			await userEvent.keyboard('{ArrowDown}'); // Open
			expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
			await userEvent.keyboard('{ArrowUp}');
			expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
		});

		it('returns focus to the trigger when the submenu closes via Escape', async () => {
			renderBar();
			const fileTrigger = screen.getByRole('menuitem', { name: 'File' });
			fileTrigger.focus();
			await userEvent.keyboard('{ArrowDown}');
			await nextTick();
			expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
			await userEvent.keyboard('{Escape}');
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
			expect(fileTrigger).toHaveFocus();
		});
	});
});
