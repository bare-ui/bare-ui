import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Pagination, getPaginationItems } from './Pagination';

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
					{(item) =>
						item === 'ellipsis' ? (
							<Pagination.Ellipsis />
						) : (
							<Pagination.Item page={item} />
						)
					}
				</Pagination.Items>
				<li>
					<Pagination.Next>Next</Pagination.Next>
				</li>
			</Pagination.List>
		</Pagination.Root>
	));
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

	it('Previous is disabled on first page; Next is disabled on last page', () => {
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
