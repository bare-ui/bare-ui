import { createContext, createSignal, onCleanup, onMount, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createInteractiveState } from '@/primitives/create-interactive-state';
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
	]);

	const [uncontrolledOpen, setUncontrolledOpen] = createSignal(local.defaultOpen ?? false);
	const isOpenControlled = () => local.open !== undefined;
	const open = () => (isOpenControlled() ? !!local.open : uncontrolledOpen());

	const [uncontrolledValue, setUncontrolledValue] = createSignal(local.defaultSearchValue ?? '');
	const isValueControlled = () => local.value !== undefined;
	const searchValue = () => (isValueControlled() ? (local.value ?? '') : uncontrolledValue());

	const [highlightedIndex, setHighlightedIndex] = createSignal(-1);
	const [itemCount, setItemCount] = createSignal(0);
	let typingTimer: ReturnType<typeof setTimeout> | null = null;
	let inputNode: HTMLInputElement | null = null;
	let rootEl: HTMLDivElement | undefined;

	const handleOpenChange = (value: boolean) => {
		if (!isOpenControlled()) setUncontrolledOpen(value);
		local.onOpenChange?.(value);
		if (!value) setHighlightedIndex(-1);
	};

	const handleSearchChange = (value: string) => {
		if (!isValueControlled()) setUncontrolledValue(value);
		local.onSearchChange?.(value);

		if (typingTimer) clearTimeout(typingTimer);
		typingTimer = setTimeout(() => {
			local.onSubmitSearch?.();
		}, local.searchDelay ?? 1000);
	};

	const handleSelect = (option: SearchOption) => {
		if (typingTimer) clearTimeout(typingTimer);
		local.onSelect?.(option);
		if (!isValueControlled()) setUncontrolledValue('');
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

	onCleanup(() => {
		if (typingTimer) clearTimeout(typingTimer);
	});

	const ctxValue: SearchContextValue = {
		get open() {
			return open();
		},
		onOpenChange: handleOpenChange,
		get searchValue() {
			return searchValue();
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
				ref={rootEl}
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
