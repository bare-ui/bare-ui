/**
 * Screen-reader semantics for MenuBar. The bar is a named menubar; each top-level
 * trigger is a menuitem with a menu pop-up that announces its expanded/collapsed
 * state and transitions it on open; the open submenu is a menu containing its
 * menuitems, and a disabled item is exposed as a disabled menuitem.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { MenuBar } from './MenuBar';

function renderBar() {
	return render(() => (
		<MenuBar.Root aria-label='Application'>
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
		render(() => (
			<MenuBar.Root aria-label='Application'>
				<MenuBar.Menu value='file'>
					<MenuBar.Trigger>File</MenuBar.Trigger>
					<MenuBar.Content>
						<MenuBar.Item disabled>Print</MenuBar.Item>
					</MenuBar.Content>
				</MenuBar.Menu>
			</MenuBar.Root>
		));
		await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
		const print = within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Print' });
		expect(print).toHaveAttribute('aria-disabled', 'true');
	});
});
