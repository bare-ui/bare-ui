import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { NavigationMenu } from '.';

// The hover tests use fake timers; unmount the previous tree (and flush its
// onUnmounted close-timer cleanup) under real timers before the next test.
afterEach(() => {
	cleanup();
	vi.useRealTimers();
});

const {
	Root: NavigationMenuRoot,
	List: NavigationMenuList,
	Item: NavigationMenuItem,
	Trigger: NavigationMenuTrigger,
	Content: NavigationMenuContent,
	Link: NavigationMenuLink,
} = NavigationMenu;

function renderNM() {
	return render({
		template: `
			<NavigationMenuRoot>
				<NavigationMenuList>
					<NavigationMenuItem value="products">
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="#a" :active="true">A</NavigationMenuLink>
							<NavigationMenuLink href="#b">B</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem value="solutions">
						<NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="#c">C</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href="#blog">Blog</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenuRoot>
		`,
		components: {
			NavigationMenuRoot,
			NavigationMenuList,
			NavigationMenuItem,
			NavigationMenuTrigger,
			NavigationMenuContent,
			NavigationMenuLink,
		},
	});
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

	it('moving cursor from trigger into content keeps the menu open', async () => {
		vi.useFakeTimers();
		try {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
			renderNM();
			const trigger = screen.getByRole('button', { name: 'Products' });

			// Open via click so we don't depend on the open-delay timer.
			await user.click(trigger);
			const menu = screen.getByRole('menu');
			expect(menu).toBeInTheDocument();

			// Cursor moves Trigger -> Content within skipDelayDuration. The
			// pointerleave on Trigger schedules a close; the pointerenter on
			// Content must cancel that pending close.
			trigger.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
			menu.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));

			// Advance past skipDelayDuration (default 300ms).
			vi.advanceTimersByTime(400);
			expect(screen.queryByRole('menu')).toBeInTheDocument();
		} finally {
			vi.useRealTimers();
		}
	});

	it('closes when cursor leaves content without re-entry', async () => {
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
			await nextTick();
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
		await nextTick();
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'A' })).toHaveFocus();
	});

	it('Escape inside the content closes it and returns focus to the trigger', async () => {
		renderNM();
		const trigger = screen.getByRole('button', { name: 'Products' });
		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');
		await nextTick();
		expect(screen.getByRole('link', { name: 'A' })).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await nextTick();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(trigger).toHaveFocus();
	});

	it('Link active prop sets aria-current=page', () => {
		render({
			template: `
				<NavigationMenuRoot>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink href="/" :active="true">Home</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenuRoot>
			`,
			components: {
				NavigationMenuRoot,
				NavigationMenuList,
				NavigationMenuItem,
				NavigationMenuLink,
			},
		});
		expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
	});
});
