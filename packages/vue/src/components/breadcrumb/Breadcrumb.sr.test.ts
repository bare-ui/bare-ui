import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs } from '@/test/sr';
import { Breadcrumb } from '.';

const {
	Root: BreadcrumbRoot,
	List: BreadcrumbList,
	Item: BreadcrumbItem,
	Link: BreadcrumbLink,
	Separator: BreadcrumbSeparator,
} = Breadcrumb;

describe('Breadcrumb — screen reader semantics', () => {
	it('exposes the trail as a navigation landmark named "Breadcrumb"', () => {
		render({
			template: `
				<BreadcrumbRoot>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</BreadcrumbRoot>
			`,
			components: { BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, BreadcrumbLink },
		});
		expectExposedAs('navigation', 'Breadcrumb');
	});

	it('names the landmark from a consumer-supplied aria-label', () => {
		render({
			template: `
				<BreadcrumbRoot aria-label="You are here">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</BreadcrumbRoot>
			`,
			components: { BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, BreadcrumbLink },
		});
		expectExposedAs('navigation', 'You are here');
	});

	it('announces the final crumb as the current page (aria-current=page)', () => {
		render({
			template: `
				<BreadcrumbRoot>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem :current="true">Profile</BreadcrumbItem>
					</BreadcrumbList>
				</BreadcrumbRoot>
			`,
			components: { BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator },
		});
		const home = expectExposedAs('link', 'Home');
		expect(home).not.toHaveAttribute('aria-current');
		expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page');
	});

	it('hides the separator from the accessible name so SR reads only the crumbs', () => {
		render({
			template: `
				<BreadcrumbRoot>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</BreadcrumbRoot>
			`,
			components: { BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator },
		});
		// The separator glyph is aria-hidden, so the SR-reachable links carry the
		// full crumb names without the decorative "/" leaking in.
		expectExposedAs('link', 'Home');
		expectExposedAs('link', 'Docs');
		expect(screen.queryByText('>')).toHaveAttribute('aria-hidden', 'true');
	});
});
