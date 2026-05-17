import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	For,
	Show,
	splitProps,
	untrack,
	useContext,
	type JSX,
} from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	ComboboxContentProps,
	ComboboxContextValue,
	ComboboxEmptyProps,
	ComboboxInputProps,
	ComboboxItemRenderProps,
	ComboboxItemsProps,
	ComboboxOption,
	ComboboxRootProps,
	ComboboxTriggerProps,
} from './Combobox.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function defaultFilter(option: ComboboxOption, input: string) {
	return option.label.toLowerCase().includes(input.trim().toLowerCase());
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext() {
	const ctx = useContext(ComboboxContext);
	if (!ctx) throw new Error('Combobox compound components must be used within Combobox.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: ComboboxRootProps) {
	const [local, rest] = splitProps(props, [
		'options',
		'value',
		'defaultValue',
		'onChange',
		'inputValue',
		'defaultInputValue',
		'onInputChange',
		'filter',
		'disabled',
		'open',
		'defaultOpen',
		'onOpenChange',
		'children',
		'class',
		'ref',
	]);

	// --- selected ---
	// onChange handled manually in commitOption (needs the option object alongside the value).
	const [selected, setSelected] = createControllableState<string | null>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? null,
	});

	// --- input text ---
	// Initial value derived once at setup from defaultValue → label lookup.
	// The createEffect below re-syncs the input when `selected` changes externally.
	const initialInput =
		local.defaultInputValue ??
		// eslint-disable-next-line solid/reactivity
		(local.defaultValue ? (local.options.find((o) => o.value === local.defaultValue)?.label ?? '') : '');
	const [inputValue, setInputValue] = createControllableState<string>({
		get value() {
			return local.inputValue;
		},
		defaultValue: initialInput,
		get onChange() {
			return local.onInputChange;
		},
	});

	// --- open ---
	const [open, setOpen] = createControllableState<boolean>({
		get value() {
			return local.open;
		},
		defaultValue: local.defaultOpen ?? false,
		get onChange() {
			return local.onOpenChange;
		},
	});

	// --- filtered options ---
	const filterFn = () => local.filter ?? defaultFilter;
	const filtered = createMemo(() => {
		const iv = inputValue();
		if (!iv) return local.options;
		return local.options.filter((o) => filterFn()(o, iv));
	});

	// --- highlight ---
	const [highlightedIndex, setHighlightedIndex] = createSignal<number>(-1);

	// Reset highlight when listbox opens/filters change
	createEffect(() => {
		const isOpen = open();
		const list = filtered();
		const curr = untrack(highlightedIndex);
		const sel = untrack(selected);
		if (!isOpen) {
			setHighlightedIndex(-1);
			return;
		}
		if (curr >= list.length) {
			setHighlightedIndex(list.length === 0 ? -1 : 0);
		} else if (curr === -1 && list.length > 0) {
			const selectedIdx = list.findIndex((o) => o.value === sel);
			setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
		}
	});

	const moveHighlight = (delta: number) => {
		const list = filtered();
		if (list.length === 0) return;
		let i = highlightedIndex();
		const len = list.length;
		for (let attempt = 0; attempt < len; attempt++) {
			i = (i + delta + len) % len;
			if (!list[i].disabled) {
				setHighlightedIndex(i);
				return;
			}
		}
	};

	let inputFocused = false;

	const commitOption = (option: ComboboxOption) => {
		if (option.disabled) return;
		setSelected(option.value);
		setInputValue(option.label);
		local.onChange?.(option.value, option);
		setOpen(false);
	};

	let rootEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (rootEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	createClickOutside(
		() => rootEl,
		() => {
			if (open()) setOpen(false);
		},
	);

	// Sync input text with selected option label when selection changes externally and input not focused.
	createEffect(() => {
		const sel = selected();
		if (local.inputValue !== undefined || inputFocused) return;
		const opt = local.options.find((o) => o.value === sel) ?? null;
		setInputValue(opt ? opt.label : '');
	});

	const baseId = createId();
	const listboxId = `${baseId}-listbox`;
	const getOptionId = (v: string) => `${baseId}-opt-${v}`;

	const ctxValue: ComboboxContextValue = {
		get options() {
			return local.options;
		},
		get filtered() {
			return filtered();
		},
		get selected() {
			return selected();
		},
		get inputValue() {
			return inputValue() ?? '';
		},
		get open() {
			return !!open();
		},
		get highlightedIndex() {
			return highlightedIndex();
		},
		get disabled() {
			return !!local.disabled;
		},
		get listboxId() {
			return listboxId;
		},
		getOptionId,
		setOpen: (next: boolean) => setOpen(next),
		setInputValue: (text: string) => setInputValue(text),
		commitOption,
		setHighlightedIndex,
		moveHighlight,
	};

	const handleFocusCapture: JSX.EventHandler<HTMLDivElement, FocusEvent> = (e) => {
		const target = e.target as HTMLElement | null;
		if (target?.tagName === 'INPUT') inputFocused = true;
	};
	const handleBlurCapture: JSX.EventHandler<HTMLDivElement, FocusEvent> = (e) => {
		const target = e.target as HTMLElement | null;
		if (target?.tagName === 'INPUT') inputFocused = false;
	};

	return (
		<ComboboxContext.Provider value={ctxValue}>
			<div
				ref={mergedRef}
				class={local.class}
				data-state={open() ? 'open' : 'closed'}
				data-disabled={local.disabled ? '' : undefined}
				{...rest}
				onFocusIn={handleFocusCapture}
				onFocusOut={handleBlurCapture}>
				{local.children}
			</div>
		</ComboboxContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

function Input(props: ComboboxInputProps) {
	const [local, rest] = splitProps(props, ['class', 'onKeyDown', 'onFocus']);
	const ctx = useComboboxContext();

	const activeId = () => {
		const opt = ctx.filtered[ctx.highlightedIndex];
		return ctx.highlightedIndex >= 0 && opt ? ctx.getOptionId(opt.value) : undefined;
	};

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
		if (e.defaultPrevented || ctx.disabled) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!ctx.open) ctx.setOpen(true);
			else ctx.moveHighlight(1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!ctx.open) ctx.setOpen(true);
			else ctx.moveHighlight(-1);
		} else if (e.key === 'Home' && ctx.open) {
			e.preventDefault();
			if (ctx.filtered.length > 0) ctx.setHighlightedIndex(0);
		} else if (e.key === 'End' && ctx.open) {
			e.preventDefault();
			if (ctx.filtered.length > 0) ctx.setHighlightedIndex(ctx.filtered.length - 1);
		} else if (e.key === 'Enter' && ctx.open) {
			if (ctx.highlightedIndex >= 0 && ctx.filtered[ctx.highlightedIndex]) {
				e.preventDefault();
				ctx.commitOption(ctx.filtered[ctx.highlightedIndex]);
			}
		} else if (e.key === 'Escape' && ctx.open) {
			e.preventDefault();
			ctx.setOpen(false);
		}
	};

	const handleFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
		if (!ctx.open) ctx.setOpen(true);
		const userOnFocus = local.onFocus;
		if (typeof userOnFocus === 'function') {
			(userOnFocus as (event: typeof e) => void)(e);
		}
	};

	return (
		<input
			type='text'
			role='combobox'
			autocomplete='off'
			aria-autocomplete='list'
			aria-expanded={ctx.open}
			aria-controls={ctx.listboxId}
			aria-activedescendant={activeId()}
			disabled={ctx.disabled}
			value={ctx.inputValue}
			class={local.class}
			{...rest}
			onInput={(e) => {
				ctx.setInputValue(e.currentTarget.value);
				if (!ctx.open) ctx.setOpen(true);
			}}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}
		/>
	);
}

// ---------------------------------------------------------------------------
// Trigger (chevron / clear)
// ---------------------------------------------------------------------------

function Trigger(props: ComboboxTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useComboboxContext();
	const state = createInteractiveState({
		get disabled() {
			return ctx.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.setOpen(!ctx.open);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			tabIndex={-1}
			disabled={ctx.disabled}
			aria-label='Toggle options'
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Content (listbox)
// ---------------------------------------------------------------------------

function Content(props: ComboboxContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useComboboxContext();

	return (
		<Show when={ctx.open}>
			<div
				id={ctx.listboxId}
				role='listbox'
				class={local.class}
				data-state='open'
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Items render-prop
// ---------------------------------------------------------------------------

function Items(props: ComboboxItemsProps) {
	const ctx = useComboboxContext();

	// Keep the highlighted option visible inside its scroll container.
	createEffect(() => {
		if (!ctx.open || ctx.highlightedIndex < 0) return;
		const opt = ctx.filtered[ctx.highlightedIndex];
		if (!opt) return;
		const el = typeof document !== 'undefined' ? document.getElementById(ctx.getOptionId(opt.value)) : null;
		if (!el) return;

		// Find nearest scrollable ancestor (so the page never gets scrolled).
		let container: HTMLElement | null = el.parentElement;
		while (container) {
			const overflowY = getComputedStyle(container).overflowY;
			if (
				(overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
				container.scrollHeight > container.clientHeight
			) {
				break;
			}
			container = container.parentElement;
		}
		if (!container) return;

		const elRect = el.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const relativeTop = elRect.top - containerRect.top + container.scrollTop;
		const relativeBottom = relativeTop + el.offsetHeight;
		const viewTop = container.scrollTop;
		const viewBottom = viewTop + container.clientHeight;

		if (relativeTop < viewTop) {
			container.scrollTop = relativeTop;
		} else if (relativeBottom > viewBottom) {
			container.scrollTop = relativeBottom - container.clientHeight;
		}
	});

	return (
		<For each={ctx.filtered}>
			{(option, index) => {
				// Stable object with reactive getters. The consumer's render-prop is
				// called ONCE so the returned JSX subtree isn't re-created on every
				// highlight change — that would otherwise detach descendants mid-event
				// and break `userEvent.click`. Consumers that need reactivity should
				// access `renderProps.highlighted` etc. without destructuring.
				const renderProps: ComboboxItemRenderProps = {
					option,
					get highlighted() {
						return index() === ctx.highlightedIndex;
					},
					get selected() {
						return option.value === ctx.selected;
					},
				};
				const content = props.children(renderProps);
				return (
					<div
						id={ctx.getOptionId(option.value)}
						role='option'
						class='group'
						aria-selected={option.value === ctx.selected}
						aria-disabled={option.disabled || undefined}
						data-highlighted={index() === ctx.highlightedIndex ? '' : undefined}
						data-selected={option.value === ctx.selected ? '' : undefined}
						data-disabled={option.disabled ? '' : undefined}
						onMouseEnter={() => ctx.setHighlightedIndex(index())}
						onClick={() => ctx.commitOption(option)}>
						{content}
					</div>
				);
			}}
		</For>
	);
}

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

function Empty(props: ComboboxEmptyProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useComboboxContext();

	return (
		<Show when={ctx.filtered.length === 0}>
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

export const Combobox = { Root, Input, Trigger, Content, Items, Empty };
