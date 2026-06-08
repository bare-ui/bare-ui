'use client';

import { createContext, splitProps, useContext, Show, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { Markdown } from '../markdown/Markdown';
import type {
	RichTextActionProps,
	RichTextContextValue,
	RichTextEditorProps,
	RichTextPreviewProps,
	RichTextRootProps,
	RichTextToolbarProps,
} from './RichText.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const RichTextContext = createContext<RichTextContextValue | null>(null);

function useRichTextContext() {
	const ctx = useContext(RichTextContext);
	if (!ctx) throw new Error('RichText sub-components must be used within RichText.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: RichTextRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'mode',
		'defaultMode',
		'onModeChange',
		'parse',
		'components',
		'class',
		'children',
	]);

	const [value, setValue] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? '',
		get onChange() {
			return local.onChange;
		},
	});

	const [mode, setMode] = createControllableState<RichTextContextValue['mode']>({
		get value() {
			return local.mode;
		},
		defaultValue: local.defaultMode ?? 'edit',
		get onChange() {
			return local.onModeChange;
		},
	});

	let editorEl: HTMLTextAreaElement | undefined;

	const wrapSelection = (before: string, after = before) => {
		const el = editorEl;
		const current = value();
		const start = el?.selectionStart ?? current.length;
		const end = el?.selectionEnd ?? current.length;
		const selected = current.slice(start, end);
		const next = current.slice(0, start) + before + selected + after + current.slice(end);
		setValue(next);
		globalThis.requestAnimationFrame(() => {
			if (!el) return;
			el.focus();
			el.setSelectionRange(start + before.length, end + before.length);
		});
	};

	const insert = (text: string) => {
		const el = editorEl;
		const current = value();
		const start = el?.selectionStart ?? current.length;
		const end = el?.selectionEnd ?? current.length;
		const next = current.slice(0, start) + text + current.slice(end);
		setValue(next);
		globalThis.requestAnimationFrame(() => {
			if (!el) return;
			el.focus();
			const caret = start + text.length;
			el.setSelectionRange(caret, caret);
		});
	};

	const ctx: RichTextContextValue = {
		get value() {
			return value();
		},
		setValue,
		get mode() {
			return mode();
		},
		setMode,
		setEditorEl: (el) => (editorEl = el),
		wrapSelection,
		insert,
		get parse() {
			return local.parse;
		},
		get components() {
			return local.components;
		},
	};

	return (
		<RichTextContext.Provider value={ctx}>
			<div
				data-mode={mode()}
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</RichTextContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar(props: RichTextToolbarProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	return (
		<div
			role='toolbar'
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Action
// ---------------------------------------------------------------------------

function Action(props: RichTextActionProps) {
	const [local, rest] = splitProps(props, ['wrap', 'insert', 'class', 'children', 'onClick', 'onMouseDown']);
	const ctx = useRichTextContext();

	const handleMouseDown: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		// Keep the editor's selection — buttons would otherwise steal focus.
		e.preventDefault();
		if (typeof local.onMouseDown === 'function') {
			(local.onMouseDown as (event: typeof e) => void)(e);
		}
	};

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		if (local.wrap !== undefined) {
			if (Array.isArray(local.wrap)) ctx.wrapSelection(local.wrap[0], local.wrap[1]);
			else ctx.wrapSelection(local.wrap);
		}
		if (local.insert !== undefined) ctx.insert(local.insert);
		if (typeof local.onClick === 'function') {
			(local.onClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			class={local.class}
			{...rest}
			onMouseDown={handleMouseDown}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

function Editor(props: RichTextEditorProps) {
	const [local, rest] = splitProps(props, ['class', 'ref', 'onInput']);
	const ctx = useRichTextContext();
	// Register the editor with Root and forward any consumer ref. `local.ref` is
	// read lazily inside the callback so it stays a tracked scope.
	const mergedRef = createMergedRefs<HTMLTextAreaElement>(ctx.setEditorEl, (el) => {
		const userRef = local.ref as ((el: HTMLTextAreaElement) => void) | undefined;
		if (typeof userRef === 'function') userRef(el);
	});

	const handleInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
		ctx.setValue(e.currentTarget.value);
		if (typeof local.onInput === 'function') {
			(local.onInput as (event: typeof e) => void)(e);
		}
	};

	return (
		<Show when={ctx.mode !== 'preview'}>
			<textarea
				ref={mergedRef}
				value={ctx.value}
				data-mode={ctx.mode}
				class={local.class}
				{...rest}
				onInput={handleInput}
			/>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

function Preview(props: RichTextPreviewProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useRichTextContext();

	return (
		<Show when={ctx.mode !== 'edit'}>
			<Markdown
				content={ctx.value}
				parse={ctx.parse}
				components={ctx.components}
				data-mode={ctx.mode}
				class={local.class}
				{...rest}
			/>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const RichText = {
	Root,
	Toolbar,
	Action,
	Editor,
	Preview,
};

export { Root, Toolbar, Action, Editor, Preview };