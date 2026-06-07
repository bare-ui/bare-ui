import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { expectExposedAs } from '@/test/sr';
import { NavigationMenu } from './NavigationMenu';

function renderNM(rootProps: Partial<ComponentProps<typeof NavigationMenu.Root>> = {}) {
	return render(() => (
		<NavigationMenu.Root {...rootProps}>
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

describe('NavigationMenu — screen reader semantics', () => {
	it('exposes the bar as a navigation landmark named "Main" by default', () => {
		renderNM();
		expectExposedAs('navigation', 'Main');
	});

	it('names the landmark from a consumer-supplied aria-label', () => {
		renderNM({ 'aria-label': 'Primary' });
		expectExposedAs('navigation', 'Primary');
	});

	it('exposes top-level triggers as buttons that own a popup menu', () => {
		renderNM();
		const trigger = expectExposedAs('button', 'Products');
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('starts collapsed (aria-expanded=false) and expands on open', async () => {
		renderNM();
		const trigger = expectExposedAs('button', 'Products');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('collapses again (aria-expanded=false) when reactivated', async () => {
		renderNM();
		const trigger = expectExposedAs('button', 'Products');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('exposes the opened submenu as a menu role', async () => {
		renderNM();
		await userEvent.click(expectExposedAs('button', 'Products'));
		expectExposedAs('menu', '');
		// The other trigger stays collapsed.
		expect(expectExposedAs('button', 'Solutions')).toHaveAttribute('aria-expanded', 'false');
	});

	it('marks the active link within a submenu as the current page', async () => {
		renderNM();
		await userEvent.click(expectExposedAs('button', 'Products'));
		expect(screen.getByText('A')).toHaveAttribute('aria-current', 'page');
		expect(screen.getByText('B')).not.toHaveAttribute('aria-current');
	});
});
