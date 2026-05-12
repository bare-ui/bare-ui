import type { ComputedRef } from 'vue'

export interface PaginationRootProps {
	/** Total number of pages (>= 1). */
	totalPages: number
	/** Controlled current page (1-based). */
	page?: number
	/** Initial page (1-based, uncontrolled). */
	defaultPage?: number
	/** Called when the page changes. */
	onChange?: (page: number) => void
	/** How many sibling pages to show on each side of the current page. Default 1. */
	siblingCount?: number
	/** How many pages to always show at the start/end (boundary). Default 1. */
	boundaryCount?: number
	'aria-label'?: string
}

export type PaginationListProps = Record<string, never>

export interface PaginationItemProps {
	/** Page number (1-based). */
	page: number
	disabled?: boolean
}

export interface PaginationButtonProps {
	disabled?: boolean
}

export type PaginationEllipsisProps = Record<string, never>

/** A page entry computed by the Pagination engine. `'ellipsis'` marks a gap. */
export type PaginationItemValue = number | 'ellipsis'

export interface PaginationContextValue {
	page: ComputedRef<number>
	totalPages: ComputedRef<number>
	items: ComputedRef<PaginationItemValue[]>
	canPrev: ComputedRef<boolean>
	canNext: ComputedRef<boolean>
	goTo: (page: number) => void
	prev: () => void
	next: () => void
}
