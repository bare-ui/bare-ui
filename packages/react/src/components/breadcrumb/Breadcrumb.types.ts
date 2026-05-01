import React from 'react';

export interface BreadcrumbRootProps extends React.HTMLAttributes<HTMLElement> {
	/** Accessible label for the navigation landmark. Defaults to "Breadcrumb". */
	'aria-label'?: string;
}

export type BreadcrumbListProps = React.OlHTMLAttributes<HTMLOListElement>;

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
	/** Marks this item as the current page (sets aria-current and data-current). */
	current?: boolean;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Render a different element instead of `<a>`. */
	asChild?: boolean;
}

export type BreadcrumbSeparatorProps = React.HTMLAttributes<HTMLSpanElement>;
