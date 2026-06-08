'use client';

import { createContext, createSignal, For, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import type {
	TagInputContextValue,
	TagInputFieldProps,
	TagInputListProps,
	TagInputRootProps,
} from './TagInput.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TagInputContext = createContext<TagInputContextValue | null>(null);

function useTagInputContext() {
	const ctx = useContext(TagInputContext);
	if (!ctx) throw new Error('TagInput compound components must be used within TagInput.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: TagInputRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'disabled',
		'maxTags',
		'allowDuplicates',
		'commitKeys',
		'validate',
		'children',
		'class',
	]);

	const [tags, setTags] = createControllableState<string[]>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? [],
		get onChange() {
			return local.onChange;
		},
	});

	const addTag = (raw: string): boolean => {
		if (local.disabled) return false;
		const trimmed = raw.trim();
		if (!trimmed) return false;
		const current = tags();
		if (local.maxTags !== undefined && current.length >= local.maxTags) return false;
		if (!local.allowDuplicates && current.includes(trimmed)) return false;
		if (local.validate && !local.validate(trimmed, current)) return false;
		setTags([...current, trimmed]);
		return true;
	};

	const removeTag = (index: number) => {
		if (local.disabled) return;
		setTags(tags().filter((_, i) => i !== index));
	};

	const ctxValue: TagInputContextValue = {
		get tags() {
			return tags();
		},
		get disabled() {
			return !!local.disabled;
		},
		get maxTags() {
			return local.maxTags;
		},
		addTag,
		removeTag,
		get commitKeys() {
			return local.commitKeys ?? ['Enter', ','];
		},
	};

	return (
		<TagInputContext.Provider value={ctxValue}>
			<div
				class={local.class}
				data-disabled={local.disabled ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</TagInputContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Items render-prop
// ---------------------------------------------------------------------------

interface TagInputItemsProps {
	children: (tag: string, index: number, remove: () => void) => JSX.Element;
}

function Items(props: TagInputItemsProps) {
	const ctx = useTagInputContext();
	return (
		<For each={ctx.tags}>
			{(tag, i) => {
				// Snapshot index at render time. `i` shifts when items above are removed,
				// but the render-prop result is created once per item and stable thereafter.
				// The remove callback re-reads `i()` so it always removes the current
				// position, not the original.
				// eslint-disable-next-line solid/reactivity
				return props.children(tag, i(), () => ctx.removeTag(i()));
			}}
		</For>
	);
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

function List(props: TagInputListProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<div
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

function Field(props: TagInputFieldProps) {
	const [local, rest] = splitProps(props, ['class', 'onKeyDown', 'placeholder', 'onBlur']);
	const ctx = useTagInputContext();
	const [text, setText] = createSignal('');

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
		if (e.defaultPrevented) return;
		const current = text();
		if (ctx.commitKeys.includes(e.key)) {
			if (current.trim()) {
				e.preventDefault();
				if (ctx.addTag(current)) setText('');
			}
		} else if (e.key === 'Backspace' && current === '' && ctx.tags.length > 0) {
			e.preventDefault();
			ctx.removeTag(ctx.tags.length - 1);
		}
	};

	const atMax = () => ctx.maxTags !== undefined && ctx.tags.length >= ctx.maxTags;

	const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
		const current = text();
		if (current.trim()) {
			ctx.addTag(current);
			setText('');
		}
		const userOnBlur = local.onBlur;
		if (typeof userOnBlur === 'function') {
			(userOnBlur as (event: typeof e) => void)(e);
		}
	};

	return (
		<input
			type='text'
			value={text()}
			disabled={ctx.disabled || atMax()}
			placeholder={atMax() ? undefined : local.placeholder}
			class={local.class}
			{...rest}
			onInput={(e) => setText(e.currentTarget.value)}
			onKeyDown={handleKeyDown}
			onBlur={handleBlur}
		/>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const TagInput = { Root, List, Items, Field };

export { Root, List, Items, Field };