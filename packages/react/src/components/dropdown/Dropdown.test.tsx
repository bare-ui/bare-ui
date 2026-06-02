import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';

function renderDropdown(rootProps: React.ComponentProps<typeof Dropdown.Root> = {}) {
	return render(
		<Dropdown.Root {...rootProps}>
			<Dropdown.Trigger>Open Menu</Dropdown.Trigger>
			<Dropdown.Menu>
				<div role='menuitem'>Option A</div>
				<div role='menuitem'>Option B</div>
			</Dropdown.Menu>
		</Dropdown.Root>,
	);
}

describe('Dropdown', () => {
	it('trigger renders as a button', () => {
		renderDropdown();
		expect(screen.getByRole('button', { name: 'Open Menu' })).toBeInTheDocument();
	});

	it('menu is not visible initially', () => {
		renderDropdown();
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it('clicking trigger opens the menu', async () => {
		renderDropdown();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('clicking trigger again closes the menu', async () => {
		renderDropdown();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('menu')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it('trigger aria-expanded reflects open state', async () => {
		renderDropdown();
		const trigger = screen.getByRole('button');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('trigger data-state reflects open/closed', async () => {
		renderDropdown();
		const trigger = screen.getByRole('button');
		expect(trigger).toHaveAttribute('data-state', 'closed');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('Escape key closes the menu', async () => {
		renderDropdown();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('menu')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it('defaultOpen=true shows menu initially', () => {
		renderDropdown({ defaultOpen: true });
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('controlled open=true shows menu', () => {
		renderDropdown({ open: true });
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('controlled open=false hides menu', () => {
		renderDropdown({ open: false });
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it('onOpenChange fires when toggled', async () => {
		const handleOpenChange = vi.fn();
		renderDropdown({ onOpenChange: handleOpenChange });
		await userEvent.click(screen.getByRole('button'));
		expect(handleOpenChange).toHaveBeenCalledWith(true);
	});

	it('menu shows items when open', async () => {
		renderDropdown();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.getByText('Option A')).toBeInTheDocument();
		expect(screen.getByText('Option B')).toBeInTheDocument();
	});

	describe('keyboard navigation', () => {
		it('ArrowDown on the trigger opens the menu and focuses the first item', async () => {
			renderDropdown();
			screen.getByRole('button').focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menu')).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
		});

		it('ArrowDown/ArrowUp move focus between items with roving tabindex', async () => {
			renderDropdown({ defaultOpen: true });
			const itemA = screen.getByRole('menuitem', { name: 'Option A' });
			const itemB = screen.getByRole('menuitem', { name: 'Option B' });
			itemA.focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(itemB).toHaveFocus();
			expect(itemB).toHaveAttribute('tabindex', '0');
			expect(itemA).toHaveAttribute('tabindex', '-1');
			await userEvent.keyboard('{ArrowUp}');
			expect(itemA).toHaveFocus();
		});

		it('ArrowDown wraps from the last item to the first', async () => {
			renderDropdown({ defaultOpen: true });
			screen.getByRole('menuitem', { name: 'Option B' }).focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
		});

		it('Home/End jump to the first and last items', async () => {
			renderDropdown({ defaultOpen: true });
			screen.getByRole('menuitem', { name: 'Option A' }).focus();
			await userEvent.keyboard('{End}');
			expect(screen.getByRole('menuitem', { name: 'Option B' })).toHaveFocus();
			await userEvent.keyboard('{Home}');
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
		});

		it('typeahead focuses the next item matching the typed character', async () => {
			renderDropdown({ defaultOpen: true });
			screen.getByRole('menuitem', { name: 'Option A' }).focus();
			// Both start with "Option"; typing "o" advances to the next one.
			await userEvent.keyboard('o');
			expect(screen.getByRole('menuitem', { name: 'Option B' })).toHaveFocus();
		});

		it('returns focus to the trigger when closed with Escape', async () => {
			renderDropdown();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}'); // open + focus first item
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
			await userEvent.keyboard('{Escape}');
			expect(screen.queryByRole('menu')).toBeNull();
			expect(trigger).toHaveFocus();
		});
	});
});
