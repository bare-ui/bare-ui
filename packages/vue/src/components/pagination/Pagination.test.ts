import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { Pagination } from '.';
import { getPaginationItems } from './keys';

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

describe('Pagination', () => {
	it('renders a navigation landmark with default aria-label', () => {
		renderPagination();
		expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
	});

	it('marks the current page with aria-current=page', () => {
		renderPagination({ defaultPage: 3 });
		expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
	});

	it('Previous is disabled on first page; Next is enabled', () => {
		renderPagination({ defaultPage: 1 });
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
	});

	it('Next is disabled on the last page', () => {
		renderPagination({ defaultPage: 10 });
		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
	});

	it('clicking a page calls onChange with that page', async () => {
		const onChange = vi.fn();
		renderPagination({ onChange });
		await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
		expect(onChange).toHaveBeenCalledWith(5);
	});

	it('getPaginationItems inserts ellipsis for long ranges', () => {
		const items = getPaginationItems(20, 10, 1, 1);
		expect(items).toContain('ellipsis');
		expect(items[0]).toBe(1);
		expect(items[items.length - 1]).toBe(20);
		expect(items).toContain(10);
	});
});
