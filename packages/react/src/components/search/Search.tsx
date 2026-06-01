import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
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
		throw new globalThis.Error('Search compound components must be used within Search.Root');
	}
	return context;
}

const Root = React.forwardRef<HTMLDivElement, SearchRootProps>(
	(
		{
			open: controlledOpen,
			defaultOpen = false,
			onOpenChange,
			value: controlledValue,
			defaultSearchValue = '',
			onSearchChange,
			onSelect,
			onSubmitSearch,
			loading = false,
			searchDelay = 1000,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [open, setOpenState] = useControllableState({
			value: controlledOpen,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		});

		const [searchValue, setSearchValueState] = useControllableState({
			value: controlledValue,
			defaultValue: defaultSearchValue,
			onChange: onSearchChange,
		});

		const [highlightedIndex, setHighlightedIndex] = useState(-1);
		const [itemCount, setItemCount] = useState(0);
		const nextItemIndex = useRef(0);
		const inputRef = useRef<HTMLInputElement>(null);
		const rootRef = useRef<HTMLDivElement>(null);
		const mergedRootRef = useMergedRefs<HTMLDivElement>(rootRef, ref);

		const submitSearch = useDebouncedCallback(() => onSubmitSearch?.(), searchDelay);

		const handleOpenChange = useCallback(
			(value: boolean) => {
				setOpenState(value);
				if (!value) {
					setHighlightedIndex(-1);
				}
			},
			[setOpenState],
		);

		const handleSearchChange = useCallback(
			(value: string) => {
				setSearchValueState(value);
				submitSearch();
			},
			[setSearchValueState, submitSearch],
		);

		const handleSelect = useCallback(
			(option: SearchOption) => {
				onSelect?.(option);
				setSearchValueState('');
				handleOpenChange(false);
			},
			[onSelect, setSearchValueState, handleOpenChange],
		);

		const registerItem = useCallback(() => {
			// Assign a unique index from a ref so items mounting in the same commit
			// each get a distinct value. Reading `itemCount` state here returned 0 for
			// every item in the batch, so they all shared index 0 and the highlighted
			// option's aria-selected leaked onto every option for a screen reader.
			const index = nextItemIndex.current;
			nextItemIndex.current += 1;
			setItemCount((prev) => prev + 1);
			return index;
		}, []);

		const unregisterItem = useCallback(() => {
			nextItemIndex.current = Math.max(0, nextItemIndex.current - 1);
			setItemCount((prev) => Math.max(0, prev - 1));
		}, []);

		useClickOutside(rootRef, () => {
			if (open) {
				handleOpenChange(false);
			}
		});

		const contextValue: SearchContextValue = {
			open,
			onOpenChange: handleOpenChange,
			searchValue,
			onSearchChange: handleSearchChange,
			onSelect: handleSelect,
			loading,
			highlightedIndex,
			setHighlightedIndex,
			itemCount,
			registerItem,
			unregisterItem,
			inputRef,
		};

		return (
			<SearchContext.Provider value={contextValue}>
				<div
					ref={mergedRootRef}
					className={className}
					data-loading={loading ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</SearchContext.Provider>
		);
	},
);

Root.displayName = 'Search.Root';

const Input = React.forwardRef<HTMLInputElement, SearchInputProps>(({ className, ...rest }, ref) => {
	const ctx = useSearchContext();

	const mergedInputRef = useMergedRefs<HTMLInputElement>(ctx.inputRef, ref);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
				ctx.inputRef.current?.blur();
				break;
		}
	};

	return (
		<input
			ref={mergedInputRef}
			type='text'
			value={ctx.searchValue}
			className={className}
			onFocus={() => ctx.onOpenChange(true)}
			onChange={(e) => ctx.onSearchChange(e.target.value)}
			onKeyDown={handleKeyDown}
			{...rest}
		/>
	);
});

Input.displayName = 'Search.Input';

const Content = React.forwardRef<HTMLDivElement, SearchContentProps>(({ children, className, ...rest }, ref) => {
	const { open } = useSearchContext();

	if (!open) return null;

	return (
		<div
			ref={ref}
			role='listbox'
			className={className}
			data-state={open ? 'open' : 'closed'}
			{...rest}>
			{children}
		</div>
	);
});

Content.displayName = 'Search.Content';

const Item = React.forwardRef<HTMLDivElement, SearchItemProps>(({ option, children, className, ...rest }, ref) => {
	const ctx = useSearchContext();
	const indexRef = useRef(-1);
	const { handlers, dataAttributes } = useInteractiveState();

	useEffect(() => {
		indexRef.current = ctx.registerItem();
		return () => ctx.unregisterItem();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Reading the registered index during render is intentional: the index is assigned
	// once on mount and the parent re-renders all items when highlightedIndex changes.
	// eslint-disable-next-line react-hooks/refs
	const isHighlighted = ctx.highlightedIndex === indexRef.current;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		handlers.onKeyDown(e);
		if (e.key === 'Enter') {
			ctx.onSelect(option);
		}
	};

	const merged = mergeProps(
		rest as Record<string, unknown>,
		{
			...handlers,
			onKeyDown: handleKeyDown,
		} as Record<string, unknown>,
	);

	return (
		<div
			ref={ref}
			role='option'
			aria-selected={isHighlighted}
			className={className}
			data-highlighted={isHighlighted ? '' : undefined}
			{...dataAttributes}
			{...merged}
			onClick={(e) => {
				ctx.onSelect(option);
				(rest.onClick as ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined)?.(e);
			}}
			tabIndex={-1}>
			{children}
		</div>
	);
});

Item.displayName = 'Search.Item';

const Empty = React.forwardRef<HTMLDivElement, SearchEmptyProps>(({ children, className, ...rest }, ref) => {
	const { itemCount, loading } = useSearchContext();

	if (itemCount > 0 || loading) return null;

	return (
		<div
			ref={ref}
			className={className}
			{...rest}>
			{children}
		</div>
	);
});

Empty.displayName = 'Search.Empty';

export const Search = {
	Root,
	Input,
	Content,
	Item,
	Empty,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Search.*`).
export { Root, Input, Content, Item, Empty };
