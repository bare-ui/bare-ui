import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { NavigationMenu } from '.';

const {
	Root: NavigationMenuRoot,
	List: NavigationMenuList,
	Item: NavigationMenuItem,
	Trigger: NavigationMenuTrigger,
	Content: NavigationMenuContent,
	Link: NavigationMenuLink,
} = NavigationMenu;

function renderNM(rootProps: Record<string, unknown> = {}) {
	return render({
		template: `
			<NavigationMenuRoot v-bind="rootProps">
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
		setup() {
			return { rootProps };
		},
	});
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
		expect(expectExposedAs('button', 'Solutions')).toHaveAttribute('aria-expanded', 'false');
	});

	it('marks the active link within a submenu as the current page', async () => {
		renderNM();
		await userEvent.click(expectExposedAs('button', 'Products'));
		expect(screen.getByText('A')).toHaveAttribute('aria-current', 'page');
		expect(screen.getByText('B')).not.toHaveAttribute('aria-current');
	});
});
