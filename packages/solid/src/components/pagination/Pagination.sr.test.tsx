import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { expectExposedAs } from '@/test/sr';
import { Pagination } from './Pagination';

function renderPagination(props: Partial<ComponentProps<typeof Pagination.Root>> = {}) {
	return render(() => (
		<Pagination.Root
			totalPages={10}
			{...props}>
			<Pagination.List>
				<li>
					<Pagination.Previous>Prev</Pagination.Previous>
				</li>
				<Pagination.Items>
					{(item) => (item === 'ellipsis' ? <Pagination.Ellipsis /> : <Pagination.Item page={item} />)}
				</Pagination.Items>
				<li>
					<Pagination.Next>Next</Pagination.Next>
				</li>
			</Pagination.List>
		</Pagination.Root>
	));
}

describe('Pagination — screen reader semantics', () => {
	it('exposes the control as a navigation landmark named "Pagination"', () => {
		renderPagination();
		expectExposedAs('navigation', 'Pagination');
	});

	it('gives each page button a number-only accessible name (aria-label "Page N")', () => {
		renderPagination({ defaultPage: 1 });
		// SR reads "Page 2" rather than the bare glyph, disambiguating from the
		// prev/next controls when navigating by button.
		expectExposedAs('button', 'Page 2');
		expectExposedAs('button', 'Page 1');
	});

	it('marks the current page with aria-current=page and only that page', () => {
		renderPagination({ defaultPage: 3 });
		const current = expectExposedAs('button', 'Page 3');
		expect(current).toHaveAttribute('aria-current', 'page');
		expect(expectExposedAs('button', 'Page 2')).not.toHaveAttribute('aria-current');
	});

	it('moves aria-current to the newly selected page on click', async () => {
		renderPagination({ defaultPage: 2 });
		expect(expectExposedAs('button', 'Page 2')).toHaveAttribute('aria-current', 'page');
		await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
		expect(expectExposedAs('button', 'Page 3')).toHaveAttribute('aria-current', 'page');
		expect(expectExposedAs('button', 'Page 2')).not.toHaveAttribute('aria-current');
	});

	it('names prev/next controls and disables Previous at the lower bound', () => {
		renderPagination({ defaultPage: 1 });
		expect(expectExposedAs('button', 'Previous page')).toBeDisabled();
		expect(expectExposedAs('button', 'Next page')).toBeEnabled();
	});

	it('disables Next at the upper bound', () => {
		renderPagination({ defaultPage: 10 });
		expect(expectExposedAs('button', 'Next page')).toBeDisabled();
		expect(expectExposedAs('button', 'Previous page')).toBeEnabled();
	});

	it('keeps ellipsis gaps out of the SR button sequence', () => {
		renderPagination({ defaultPage: 5 });
		// Ellipsis is decorative (aria-hidden), so it is never announced as a control.
		const ellipses = screen.getAllByText('…');
		expect(ellipses.length).toBeGreaterThan(0);
		ellipses.forEach((el) => expect(el).toHaveAttribute('aria-hidden', 'true'));
	});
});
