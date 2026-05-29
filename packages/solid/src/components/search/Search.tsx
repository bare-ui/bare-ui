import { createContext, createSignal, onCleanup, onMount, Show, splitProps, untrack, useContext, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createDebouncedCallback } from '@/primitives/create-debounce';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	SearchContentProps,
	SearchContextValue,
	SearchEmptyProps,
	SearchInputProps,
	SearchItemProps,
	SearchOption,
	SearchRootProps,
} from './Search.types';

const SearchContext = createContext<SearchContextValue | null>(null);

function useSearchContext() {
	const context = useContext(SearchContext);
	if (!context) {
		throw new Error('Search compound components must be used within Search.Root');
	}
	return context;
}

function Root(props: SearchRootProps) {
	const [local, rest] = splitProps(props, [
		'open',
		'defaultOpen',
		'onOpenChange',
		'value',
		'defaultSearchValue',
		'onSearchChange',
		'onSelect',
		'onSubmitSearch',
		'loading',
		'searchDelay',
		'children',
		'class',
		'ref',
	]);

	const [open, setOpenState] = createControllableState<boolean>({
		get value() {
			return local.open;
		},
		defaultValue: local.defaultOpen ?? false,
	});

	const [searchValue, setSearchValueState] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultSearchValue ?? '',
	});

	const [highlightedIndex, setHighlightedIndex] = createSignal(-1);
	const [itemCount, setItemCount] = createSignal(0);
	let inputNode: HTMLInputElement | null = null;
	let rootEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (rootEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	// searchDelay is captured once at setup; createDebouncedCallback doesn't accept a reactive delay.
	const submitDebounced = createDebouncedCallback(
		() => local.onSubmitSearch?.(),
		untrack(() => local.searchDelay ?? 1000),
	);

	const handleOpenChange = (value: boolean) => {
		setOpenState(value);
		local.onOpenChange?.(value);
		if (!value) setHighlightedIndex(-1);
	};

	const handleSearchChange = (value: string) => {
		setSearchValueState(value);
		local.onSearchChange?.(value);
		submitDebounced();
	};

	const handleSelect = (option: SearchOption) => {
		local.onSelect?.(option);
		setSearchValueState('');
		local.onSearchChange?.('');
		handleOpenChange(false);
	};

	const registerItem = () => {
		const index = itemCount();
		setItemCount((prev) => prev + 1);
		return index;
	};

	const unregisterItem = () => {
		setItemCount((prev) => Math.max(0, prev - 1));
	};

	createClickOutside(
		() => rootEl,
		() => {
			if (open()) handleOpenChange(false);
		},
	);

	const ctxValue: SearchContextValue = {
		get open() {
			return !!open();
		},
		onOpenChange: handleOpenChange,
		get searchValue() {
			return searchValue() ?? '';
		},
		onSearchChange: handleSearchChange,
		onSelect: handleSelect,
		get loading() {
			return !!local.loading;
		},
		get highlightedIndex() {
			return highlightedIndex();
		},
		setHighlightedIndex,
		get itemCount() {
			return itemCount();
		},
		registerItem,
		unregisterItem,
		getInputNode: () => inputNode,
		setInputNode: (node) => {
			inputNode = node;
		},
	};

	return (
		<SearchContext.Provider value={ctxValue}>
			<div
				ref={mergedRef}
				class={local.class}
				data-loading={local.loading ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</SearchContext.Provider>
	);
}

function Input(props: SearchInputProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useSearchContext();

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				if (ctx.itemCount > 0) {
					ctx.setHighlightedIndex(ctx.highlightedIndex < ctx.itemCount - 1 ? ctx.highlightedIndex + 1 : 0);
				}
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (ctx.itemCount > 0) {
					ctx.setHighlightedIndex(ctx.highlightedIndex > 0 ? ctx.highlightedIndex - 1 : ctx.itemCount - 1);
				}
				break;
			case 'Escape':
				ctx.onOpenChange(false);
				ctx.getInputNode()?.blur();
				break;
		}
	};

	return (
		<input
			ref={(el) => ctx.setInputNode(el)}
			type='text'
			value={ctx.searchValue}
			class={local.class}
			onFocus={() => ctx.onOpenChange(true)}
			onInput={(e) => ctx.onSearchChange(e.currentTarget.value)}
			onKeyDown={handleKeyDown}
			{...rest}
		/>
	);
}

function Content(props: SearchContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useSearchContext();

	return (
		<Show when={ctx.open}>
			<div
				role='listbox'
				class={local.class}
				data-state='open'
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

function Item(props: SearchItemProps) {
	const [local, rest] = splitProps(props, ['option', 'children', 'class', 'onClick']);
	const ctx = useSearchContext();
	const state = createInteractiveState();

	let myIndex = -1;
	onMount(() => {
		myIndex = ctx.registerItem();
		onCleanup(() => ctx.unregisterItem());
	});

	const isHighlighted = () => ctx.highlightedIndex === myIndex;

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		(state.handlers.onKeyDown as (event: KeyboardEvent) => void)(e);
		if (e.key === 'Enter') {
			ctx.onSelect(local.option);
		}
	};

	const merged = mergeProps(rest, {
		...state.handlers,
		onKeyDown: handleKeyDown,
	});

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		ctx.onSelect(local.option);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			role='option'
			aria-selected={isHighlighted()}
			class={local.class}
			data-highlighted={isHighlighted() ? '' : undefined}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}
			tabIndex={-1}>
			{local.children}
		</div>
	);
}

function Empty(props: SearchEmptyProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useSearchContext();

	return (
		<Show when={ctx.itemCount === 0 && !ctx.loading}>
			<div
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

export const Search = {
	Root,
	Input,
	Content,
	Item,
	Empty,
};

export { Root, Input, Content, Item, Empty };
