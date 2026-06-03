'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import type {
	TagInputContextValue,
	TagInputFieldProps,
	TagInputListProps,
	TagInputRootProps,
	TagInputTagProps,
} from './TagInput.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TagInputContext = createContext<TagInputContextValue | null>(null);

function useTagInputContext() {
	const ctx = useContext(TagInputContext);
	if (!ctx) throw new globalThis.Error('TagInput compound components must be used within TagInput.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, TagInputRootProps>(
	(
		{
			value: controlledValue,
			defaultValue,
			onChange,
			disabled = false,
			maxTags,
			allowDuplicates = false,
			commitKeys = ['Enter', ','],
			validate,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [tags, setTagsState] = useControllableState<string[]>({
			value: controlledValue,
			defaultValue: defaultValue ?? [],
			onChange,
		});

		const setTags = useCallback((next: string[]) => setTagsState(next), [setTagsState]);

		const addTag = useCallback(
			(raw: string): boolean => {
				if (disabled) return false;
				const trimmed = raw.trim();
				if (!trimmed) return false;
				if (maxTags !== undefined && tags.length >= maxTags) return false;
				if (!allowDuplicates && tags.includes(trimmed)) return false;
				if (validate && !validate(trimmed, tags)) return false;
				setTags([...tags, trimmed]);
				return true;
			},
			[disabled, maxTags, allowDuplicates, tags, setTags, validate],
		);

		const removeTag = useCallback(
			(index: number) => {
				if (disabled) return;
				setTags(tags.filter((_, i) => i !== index));
			},
			[disabled, tags, setTags],
		);

		const ctx = useMemo<TagInputContextValue>(
			() => ({ tags, disabled, maxTags, addTag, removeTag, commitKeys }),
			[tags, disabled, maxTags, addTag, removeTag, commitKeys],
		);

		return (
			<TagInputContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</TagInputContext.Provider>
		);
	},
);
Root.displayName = 'TagInput.Root';

// ---------------------------------------------------------------------------
// List (renders the existing tags via render-prop)
// ---------------------------------------------------------------------------

interface TagInputItemsProps {
	children: (tag: string, index: number, remove: () => void) => React.ReactNode;
}

const Items: React.FC<TagInputItemsProps> = ({ children }) => {
	const { tags, removeTag } = useTagInputContext();
	return <>{tags.map((tag, i) => children(tag, i, () => removeTag(i)))}</>;
};
Items.displayName = 'TagInput.Items';

const List = React.forwardRef<HTMLDivElement, TagInputListProps>(({ children, className, ...rest }, ref) => (
	<div
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</div>
));
List.displayName = 'TagInput.List';

// ---------------------------------------------------------------------------
// Tag — an accessible, keyboard-removable chip (optional convenience over the
// raw Items render-prop).
// ---------------------------------------------------------------------------

const Tag = React.forwardRef<HTMLSpanElement, TagInputTagProps>(
	({ label, onRemove, removeLabel, removeContent = '×', removeClassName, children, className, ...rest }, ref) => (
		<span
			ref={ref}
			data-taginput-tag=''
			className={className}
			{...rest}>
			{children ?? label}
			<button
				type='button'
				data-taginput-remove=''
				className={removeClassName}
				aria-label={removeLabel ?? `Remove ${label}`}
				onClick={(e) => {
					// Move focus to an adjacent remove button *before* this one unmounts,
					// so keyboard focus isn't dropped to <body>.
					const list = e.currentTarget.closest('[data-taginput-tag]')?.parentElement;
					const buttons = list
						? Array.from(list.querySelectorAll<HTMLElement>('[data-taginput-remove]'))
						: [];
					const idx = buttons.indexOf(e.currentTarget);
					(buttons[idx + 1] ?? buttons[idx - 1])?.focus();
					onRemove();
				}}>
				{removeContent}
			</button>
		</span>
	),
);
Tag.displayName = 'TagInput.Tag';

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

const Field = React.forwardRef<HTMLInputElement, TagInputFieldProps>(
	({ className, onKeyDown, placeholder, ...rest }, ref) => {
		const { addTag, removeTag, tags, disabled, commitKeys, maxTags } = useTagInputContext();
		const [text, setText] = useState('');

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(e);
			if (e.defaultPrevented) return;
			if (commitKeys.includes(e.key)) {
				if (text.trim()) {
					e.preventDefault();
					if (addTag(text)) setText('');
				}
			} else if (e.key === 'Backspace' && text === '' && tags.length > 0) {
				e.preventDefault();
				removeTag(tags.length - 1);
			}
		};

		const atMax = maxTags !== undefined && tags.length >= maxTags;

		return (
			<input
				ref={ref}
				type='text'
				value={text}
				disabled={disabled || atMax}
				placeholder={atMax ? undefined : placeholder}
				className={className}
				{...rest}
				onChange={(e) => setText(e.currentTarget.value)}
				onKeyDown={handleKeyDown}
				onBlur={(e) => {
					if (text.trim()) {
						addTag(text);
						setText('');
					}
					(rest.onBlur as ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined)?.(e);
				}}
			/>
		);
	},
);
Field.displayName = 'TagInput.Field';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const TagInput = { Root, List, Items, Tag, Field };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `TagInput.*`).
export { Root, List, Items, Tag, Field };
