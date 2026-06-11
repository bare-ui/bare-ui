/**
 * Screen-reader semantics for MenuBar. Verifies the ARIA menubar pattern a
 * screen reader navigates — role=menubar, role=menuitem, aria-haspopup,
 * aria-expanded, submenu open/close transitions, hover expansion, and
 * disabled item state — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
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
			<MenuBarRoot aria-label="Application">
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

describe('MenuBar — screen reader semantics', () => {
	it('exposes the bar as a menubar with its accessible name', () => {
		renderBar();
		expectExposedAs('menubar', 'Application');
	});

	it('exposes each top-level trigger as a menuitem with a menu pop-up', () => {
		renderBar();
		const file = expectExposedAs('menuitem', 'File');
		// A screen reader announces "File, menu, collapsed".
		expect(file).toHaveAttribute('aria-haspopup', 'menu');
		expect(file).toHaveAttribute('aria-expanded', 'false');
		expectExposedAs('menuitem', 'Edit');
	});

	it('announces the expanded state transition when a submenu opens', async () => {
		renderBar();
		const file = screen.getByRole('menuitem', { name: 'File' });
		expect(file).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(file);
		expect(file).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes the open submenu as a menu containing its items', async () => {
		renderBar();
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		const submenu = screen.getByRole('menu');
		expectExposedAs('menuitem', 'New', {}, submenu);
		expectExposedAs('menuitem', 'Open', {}, submenu);
	});

	it('moves the expanded announcement to the hovered menu and collapses the prior one', async () => {
		renderBar();
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		expect(screen.getByRole('menuitem', { name: 'File' })).toHaveAttribute('aria-expanded', 'true');
		await userEvent.hover(screen.getByRole('menuitem', { name: 'Edit' }));
		expect(screen.getByRole('menuitem', { name: 'File' })).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes a disabled submenu item as a disabled menuitem', async () => {
		render({
			template: `
				<MenuBarRoot aria-label="Application">
					<MenuBarMenu value="file">
						<MenuBarTrigger>File</MenuBarTrigger>
						<MenuBarContent>
							<MenuBarItem :disabled="true">Print</MenuBarItem>
						</MenuBarContent>
					</MenuBarMenu>
				</MenuBarRoot>
			`,
			components: { MenuBarRoot, MenuBarMenu, MenuBarTrigger, MenuBarContent, MenuBarItem },
		});
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		const print = within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Print' });
		expect(print).toHaveAttribute('aria-disabled', 'true');
	});
});
