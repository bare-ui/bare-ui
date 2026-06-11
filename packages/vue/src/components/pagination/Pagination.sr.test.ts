/**
 * Screen-reader semantics for Pagination. Verifies the ARIA pagination pattern
 * a screen reader navigates — navigation landmark, page button accessible names,
 * aria-current=page on the active page, disabled state on prev/next at bounds,
 * and aria-hidden on ellipsis gaps.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Pagination } from '.';

const {
	Root: PaginationRoot,
	List: PaginationList,
	Items: PaginationItems,
	Item: PaginationItem,
	Ellipsis: PaginationEllipsis,
	Previous: PaginationPrevious,
	Next: PaginationNext,
} = Pagination;

function renderPagination(props: Record<string, unknown> = {}) {
	return render({
		template: `
			<PaginationRoot :totalPages="10" v-bind="rootProps">
				<PaginationList>
					<li>
						<PaginationPrevious>Prev</PaginationPrevious>
					</li>
					<PaginationItems v-slot="{ item, index }">
						<PaginationEllipsis v-if="item === 'ellipsis'" :key="'e-' + index" />
						<PaginationItem v-else :key="item" :page="item" />
					</PaginationItems>
					<li>
						<PaginationNext>Next</PaginationNext>
					</li>
				</PaginationList>
			</PaginationRoot>
		`,
		components: {
			PaginationRoot,
			PaginationList,
			PaginationItems,
			PaginationItem,
			PaginationEllipsis,
			PaginationPrevious,
			PaginationNext,
		},
		setup() {
			return { rootProps: props };
		},
	});
}

describe('Pagination — screen reader semantics', () => {
	it('exposes the control as a navigation landmark named "Pagination"', () => {
		renderPagination();
		expectExposedAs('navigation', 'Pagination');
	});

	it('gives each page button a number-only accessible name (aria-label "Page N")', () => {
		renderPagination({ defaultPage: 1 });
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
		const ellipses = screen.getAllByText('…');
		expect(ellipses.length).toBeGreaterThan(0);
		ellipses.forEach((el) => expect(el.closest('[aria-hidden="true"]') ?? el).toHaveAttribute('aria-hidden', 'true'));
	});
});
