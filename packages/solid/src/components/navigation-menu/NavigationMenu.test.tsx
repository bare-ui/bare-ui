import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { NavigationMenu } from './NavigationMenu';

function renderNM() {
	return render(() => (
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item value='products'>
					<NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<NavigationMenu.Link
							href='#a'
							active>
							A
						</NavigationMenu.Link>
						<NavigationMenu.Link href='#b'>B</NavigationMenu.Link>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item value='solutions'>
					<NavigationMenu.Trigger>Solutions</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<NavigationMenu.Link href='#c'>C</NavigationMenu.Link>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='#blog'>Blog</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	));
}

describe('NavigationMenu', () => {
	it('renders a navigation landmark with default aria-label', () => {
		renderNM();
		expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
	});

	it('opens a menu on trigger click', async () => {
		renderNM();
		await userEvent.click(screen.getByRole('button', { name: 'Products' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByText('A')).toBeInTheDocument();
	});

	it('clicking the same trigger again closes', async () => {
		renderNM();
		const trigger = screen.getByRole('button', { name: 'Products' });
		await userEvent.click(trigger);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		await userEvent.click(trigger);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('does not close when cursor moves from Trigger into Content', async () => {
		vi.useFakeTimers();
		try {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
			renderNM();
			const trigger = screen.getByRole('button', { name: 'Products' });

			// Open via click so we don't depend on the open-delay timer.
			await user.click(trigger);
			const menu = screen.getByRole('menu');
			expect(menu).toBeInTheDocument();

			// Simulate cursor moving from Trigger → Content within skipDelayDuration.
			// The pointerleave on Trigger schedules a close; the pointerenter on
			// Content must cancel that pending close.
			trigger.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
			menu.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));

			// Advance past skipDelayDuration (default 300ms). If the bug is present,
			// the menu closes here because Trigger's timer was never cancelled.
			vi.advanceTimersByTime(400);

			expect(screen.queryByRole('menu')).toBeInTheDocument();
		} finally {
			vi.useRealTimers();
		}
	});

	it('closes when cursor leaves Content (no re-entry)', async () => {
		vi.useFakeTimers();
		try {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
			renderNM();
			const trigger = screen.getByRole('button', { name: 'Products' });

			await user.click(trigger);
			const menu = screen.getByRole('menu');
			expect(menu).toBeInTheDocument();

			trigger.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
			menu.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
			menu.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));

			vi.advanceTimersByTime(400);
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		} finally {
			vi.useRealTimers();
		}
	});

	it('ArrowDown opens a menu and moves focus to the first link', async () => {
		renderNM();
		const trigger = screen.getByRole('button', { name: 'Products' });
		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'A' })).toHaveFocus();
	});

	it('Escape inside the content closes it and returns focus to the trigger', async () => {
		renderNM();
		const trigger = screen.getByRole('button', { name: 'Products' });
		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getByRole('link', { name: 'A' })).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(trigger).toHaveFocus();
	});

	it('Link active prop sets aria-current=page', () => {
		render(() => (
			<NavigationMenu.Root>
				<NavigationMenu.List>
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href='/'
							active>
							Home
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
		));
		expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
	});
});
