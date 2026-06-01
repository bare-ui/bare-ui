import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useId } from '@/hooks/use-id';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import type {
	MentionContentProps,
	MentionContextValue,
	MentionCoords,
	MentionEmptyProps,
	MentionInputProps,
	MentionItemsProps,
	MentionOption,
	MentionRootProps,
} from './Mention.types';

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

interface Detection {
	triggerIndex: number;
	query: string;
}

/**
 * Looks backwards from the caret for an active trigger token. The trigger must
 * sit at the start of the text or follow whitespace (so `a@b.com` is ignored),
 * and the query (text between trigger and caret) must contain no whitespace.
 */
function detectMention(text: string, caret: number, trigger: string): Detection | null {
	for (let i = caret - 1; i >= 0; i--) {
		const ch = text[i];
		if (ch === trigger) {
			const boundary = i === 0 || /\s/.test(text[i - 1]);
			return boundary ? { triggerIndex: i, query: text.slice(i + 1, caret) } : null;
		}
		if (/\s/.test(ch)) return null;
	}
	return null;
}

function defaultFilter(option: MentionOption, query: string) {
	return option.label.toLowerCase().includes(query.trim().toLowerCase());
}

// ---------------------------------------------------------------------------
// Caret coordinates (mirror-div technique)
// ---------------------------------------------------------------------------

const MIRROR_PROPS = [
	'boxSizing',
	'width',
	'height',
	'overflowX',
	'overflowY',
	'borderTopWidth',
	'borderRightWidth',
	'borderBottomWidth',
	'borderLeftWidth',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
	'fontStyle',
	'fontVariant',
	'fontWeight',
	'fontStretch',
	'fontSize',
	'lineHeight',
	'fontFamily',
	'textAlign',
	'textTransform',
	'textIndent',
	'letterSpacing',
	'wordSpacing',
	'tabSize',
	'whiteSpace',
	'wordWrap',
];

function caretCoordinates(el: HTMLTextAreaElement, position: number): MentionCoords {
	const doc = el.ownerDocument;
	if (typeof doc.body === 'undefined') return { top: 0, left: 0 };

	const computed = globalThis.getComputedStyle(el);
	const div = doc.createElement('div');
	const divStyle = div.style as unknown as Record<string, string>;
	const computedRecord = computed as unknown as Record<string, string>;

	divStyle.position = 'absolute';
	divStyle.visibility = 'hidden';
	divStyle.whiteSpace = 'pre-wrap';
	divStyle.wordWrap = 'break-word';
	for (const prop of MIRROR_PROPS) divStyle[prop] = computedRecord[prop];
	divStyle.overflow = 'hidden';

	div.textContent = el.value.slice(0, position);
	const span = doc.createElement('span');
	span.textContent = el.value.slice(position) || '.';
	div.appendChild(span);
	doc.body.appendChild(div);

	const borderTop = parseInt(computed.borderTopWidth) || 0;
	const borderLeft = parseInt(computed.borderLeftWidth) || 0;
	const lineHeight = parseInt(computed.lineHeight) || parseInt(computed.fontSize) * 1.2 || 0;
	const top = span.offsetTop + borderTop;
	const left = span.offsetLeft + borderLeft;
	doc.body.removeChild(div);

	return {
		top: el.offsetTop + top + lineHeight - el.scrollTop,
		left: el.offsetLeft + left - el.scrollLeft,
	};
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const MentionContext = createContext<MentionContextValue | null>(null);

function useMentionContext() {
	const ctx = useContext(MentionContext);
	if (!ctx) throw new globalThis.Error('Mention sub-components must be used within Mention.Root');
	return ctx;
}

const CLOSED = { open: false, query: '', triggerIndex: -1, coords: { top: 0, left: 0 } };

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, MentionRootProps>(
	(
		{
			options,
			value: controlledValue,
			defaultValue = '',
			onChange,
			trigger = '@',
			filter = defaultFilter,
			onSelect,
			appendSpace = true,
			disabled = false,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const [text, setText] = useControllableState<string>({
			value: controlledValue,
			defaultValue,
			onChange,
		});

		const [state, setState] = useState(CLOSED);
		const [activeIndex, setActiveIndex] = useState(0);
		const inputRef = useRef<HTMLTextAreaElement | null>(null);
		const prevQueryRef = useRef<string | null>(null);
		// Trigger index currently dismissed via Escape — suppresses re-opening
		// until the text changes or the caret leaves the token.
		const dismissedRef = useRef<number | null>(null);
		const triggerIndexRef = useRef(-1);

		const baseId = useId('mention');
		const listboxId = `${baseId}-listbox`;
		const getOptionId = useCallback((index: number) => `${baseId}-opt-${index}`, [baseId]);

		const filtered = useMemo(() => {
			if (!state.open) return [];
			return options.filter((o) => filter(o, state.query));
		}, [state.open, state.query, options, filter]);

		const close = useCallback(() => {
			prevQueryRef.current = null;
			setState((prev) => (prev.open ? CLOSED : prev));
		}, []);

		const detect = useCallback(
			(value: string, caret: number) => {
				if (disabled) {
					close();
					return;
				}
				const found = detectMention(value, caret, trigger);
				if (!found) {
					dismissedRef.current = null;
					close();
					return;
				}
				triggerIndexRef.current = found.triggerIndex;
				if (found.triggerIndex === dismissedRef.current) {
					close();
					return;
				}
				const el = inputRef.current;
				const coords = el ? caretCoordinates(el, found.triggerIndex) : { top: 0, left: 0 };
				if (prevQueryRef.current !== found.query) setActiveIndex(0);
				prevQueryRef.current = found.query;
				setState({ open: true, query: found.query, triggerIndex: found.triggerIndex, coords });
			},
			[disabled, trigger, close],
		);

		const dismiss = useCallback(() => {
			dismissedRef.current = triggerIndexRef.current;
			close();
		}, [close]);

		const handleChange = useCallback(
			(value: string, caret: number) => {
				dismissedRef.current = null;
				setText(value);
				detect(value, caret);
			},
			[setText, detect],
		);

		const handleCaret = useCallback(
			(caret: number) => {
				detect(text, caret);
			},
			[detect, text],
		);

		const moveActive = useCallback(
			(delta: number) => {
				if (filtered.length === 0) return;
				setActiveIndex((curr) => {
					let i = curr;
					for (let attempt = 0; attempt < filtered.length; attempt++) {
						i = (i + delta + filtered.length) % filtered.length;
						if (!filtered[i].disabled) return i;
					}
					return curr;
				});
			},
			[filtered],
		);

		const select = useCallback(
			(option: MentionOption) => {
				if (option.disabled) return;
				const el = inputRef.current;
				const ti = state.triggerIndex;
				if (ti < 0) {
					close();
					return;
				}
				const caret = el?.selectionStart ?? ti + 1 + state.query.length;
				const inserted = `${trigger}${option.value ?? option.label}${appendSpace ? ' ' : ''}`;
				const next = text.slice(0, ti) + inserted + text.slice(caret);
				setText(next);
				onSelect?.(option);
				close();

				const newCaret = ti + inserted.length;
				globalThis.requestAnimationFrame(() => {
					if (el) {
						el.focus();
						el.setSelectionRange(newCaret, newCaret);
					}
				});
			},
			[state.triggerIndex, state.query, trigger, appendSpace, text, setText, onSelect, close],
		);

		const ctx = useMemo<MentionContextValue>(
			() => ({
				text,
				options,
				filtered,
				open: state.open,
				query: state.query,
				activeIndex,
				disabled,
				coords: state.coords,
				listboxId,
				getOptionId,
				inputRef,
				setActiveIndex,
				moveActive,
				select,
				close,
				dismiss,
				handleChange,
				handleCaret,
			}),
			[
				text,
				options,
				filtered,
				state.open,
				state.query,
				state.coords,
				activeIndex,
				disabled,
				listboxId,
				getOptionId,
				moveActive,
				select,
				close,
				dismiss,
				handleChange,
				handleCaret,
			],
		);

		return (
			<MentionContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</MentionContext.Provider>
		);
	},
);

Root.displayName = 'Mention.Root';

// ---------------------------------------------------------------------------
// Input (textarea)
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLTextAreaElement, MentionInputProps>(
	({ className, onKeyDown, onKeyUp, onClick, onChange, onBlur, ...rest }, ref) => {
		const ctx = useMentionContext();
		const mergedRef = useMergedRefs(ctx.inputRef, ref);
		const activeId = ctx.open && ctx.filtered[ctx.activeIndex] ? ctx.getOptionId(ctx.activeIndex) : undefined;
		// The `role="combobox"` wrapper needs its own accessible name; share the
		// one the consumer provides for the textbox so both are named.
		const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy } = rest;

		const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			onKeyDown?.(e);
			if (e.defaultPrevented || !ctx.open || ctx.filtered.length === 0) return;

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				ctx.moveActive(1);
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				ctx.moveActive(-1);
			} else if (e.key === 'Enter' || e.key === 'Tab') {
				const option = ctx.filtered[ctx.activeIndex];
				if (option && !option.disabled) {
					e.preventDefault();
					ctx.select(option);
				}
			} else if (e.key === 'Escape') {
				e.preventDefault();
				ctx.dismiss();
			}
		};

		// ARIA 1.2 combobox pattern: a `role="combobox"` wrapper owns the
		// listbox (`aria-controls`/`aria-expanded`), while the focusable
		// textarea stays a `textbox`. `aria-expanded`/`aria-controls` are not
		// allowed on a bare textarea, so they live on the wrapper; the textarea
		// keeps the textbox-allowed `aria-autocomplete`/`aria-activedescendant`.
		return (
			<div
				role='combobox'
				aria-expanded={ctx.open}
				aria-controls={ctx.listboxId}
				aria-haspopup='listbox'
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}>
				<textarea
					ref={mergedRef}
					value={ctx.text}
					disabled={ctx.disabled}
					aria-autocomplete='list'
					aria-activedescendant={activeId}
					className={className}
					{...rest}
					onChange={(e) => {
						ctx.handleChange(e.target.value, e.target.selectionStart ?? e.target.value.length);
						onChange?.(e);
					}}
					onKeyDown={handleKeyDown}
					onKeyUp={(e) => {
						ctx.handleCaret(e.currentTarget.selectionStart ?? 0);
						onKeyUp?.(e);
					}}
					onClick={(e) => {
						ctx.handleCaret(e.currentTarget.selectionStart ?? 0);
						onClick?.(e);
					}}
					onBlur={(e) => {
						ctx.close();
						onBlur?.(e);
					}}
				/>
			</div>
		);
	},
);

Input.displayName = 'Mention.Input';

// ---------------------------------------------------------------------------
// Content (anchored listbox)
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, MentionContentProps>(
	({ className, style, children, ...rest }, ref) => {
		const ctx = useMentionContext();
		if (!ctx.open) return null;

		return (
			<div
				ref={ref}
				id={ctx.listboxId}
				role='listbox'
				className={className}
				data-state='open'
				style={{ position: 'absolute', top: ctx.coords.top, left: ctx.coords.left, ...style }}
				{...rest}>
				{children}
			</div>
		);
	},
);

Content.displayName = 'Mention.Content';

// ---------------------------------------------------------------------------
// Items (render-prop)
// ---------------------------------------------------------------------------

const Items: React.FC<MentionItemsProps> = ({ children }) => {
	const ctx = useMentionContext();
	return (
		<>
			{ctx.filtered.map((option, index) => {
				const active = index === ctx.activeIndex;
				return (
					<div
						key={option.id}
						id={ctx.getOptionId(index)}
						role='option'
						aria-selected={active}
						aria-disabled={option.disabled || undefined}
						data-active={active ? '' : undefined}
						data-disabled={option.disabled ? '' : undefined}
						onMouseEnter={() => ctx.setActiveIndex(index)}
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => {
							if (!option.disabled) ctx.select(option);
						}}>
						{children({ option, active, index })}
					</div>
				);
			})}
		</>
	);
};

Items.displayName = 'Mention.Items';

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

const Empty = React.forwardRef<HTMLDivElement, MentionEmptyProps>(({ className, children, ...rest }, ref) => {
	const ctx = useMentionContext();
	if (!ctx.open || ctx.filtered.length > 0) return null;
	return (
		<div
			ref={ref}
			role='presentation'
			className={className}
			{...rest}>
			{children}
		</div>
	);
});

Empty.displayName = 'Mention.Empty';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Mention = {
	Root,
	Input,
	Content,
	Items,
	Empty,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Mention.*`).
export { Root, Input, Content, Items, Empty };
