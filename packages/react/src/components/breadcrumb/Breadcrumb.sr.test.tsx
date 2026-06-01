import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb — screen reader semantics', () => {
	it('exposes the trail as a navigation landmark named "Breadcrumb"', () => {
		render(
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>,
		);
		expectExposedAs('navigation', 'Breadcrumb');
	});

	it('names the landmark from a consumer-supplied aria-label', () => {
		render(
			<Breadcrumb.Root aria-label='You are here'>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>,
		);
		expectExposedAs('navigation', 'You are here');
	});

	it('announces the final crumb as the current page (aria-current=page)', () => {
		render(
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item current>Profile</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>,
		);
		const home = expectExposedAs('link', 'Home');
		expect(home).not.toHaveAttribute('aria-current');
		expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page');
	});

	it('hides the separator from the accessible name so SR reads only the crumbs', () => {
		render(
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator>{'>'}</Breadcrumb.Separator>
					<Breadcrumb.Item>
						<Breadcrumb.Link href='/docs'>Docs</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>,
		);
		// The separator glyph is aria-hidden, so the SR-reachable links carry the
		// full crumb names without the decorative "/" leaking in.
		expectExposedAs('link', 'Home');
		expectExposedAs('link', 'Docs');
		expect(screen.queryByText('>')).toHaveAttribute('aria-hidden', 'true');
	});
});
