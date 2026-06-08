'use client';

import { splitProps } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type { TagLabelProps, TagRemoveProps, TagRootProps } from './Tag.types';

function Root(props: TagRootProps) {
	const [local, rest] = splitProps(props, ['disabled', 'class', 'children']);
	return (
		<span
			class={local.class}
			data-disabled={local.disabled ? '' : undefined}
			{...rest}>
			{local.children}
		</span>
	);
}

function Label(props: TagLabelProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	return (
		<span
			class={local.class}
			{...rest}>
			{local.children}
		</span>
	);
}

function Remove(props: TagRemoveProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'aria-label']);
	const state = createInteractiveState();
	const merged = mergeProps(rest, state.handlers);
	const ariaLabel = () => local['aria-label'] ?? 'Remove';

	return (
		<button
			type='button'
			aria-label={ariaLabel()}
			class={local.class}
			{...state.dataAttributes}
			{...merged}>
			{local.children}
		</button>
	);
}

export const Tag = { Root, Label, Remove };

export { Root, Label, Remove };