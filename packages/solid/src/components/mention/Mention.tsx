import { createContext, createMemo, createSignal, createUniqueId, useContext, splitProps, Show, For, mergeProps, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
import { createMergedRefs } from '@/primitives/create-merged-refs';
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

interface MentionState {
	open: boolean;
	query: string;
	triggerIndex: number;
	coords: MentionCoords;
}

const CLOSED: MentionState = { open: false, query: '', triggerIndex: -1, coords: { top: 0, left: 0 } };

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: MentionRootProps) {
	const merged = mergeProps(
		{ defaultValue: '', trigger: '@', filter: defaultFilter, appendSpace: true, disabled: false },
		props,
	);
	const [local, rest] = splitProps(merged, [
		'options',
		'value',
		'defaultValue',
		'onChange',
		'trigger',
		'filter',
		'onSelect',
		'appendSpace',
		'disabled',
		'class',
		'children',
	]);

	const [text, setText] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue,
		get onChange() {
			return local.onChange;
		},
	});

	const [state, setState] = createSignal<MentionState>(CLOSED);
	const [activeIndex, setActiveIndex] = createSignal(0);

	let inputEl: HTMLTextAreaElement | undefined;
	const setInputRef = (el: HTMLTextAreaElement) => (inputEl = el);
	const getInputEl = () => inputEl;

	let prevQuery: string | null = null;
	// Trigger index currently dismissed via Escape — suppresses re-opening
	// until the text changes or the caret leaves the token.
	let dismissed: number | null = null;
	let triggerIndex = -1;

	const baseId = createId('mention');
	const listboxId = `${baseId}-listbox`;
	const getOptionId = (index: number) => `${baseId}-opt-${index}`;

	const filtered = createMemo<MentionOption[]>(() => {
		const s = state();
		if (!s.open) return [];
		return local.options.filter((o) => local.filter(o, s.query));
	});

	const close = () => {
		prevQuery = null;
		setState((prev) => (prev.open ? CLOSED : prev));
	};

	const detect = (value: string, caret: number) => {
		if (local.disabled) {
			close();
			return;
		}
		const found = detectMention(value, caret, local.trigger);
		if (!found) {
			dismissed = null;
			close();
			return;
		}
		triggerIndex = found.triggerIndex;
		if (found.triggerIndex === dismissed) {
			close();
			return;
		}
		const el = inputEl;
		const coords = el ? caretCoordinates(el, found.triggerIndex) : { top: 0, left: 0 };
		if (prevQuery !== found.query) setActiveIndex(0);
		prevQuery = found.query;
		setState({ open: true, query: found.query, triggerIndex: found.triggerIndex, coords });
	};

	const dismiss = () => {
		dismissed = triggerIndex;
		close();
	};

	const handleChange = (value: string, caret: number) => {
		dismissed = null;
		setText(value);
		detect(value, caret);
	};

	const handleCaret = (caret: number) => {
		detect(text(), caret);
	};

	const moveActive = (delta: number) => {
		const list = filtered();
		if (list.length === 0) return;
		setActiveIndex((curr) => {
			let i = curr;
			for (let attempt = 0; attempt < list.length; attempt++) {
				i = (i + delta + list.length) % list.length;
				if (!list[i].disabled) return i;
			}
			return curr;
		});
	};

	const select = (option: MentionOption) => {
		if (option.disabled) return;
		const el = inputEl;
		const ti = state().triggerIndex;
		if (ti < 0) {
			close();
			return;
		}
		const caret = el?.selectionStart ?? ti + 1 + state().query.length;
		const inserted = `${local.trigger}${option.value ?? option.label}${local.appendSpace ? ' ' : ''}`;
		const next = text().slice(0, ti) + inserted + text().slice(caret);
		setText(next);
		local.onSelect?.(option);
		close();

		const newCaret = ti + inserted.length;
		globalThis.requestAnimationFrame(() => {
			if (el) {
				el.focus();
				el.setSelectionRange(newCaret, newCaret);
			}
		});
	};

	const ctx: MentionContextValue = {
		get text() {
			return text() ?? '';
		},
		get options() {
			return local.options;
		},
		get filtered() {
			return filtered();
		},
		get open() {
			return state().open;
		},
		get query() {
			return state().query;
		},
		get activeIndex() {
			return activeIndex();
		},
		get disabled() {
			return local.disabled;
		},
		get coords() {
			return state().coords;
		},
		listboxId,
		getOptionId,
		setInputRef,
		getInputEl,
		setActiveIndex,
		moveActive,
		select,
		close,
		dismiss,
		handleChange,
		handleCaret,
	};

	return (
		<MentionContext.Provider value={ctx}>
			<div
				class={local.class}
				data-disabled={local.disabled ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</MentionContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Input (textarea)
// ---------------------------------------------------------------------------

function Input(props: MentionInputProps & { ref?: (el: HTMLTextAreaElement) => void }) {
	const [local, rest] = splitProps(props, [
		'ref',
		'onKeyDown',
		'onKeyUp',
		'onClick',
		'onChange',
		'onBlur',
	]);
	const ctx = useMentionContext();
	const mergedRef = createMergedRefs<HTMLTextAreaElement>(
		(el) => ctx.setInputRef(el),
		(el) => local.ref?.(el),
	);

	const activeId = () =>
		ctx.open && ctx.filtered[ctx.activeIndex] ? ctx.getOptionId(ctx.activeIndex) : undefined;

	// The `role="combobox"` wrapper needs its own accessible name. The consumer
	// names the textbox (via aria-label/aria-labelledby on Mention.Input), so the
	// wrapper borrows that name via aria-labelledby pointing at the textarea. This
	// keeps a single labelled element (the textarea) while still naming the
	// combobox — unlike React, which duplicates aria-label onto both (its tests
	// query by role; the Solid suite queries by label text, which requires the
	// name to be unique).
	const textareaId = createUniqueId();
	const ownLabelledBy = () => (rest as Record<string, unknown>)['aria-labelledby'] as string | undefined;
	// If the consumer named the textarea via aria-label, the wrapper references the
	// textarea; if they used aria-labelledby, the wrapper reuses the same target.
	const comboboxLabelledBy = () => ownLabelledBy() ?? textareaId;

	const callUserHandler = <E,>(handler: unknown, e: E) => {
		if (typeof handler === 'function') (handler as (event: E) => void)(e);
	};

	const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (e) => {
		callUserHandler(local.onKeyDown, e);
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

	const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
		const el = e.currentTarget;
		ctx.handleChange(el.value, el.selectionStart ?? el.value.length);
		callUserHandler(local.onChange, e);
	};

	const handleKeyUp: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (e) => {
		ctx.handleCaret(e.currentTarget.selectionStart ?? 0);
		callUserHandler(local.onKeyUp, e);
	};

	const handleClick: JSX.EventHandler<HTMLTextAreaElement, MouseEvent> = (e) => {
		ctx.handleCaret(e.currentTarget.selectionStart ?? 0);
		callUserHandler(local.onClick, e);
	};

	const handleBlur: JSX.EventHandler<HTMLTextAreaElement, FocusEvent> = (e) => {
		ctx.close();
		callUserHandler(local.onBlur, e);
	};

	// ARIA 1.2 combobox pattern: a `role="combobox"` wrapper owns the listbox
	// (`aria-controls`/`aria-expanded`/`aria-haspopup`), while the focusable
	// textarea stays a `textbox`. `aria-expanded`/`aria-controls` are not allowed
	// on a bare textarea, so they live on the wrapper; the textarea keeps the
	// textbox-allowed `aria-autocomplete`/`aria-activedescendant`.
	return (
		<div
			role='combobox'
			aria-expanded={ctx.open}
			aria-controls={ctx.listboxId}
			aria-haspopup='listbox'
			aria-labelledby={comboboxLabelledBy()}>
			<textarea
				ref={mergedRef}
				id={textareaId}
				value={ctx.text}
				disabled={ctx.disabled}
				aria-autocomplete='list'
				aria-activedescendant={activeId()}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
				onClick={handleClick}
				onBlur={handleBlur}
				{...rest}
			/>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Content (anchored listbox)
// ---------------------------------------------------------------------------

function Content(props: MentionContentProps) {
	const [local, rest] = splitProps(props, ['class', 'style', 'children']);
	const ctx = useMentionContext();

	const mergedStyle = (): JSX.CSSProperties => {
		const base: JSX.CSSProperties = {
			position: 'absolute',
			top: `${ctx.coords.top}px`,
			left: `${ctx.coords.left}px`,
		};
		const userStyle = local.style;
		if (typeof userStyle === 'string' || !userStyle) return base;
		return { ...base, ...(userStyle as JSX.CSSProperties) };
	};

	return (
		<Show when={ctx.open}>
			<div
				id={ctx.listboxId}
				role='listbox'
				class={local.class}
				data-state='open'
				style={mergedStyle()}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Items (render-prop)
// ---------------------------------------------------------------------------

function Items(props: MentionItemsProps) {
	const ctx = useMentionContext();
	return (
		<For each={ctx.filtered}>
			{(option, index) => {
				const active = () => index() === ctx.activeIndex;
				return (
					<div
						id={ctx.getOptionId(index())}
						role='option'
						aria-selected={active()}
						aria-disabled={option.disabled || undefined}
						data-active={active() ? '' : undefined}
						data-disabled={option.disabled ? '' : undefined}
						onMouseEnter={() => ctx.setActiveIndex(index())}
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => {
							if (!option.disabled) ctx.select(option);
						}}>
						{props.children({ option, active: active(), index: index() })}
					</div>
				);
			}}
		</For>
	);
}

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

function Empty(props: MentionEmptyProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useMentionContext();
	return (
		<Show when={ctx.open && ctx.filtered.length === 0}>
			<div
				role='presentation'
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

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

export { Root, Input, Content, Items, Empty };
