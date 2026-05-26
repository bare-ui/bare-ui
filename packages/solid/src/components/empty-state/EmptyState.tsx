import { splitProps } from 'solid-js';
import type {
	EmptyStateActionsProps,
	EmptyStateDescriptionProps,
	EmptyStateMediaProps,
	EmptyStateRootProps,
	EmptyStateTitleProps,
} from './EmptyState.types';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: EmptyStateRootProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<div
			role='status'
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Media (icon / illustration slot)
// ---------------------------------------------------------------------------

function Media(props: EmptyStateMediaProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<div
			aria-hidden='true'
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

function Title(props: EmptyStateTitleProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<h3
			class={local.class}
			{...rest}>
			{local.children}
		</h3>
	);
}

// ---------------------------------------------------------------------------
// Description
// ---------------------------------------------------------------------------

function Description(props: EmptyStateDescriptionProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<p
			class={local.class}
			{...rest}>
			{local.children}
		</p>
	);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function Actions(props: EmptyStateActionsProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<div
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const EmptyState = {
	Root,
	Media,
	Title,
	Description,
	Actions,
};
