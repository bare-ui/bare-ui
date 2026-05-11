import type { JSX } from 'solid-js';

export interface BreadcrumbRootProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Accessible label for the navigation landmark. Defaults to "Breadcrumb". */
	'aria-label'?: string;
}

export type BreadcrumbListProps = JSX.OlHTMLAttributes<HTMLOListElement>;

export interface BreadcrumbItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
	/** Marks this item as the current page (sets aria-current and data-current). */
	current?: boolean;
}

export interface BreadcrumbLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Render the child element instead of `<a>` (Solid: applies attributes via DOM API). */
	asChild?: boolean;
}

export type BreadcrumbSeparatorProps = JSX.HTMLAttributes<HTMLSpanElement>;
