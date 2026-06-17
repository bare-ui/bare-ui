import React from 'react';
import type {
	BreadcrumbItemProps,
	BreadcrumbLinkProps,
	BreadcrumbListProps,
	BreadcrumbRootProps,
	BreadcrumbSeparatorProps,
} from './Breadcrumb.types';

const Root = React.forwardRef<HTMLElement, BreadcrumbRootProps>(
	({ children, className, 'aria-label': ariaLabel = 'Breadcrumb', ...rest }, ref) => (
		<nav
			ref={ref}
			aria-label={ariaLabel}
			className={className}
			{...rest}>
			{children}
		</nav>
	),
);
Root.displayName = 'Breadcrumb.Root';

const List = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(({ children, className, ...rest }, ref) => (
	<ol
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</ol>
));
List.displayName = 'Breadcrumb.List';

const Item = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
	({ current = false, children, className, ...rest }, ref) => (
		<li
			ref={ref}
			className={className}
			aria-current={current ? 'page' : undefined}
			data-current={current ? '' : undefined}
			{...rest}>
			{children}
		</li>
	),
);
Item.displayName = 'Breadcrumb.Item';

const Link = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
	({ asChild = false, children, className, ...rest }, ref) => {
		if (asChild && React.isValidElement(children)) {
			const child = children as React.ReactElement<Record<string, unknown>>;
			// cloneElement assigns the ref to the new element without reading ref.current.
			 
			return React.cloneElement(child, {
				...rest,
				className: [(child.props as { className?: string }).className, className].filter(Boolean).join(' '),
				ref,
			} as Record<string, unknown>);
		}
		return (
			<a
				ref={ref}
				className={className}
				{...rest}>
				{children}
			</a>
		);
	},
);
Link.displayName = 'Breadcrumb.Link';

const Separator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
	({ children = '/', className, ...rest }, ref) => (
		<span
			ref={ref}
			role='presentation'
			aria-hidden='true'
			className={className}
			{...rest}>
			{children}
		</span>
	),
);
Separator.displayName = 'Breadcrumb.Separator';

export const Breadcrumb = { Root, List, Item, Link, Separator };

// Named exports expose the sub-components to Storybook's react-docgen so each one
// gets a documented props table. Not re-exported from the package barrel — the
// public API stays `Breadcrumb.*`.
export { Root, List, Item, Link, Separator };
