import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, nextTick } from 'vue';
import { Dropdown } from '.';

function renderDropdown(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Dropdown.Root, { ...rootProps }, () => [
					h(Dropdown.Trigger, null, () => 'Open Menu'),
					h(Dropdown.Menu, null, () => [
						h('div', { role: 'menuitem' }, 'Option A'),
						h('div', { role: 'menuitem' }, 'Option B'),
					]),
				]);
		},
	});
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
			await nextTick();
			expect(screen.getByRole('menu')).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
		});

		it('ArrowDown/ArrowUp move focus between items with roving tabindex', async () => {
			renderDropdown({ defaultOpen: true });
			await nextTick();
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
			await nextTick();
			screen.getByRole('menuitem', { name: 'Option B' }).focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
		});

		it('Home/End jump to the first and last items', async () => {
			renderDropdown({ defaultOpen: true });
			await nextTick();
			screen.getByRole('menuitem', { name: 'Option A' }).focus();
			await userEvent.keyboard('{End}');
			expect(screen.getByRole('menuitem', { name: 'Option B' })).toHaveFocus();
			await userEvent.keyboard('{Home}');
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
		});

		it('typeahead focuses the next item matching the typed character', async () => {
			renderDropdown({ defaultOpen: true });
			await nextTick();
			screen.getByRole('menuitem', { name: 'Option A' }).focus();
			// Both start with "Option"; typing "o" advances to the next one.
			await userEvent.keyboard('o');
			expect(screen.getByRole('menuitem', { name: 'Option B' })).toHaveFocus();
		});

		it('returns focus to the trigger when closed with Escape', async () => {
			renderDropdown();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}');
			await nextTick();
			expect(screen.getByRole('menuitem', { name: 'Option A' })).toHaveFocus();
			await userEvent.keyboard('{Escape}');
			await nextTick();
			expect(screen.queryByRole('menu')).toBeNull();
			expect(trigger).toHaveFocus();
		});
	});
});
