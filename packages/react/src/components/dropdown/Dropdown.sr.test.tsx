import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Dropdown } from './Dropdown';

function renderDropdown(rootProps: React.ComponentProps<typeof Dropdown.Root> = {}) {
	return render(
		<Dropdown.Root {...rootProps}>
			<Dropdown.Trigger>Open Menu</Dropdown.Trigger>
			<Dropdown.Menu>
				<div role='menuitem'>Profile</div>
				<div
					role='menuitemcheckbox'
					aria-checked='true'>
					Show toolbar
				</div>
				<div
					role='menuitemradio'
					aria-checked='false'>
					Compact
				</div>
			</Dropdown.Menu>
		</Dropdown.Root>,
	);
}

describe('Dropdown — screen reader semantics', () => {
	it('exposes the trigger as a menu pop-up button by its accessible name', () => {
		renderDropdown();
		const trigger = expectExposedAs('button', 'Open Menu');
		// A screen reader announces "Open Menu, menu pop-up, collapsed".
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('announces the expanded state transition when the menu opens', async () => {
		renderDropdown();
		const trigger = screen.getByRole('button', { name: 'Open Menu' });
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('collapses the announcement again when the menu closes', async () => {
		renderDropdown();
		const trigger = screen.getByRole('button', { name: 'Open Menu' });
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('exposes the open container as a menu', async () => {
		renderDropdown();
		await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('exposes menu items by their accessible name once open', async () => {
		renderDropdown();
		await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
		const menu = screen.getByRole('menu');
		expectExposedAs('menuitem', 'Profile', {}, menu);
	});

	it('exposes checkbox and radio items with their checked state', async () => {
		renderDropdown();
		await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
		const menu = screen.getByRole('menu');
		// A checked menuitemcheckbox announces "Show toolbar, checked".
		expectExposedAs('menuitemcheckbox', 'Show toolbar', { checked: true }, menu);
		// An unchecked menuitemradio announces "Compact, not selected".
		expectExposedAs('menuitemradio', 'Compact', { checked: false }, menu);
	});
});
