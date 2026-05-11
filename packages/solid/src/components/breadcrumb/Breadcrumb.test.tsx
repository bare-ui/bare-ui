import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
	it('renders a navigation landmark with default aria-label', () => {
		render(() => (
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item current>Settings</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		));
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
	});

	it('marks the current item with aria-current=page and data-current', () => {
		render(() => (
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item
						current
						data-testid='last'>
						Now
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		));
		const li = screen.getByTestId('last');
		expect(li).toHaveAttribute('aria-current', 'page');
		expect(li).toHaveAttribute('data-current', '');
	});

	it('separator is decorative (aria-hidden)', () => {
		render(() => (
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Separator data-testid='sep' />
				</Breadcrumb.List>
			</Breadcrumb.Root>
		));
		expect(screen.getByTestId('sep')).toHaveAttribute('aria-hidden', 'true');
	});
});
