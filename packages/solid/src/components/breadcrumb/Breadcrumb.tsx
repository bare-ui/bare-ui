'use client';

import { children, createEffect, splitProps, type JSX } from 'solid-js';
import type {
	BreadcrumbItemProps,
	BreadcrumbLinkProps,
	BreadcrumbListProps,
	BreadcrumbRootProps,
	BreadcrumbSeparatorProps,
} from './Breadcrumb.types';

function Root(props: BreadcrumbRootProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'aria-label']);
	const ariaLabel = () => local['aria-label'] ?? 'Breadcrumb';

	return (
		<nav
			aria-label={ariaLabel()}
			class={local.class}
			{...rest}>
			{local.children}
		</nav>
	);
}

function List(props: BreadcrumbListProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<ol
			class={local.class}
			{...rest}>
			{local.children}
		</ol>
	);
}

function Item(props: BreadcrumbItemProps) {
	const [local, rest] = splitProps(props, ['current', 'children', 'class']);
	return (
		<li
			class={local.class}
			aria-current={local.current ? 'page' : undefined}
			data-current={local.current ? '' : undefined}
			{...rest}>
			{local.children}
		</li>
	);
}

function Link(props: BreadcrumbLinkProps) {
	const [local, rest] = splitProps(props, ['asChild', 'children', 'class']);

	// asChild is read once at setup — toggling it post-mount isn't supported.
	// eslint-disable-next-line solid/reactivity
	if (local.asChild) {
		// Solid evaluates JSX children to DOM nodes, so we mutate the child's
		// attributes / class imperatively rather than cloning.
		const resolved = children(() => local.children);

		createEffect(() => {
			const el = resolved() as HTMLElement | null;
			if (!(el instanceof HTMLElement)) return;

			// Merge our class with the child's existing class (preserve both).
			if (local.class) {
				const existing = el.getAttribute('class') ?? '';
				const merged = [existing, local.class].filter(Boolean).join(' ');
				el.setAttribute('class', merged);
			}

			// Forward href and any other anchor-style attrs from `rest`.
			for (const [key, value] of Object.entries(rest)) {
				if (value === undefined || value === null || typeof value === 'function') continue;
				if (key === 'children' || key === 'class') continue;
				el.setAttribute(key, String(value));
			}
		});

		// eslint-disable-next-line solid/components-return-once
		return resolved() as unknown as JSX.Element;
	}

	return (
		<a
			class={local.class}
			{...rest}>
			{local.children}
		</a>
	);
}

function Separator(props: BreadcrumbSeparatorProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<span
			role='presentation'
			aria-hidden='true'
			class={local.class}
			{...rest}>
			{local.children ?? '/'}
		</span>
	);
}

export const Breadcrumb = { Root, List, Item, Link, Separator };

// Named exports expose the sub-components to Storybook's docgen (public API stays `Breadcrumb.*`).
export { Root, List, Item, Link, Separator };