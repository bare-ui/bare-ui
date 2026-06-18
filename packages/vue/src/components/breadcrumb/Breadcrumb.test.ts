import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Breadcrumb } from '.';

const {
	Root: BreadcrumbRoot,
	List: BreadcrumbList,
	Item: BreadcrumbItem,
	Link: BreadcrumbLink,
	Separator: BreadcrumbSeparator,
} = Breadcrumb;

describe('Breadcrumb', () => {
	it('renders a navigation landmark with default aria-label', () => {
		render({
			template: `
				<BreadcrumbRoot>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem :current="true">Settings</BreadcrumbItem>
					</BreadcrumbList>
				</BreadcrumbRoot>
			`,
			components: { BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator },
		});
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
	});

	it('marks the current item with aria-current=page and data-current', () => {
		render({
			template: `
				<BreadcrumbRoot>
					<BreadcrumbList>
						<BreadcrumbItem :current="true" data-testid="last">Now</BreadcrumbItem>
					</BreadcrumbList>
				</BreadcrumbRoot>
			`,
			components: { BreadcrumbRoot, BreadcrumbList, BreadcrumbItem },
		});
		const li = screen.getByTestId('last');
		expect(li).toHaveAttribute('aria-current', 'page');
		expect(li).toHaveAttribute('data-current', '');
	});

	it('separator is decorative (aria-hidden)', () => {
		render({
			template: `
				<BreadcrumbRoot>
					<BreadcrumbList>
						<BreadcrumbSeparator data-testid="sep" />
					</BreadcrumbList>
				</BreadcrumbRoot>
			`,
			components: { BreadcrumbRoot, BreadcrumbList, BreadcrumbSeparator },
		});
		expect(screen.getByTestId('sep')).toHaveAttribute('aria-hidden', 'true');
	});
});
