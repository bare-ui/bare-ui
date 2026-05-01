import React from 'react';

export interface PaginationRootProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
	/** Total number of pages (>= 1). */
	totalPages: number;
	/** Controlled current page (1-based). */
	page?: number;
	/** Initial page (1-based, uncontrolled). */
	defaultPage?: number;
	/** Called when the page changes. */
	onChange?: (page: number) => void;
	/** How many sibling pages to show on each side of the current page. Default 1. */
	siblingCount?: number;
	/** How many pages to always show at the start/end (boundary). Default 1. */
	boundaryCount?: number;
}

export type PaginationListProps = React.HTMLAttributes<HTMLUListElement>;

export interface PaginationItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
	/** Page number (1-based). */
	page: number;
	/** Disable the button. */
	disabled?: boolean;
}

export interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Disable the button. */
	disabled?: boolean;
}

export type PaginationEllipsisProps = React.HTMLAttributes<HTMLLIElement>;

/** A page entry computed by the Pagination engine. `'ellipsis'` marks a gap. */
export type PaginationItemValue = number | 'ellipsis';

export interface PaginationContextValue {
	page: number;
	totalPages: number;
	items: PaginationItemValue[];
	canPrev: boolean;
	canNext: boolean;
	goTo: (page: number) => void;
	prev: () => void;
	next: () => void;
}
