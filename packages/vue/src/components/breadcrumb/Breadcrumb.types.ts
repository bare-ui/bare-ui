export interface BreadcrumbRootProps {
	/** Accessible label for the navigation landmark. Defaults to "Breadcrumb". */
	'aria-label'?: string;
}

export type BreadcrumbListProps = Record<string, never>;

export interface BreadcrumbItemProps {
	/** Marks this item as the current page (sets aria-current and data-current). */
	current?: boolean;
}

export interface BreadcrumbLinkProps {
	/** Render a different element instead of `<a>`. */
	asChild?: boolean;
	href?: string;
}

export type BreadcrumbSeparatorProps = Record<string, never>;
