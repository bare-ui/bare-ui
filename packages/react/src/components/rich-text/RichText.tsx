'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
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
	if (!ctx) throw new globalThis.Error('RichText sub-components must be used within RichText.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, RichTextRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onChange,
			mode: controlledMode,
			defaultMode = 'edit',
			onModeChange,
			parse,
			components,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const [value, setValue] = useControllableState<string>({
			value: controlledValue,
			defaultValue,
			onChange,
		});
		const [mode, setMode] = useControllableState({
			value: controlledMode,
			defaultValue: defaultMode,
			onChange: onModeChange,
		});

		const editorRef = useRef<HTMLTextAreaElement | null>(null);

		const wrapSelection = useCallback(
			(before: string, after = before) => {
				const el = editorRef.current;
				const start = el?.selectionStart ?? value.length;
				const end = el?.selectionEnd ?? value.length;
				const selected = value.slice(start, end);
				const next = value.slice(0, start) + before + selected + after + value.slice(end);
				setValue(next);
				globalThis.requestAnimationFrame(() => {
					if (!el) return;
					el.focus();
					el.setSelectionRange(start + before.length, end + before.length);
				});
			},
			[value, setValue],
		);

		const insert = useCallback(
			(text: string) => {
				const el = editorRef.current;
				const start = el?.selectionStart ?? value.length;
				const end = el?.selectionEnd ?? value.length;
				const next = value.slice(0, start) + text + value.slice(end);
				setValue(next);
				globalThis.requestAnimationFrame(() => {
					if (!el) return;
					el.focus();
					const caret = start + text.length;
					el.setSelectionRange(caret, caret);
				});
			},
			[value, setValue],
		);

		const ctx = useMemo<RichTextContextValue>(
			() => ({ value, setValue, mode, setMode, editorRef, wrapSelection, insert, parse, components }),
			[value, setValue, mode, setMode, wrapSelection, insert, parse, components],
		);

		return (
			<RichTextContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-mode={mode}
					{...rest}>
					{children}
				</div>
			</RichTextContext.Provider>
		);
	},
);

Root.displayName = 'RichText.Root';

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

const Toolbar = React.forwardRef<HTMLDivElement, RichTextToolbarProps>(({ className, children, ...rest }, ref) => (
	<div
		ref={ref}
		role='toolbar'
		className={className}
		{...rest}>
		{children}
	</div>
));

Toolbar.displayName = 'RichText.Toolbar';

// ---------------------------------------------------------------------------
// Action
// ---------------------------------------------------------------------------

const Action = React.forwardRef<HTMLButtonElement, RichTextActionProps>(
	({ wrap, insert, className, children, onClick, ...rest }, ref) => {
		const ctx = useRichTextContext();
		return (
			<button
				ref={ref}
				type='button'
				className={className}
				// Keep the editor's selection — buttons would otherwise steal focus.
				onMouseDown={(e) => e.preventDefault()}
				{...rest}
				onClick={(e) => {
					if (wrap !== undefined) {
						if (Array.isArray(wrap)) ctx.wrapSelection(wrap[0], wrap[1]);
						else ctx.wrapSelection(wrap);
					}
					if (insert !== undefined) ctx.insert(insert);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Action.displayName = 'RichText.Action';

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

const Editor = React.forwardRef<HTMLTextAreaElement, RichTextEditorProps>(({ className, ...rest }, ref) => {
	const ctx = useRichTextContext();
	const mergedRef = useMergedRefs(ctx.editorRef, ref);
	if (ctx.mode === 'preview') return null;

	return (
		<textarea
			ref={mergedRef}
			value={ctx.value}
			data-mode={ctx.mode}
			className={className}
			{...rest}
			onChange={(e) => ctx.setValue(e.target.value)}
		/>
	);
});

Editor.displayName = 'RichText.Editor';

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

const Preview = React.forwardRef<HTMLDivElement, RichTextPreviewProps>(({ className, ...rest }, ref) => {
	const ctx = useRichTextContext();
	if (ctx.mode === 'edit') return null;

	return (
		<Markdown
			ref={ref}
			content={ctx.value}
			parse={ctx.parse}
			components={ctx.components}
			data-mode={ctx.mode}
			className={className}
			{...rest}
		/>
	);
});

Preview.displayName = 'RichText.Preview';

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

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `RichText.*`).
export { Root, Toolbar, Action, Editor, Preview };
