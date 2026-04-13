import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
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
});
