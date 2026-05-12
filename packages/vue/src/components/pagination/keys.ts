import { inject, type InjectionKey } from 'vue'
import type { PaginationContextValue, PaginationItemValue } from './Pagination.types'

export const PaginationKey: InjectionKey<PaginationContextValue> = Symbol('PaginationContext')

export function usePaginationContext() {
	const ctx = inject(PaginationKey)
	if (!ctx) throw new Error('Pagination compound components must be used within Pagination.Root')
	return ctx
}

function range(start: number, end: number): number[] {
	const out: number[] = []
	for (let i = start; i <= end; i++) out.push(i)
	return out
}

/**
 * Build the list of items: a mix of page numbers and 'ellipsis' markers.
 */
export function getPaginationItems(
	totalPages: number,
	page: number,
	siblingCount = 1,
	boundaryCount = 1,
): PaginationItemValue[] {
	if (totalPages <= 1) return totalPages === 1 ? [1] : []

	const startPages = range(1, Math.min(boundaryCount, totalPages))
	const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages)

	const siblingsStart = Math.max(
		Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
		boundaryCount + 2,
	)
	const siblingsEnd = Math.min(
		Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
		endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
	)

	const items: PaginationItemValue[] = [
		...startPages,
		...(siblingsStart > boundaryCount + 2
			? (['ellipsis'] as const)
			: boundaryCount + 1 < totalPages - boundaryCount
				? [boundaryCount + 1]
				: []),
		...range(siblingsStart, siblingsEnd),
		...(siblingsEnd < totalPages - boundaryCount - 1
			? (['ellipsis'] as const)
			: totalPages - boundaryCount > boundaryCount
				? [totalPages - boundaryCount]
				: []),
		...endPages,
	]

	return items
}
