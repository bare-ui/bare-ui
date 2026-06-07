import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Dropdown } from './Dropdown';

function renderDropdown(rootProps: ComponentProps<typeof Dropdown.Root> = {}) {
	return render(() => (
		<Dropdown.Root {...rootProps}>
			<Dropdown.Trigger>Open Menu</Dropdown.Trigger>
			<Dropdown.Menu>
				<div role='menuitem'>Option A</div>
				<div role='menuitem'>Option B</div>
			</Dropdown.Menu>
		</Dropdown.Root>
	));
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
		it('ArrowDown on the trigger opens the menu', async () => {
			renderDropdown();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('menu')).toBeInTheDocument();
		});

		it('ArrowUp on the trigger opens the menu', async () => {
			renderDropdown();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowUp}');
			expect(screen.getByRole('menu')).toBeInTheDocument();
		});

		it('focuses the first item when opened', async () => {
			renderDropdown({ defaultOpen: true });
			const items = screen.getAllByRole('menuitem');
			expect(document.activeElement).toBe(items[0]);
			expect(items[0]).toHaveAttribute('tabindex', '0');
			expect(items[1]).toHaveAttribute('tabindex', '-1');
		});

		it('ArrowDown/ArrowUp move focus between items with roving tabindex', async () => {
			renderDropdown({ defaultOpen: true });
			const items = screen.getAllByRole('menuitem');
			await userEvent.keyboard('{ArrowDown}');
			expect(document.activeElement).toBe(items[1]);
			expect(items[1]).toHaveAttribute('tabindex', '0');
			expect(items[0]).toHaveAttribute('tabindex', '-1');
			await userEvent.keyboard('{ArrowUp}');
			expect(document.activeElement).toBe(items[0]);
			expect(items[0]).toHaveAttribute('tabindex', '0');
		});

		it('Home/End jump to first/last item', async () => {
			renderDropdown({ defaultOpen: true });
			const items = screen.getAllByRole('menuitem');
			await userEvent.keyboard('{End}');
			expect(document.activeElement).toBe(items[items.length - 1]);
			await userEvent.keyboard('{Home}');
			expect(document.activeElement).toBe(items[0]);
		});

		it('typeahead focuses a matching item', async () => {
			render(() => (
				<Dropdown.Root defaultOpen>
					<Dropdown.Trigger>Open Menu</Dropdown.Trigger>
					<Dropdown.Menu>
						<div role='menuitem'>Apple</div>
						<div role='menuitem'>Banana</div>
						<div role='menuitem'>Cherry</div>
					</Dropdown.Menu>
				</Dropdown.Root>
			));
			const items = screen.getAllByRole('menuitem');
			// from the first item ("Apple"), typing "c" jumps to "Cherry".
			await userEvent.keyboard('c');
			expect(document.activeElement).toBe(items[2]);
		});

		it('Escape closes the menu and restores focus to the trigger', async () => {
			renderDropdown();
			const trigger = screen.getByRole('button');
			await userEvent.click(trigger);
			expect(screen.getByRole('menu')).toBeInTheDocument();
			await userEvent.keyboard('{Escape}');
			expect(screen.queryByRole('menu')).toBeNull();
			expect(document.activeElement).toBe(trigger);
		});

		it('Tab closes the menu', async () => {
			renderDropdown({ defaultOpen: true });
			expect(screen.getByRole('menu')).toBeInTheDocument();
			await userEvent.keyboard('{Tab}');
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});
});
