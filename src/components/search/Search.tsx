import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import { mergeProps } from '@/utils/merge-props'
import type {
	SearchContentProps,
	SearchContextValue,
	SearchEmptyProps,
	SearchInputProps,
	SearchItemProps,
	SearchOption,
	SearchRootProps,
} from './Search.types'

const SearchContext = createContext<SearchContextValue | null>(null)

function useSearchContext() {
	const context = useContext(SearchContext)
	if (!context) {
		throw new globalThis.Error('Search compound components must be used within Search.Root')
	}
	return context
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
		const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
		const isOpenControlled = controlledOpen !== undefined
		const open = isOpenControlled ? controlledOpen : uncontrolledOpen

		const [uncontrolledValue, setUncontrolledValue] = useState(defaultSearchValue)
		const isValueControlled = controlledValue !== undefined
		const searchValue = isValueControlled ? controlledValue : uncontrolledValue

		const [highlightedIndex, setHighlightedIndex] = useState(-1)
		const [itemCount, setItemCount] = useState(0)
		const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
		const inputRef = useRef<HTMLInputElement>(null)
		const rootRef = useRef<HTMLDivElement>(null)
		const combinedRef = (ref as React.RefObject<HTMLDivElement | null>) || rootRef
		const internalRef = ref ? combinedRef : rootRef

		const handleOpenChange = useCallback(
			(value: boolean) => {
				if (!isOpenControlled) {
					setUncontrolledOpen(value)
				}
				onOpenChange?.(value)
				if (!value) {
					setHighlightedIndex(-1)
				}
			},
			[isOpenControlled, onOpenChange],
		)

		const handleSearchChange = useCallback(
			(value: string) => {
				if (!isValueControlled) {
					setUncontrolledValue(value)
				}
				onSearchChange?.(value)

				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current)
				}

				typingTimeoutRef.current = setTimeout(() => {
					onSubmitSearch?.()
				}, searchDelay)
			},
			[isValueControlled, onSearchChange, onSubmitSearch, searchDelay],
		)

		const handleSelect = useCallback(
			(option: SearchOption) => {
				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current)
				}
				onSelect?.(option)
				if (!isValueControlled) {
					setUncontrolledValue('')
				}
				onSearchChange?.('')
				handleOpenChange(false)
			},
			[onSelect, isValueControlled, onSearchChange, handleOpenChange],
		)

		const registerItem = useCallback(() => {
			const index = itemCount
			setItemCount((prev) => prev + 1)
			return index
		}, [itemCount])

		const unregisterItem = useCallback(() => {
			setItemCount((prev) => Math.max(0, prev - 1))
		}, [])

		useClickOutside(internalRef, () => {
			if (open) {
				handleOpenChange(false)
			}
		})

		useEffect(() => {
			return () => {
				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current)
				}
			}
		}, [])

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
			setInputNode: (node: HTMLInputElement | null) => {
				;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
			},
		}

		return (
			<SearchContext.Provider value={contextValue}>
				<div
					ref={internalRef}
					className={className}
					data-loading={loading ? '' : undefined}
					{...rest}
				>
					{children}
				</div>
			</SearchContext.Provider>
		)
	},
)

Root.displayName = 'Search.Root'

const Input = React.forwardRef<HTMLInputElement, SearchInputProps>(
	({ className, ...rest }, ref) => {
		const ctx = useSearchContext()

		const combinedRef = (node: HTMLInputElement | null) => {
			ctx.setInputNode(node)
			if (typeof ref === 'function') ref(node)
			else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
		}

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault()
					if (ctx.itemCount > 0) {
						ctx.setHighlightedIndex(
							ctx.highlightedIndex < ctx.itemCount - 1 ? ctx.highlightedIndex + 1 : 0,
						)
					}
					break
				case 'ArrowUp':
					e.preventDefault()
					if (ctx.itemCount > 0) {
						ctx.setHighlightedIndex(
							ctx.highlightedIndex > 0 ? ctx.highlightedIndex - 1 : ctx.itemCount - 1,
						)
					}
					break
				case 'Escape':
					ctx.onOpenChange(false)
					ctx.inputRef.current?.blur()
					break
			}
		}

		return (
			<input
				ref={combinedRef}
				type="text"
				value={ctx.searchValue}
				className={className}
				onFocus={() => ctx.onOpenChange(true)}
				onChange={(e) => ctx.onSearchChange(e.target.value)}
				onKeyDown={handleKeyDown}
				{...rest}
			/>
		)
	},
)

Input.displayName = 'Search.Input'

const Content = React.forwardRef<HTMLDivElement, SearchContentProps>(
	({ children, className, ...rest }, ref) => {
		const { open } = useSearchContext()

		if (!open) return null

		return (
			<div
				ref={ref}
				role="listbox"
				className={className}
				data-state={open ? 'open' : 'closed'}
				{...rest}
			>
				{children}
			</div>
		)
	},
)

Content.displayName = 'Search.Content'

const Item = React.forwardRef<HTMLDivElement, SearchItemProps>(
	({ option, children, className, ...rest }, ref) => {
		const ctx = useSearchContext()
		const indexRef = useRef(-1)
		const { handlers, dataAttributes } = useInteractiveState()

		useEffect(() => {
			indexRef.current = ctx.registerItem()
			return () => ctx.unregisterItem()
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [])

		const isHighlighted = ctx.highlightedIndex === indexRef.current

		const handleKeyDown = (e: React.KeyboardEvent) => {
			handlers.onKeyDown(e)
			if (e.key === 'Enter') {
				ctx.onSelect(option)
			}
		}

		const merged = mergeProps(
			rest as Record<string, unknown>,
			{
				...handlers,
				onKeyDown: handleKeyDown,
			} as Record<string, unknown>,
		)

		return (
			<div
				ref={ref}
				role="option"
				aria-selected={isHighlighted}
				className={className}
				data-highlighted={isHighlighted ? '' : undefined}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					ctx.onSelect(option)
					;(
						rest.onClick as ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined
					)?.(e)
				}}
				tabIndex={-1}
			>
				{children}
			</div>
		)
	},
)

Item.displayName = 'Search.Item'

const Empty = React.forwardRef<HTMLDivElement, SearchEmptyProps>(
	({ children, className, ...rest }, ref) => {
		const { itemCount, loading } = useSearchContext()

		if (itemCount > 0 || loading) return null

		return (
			<div ref={ref} className={className} {...rest}>
				{children}
			</div>
		)
	},
)

Empty.displayName = 'Search.Empty'

export const Search = {
	Root,
	Input,
	Content,
	Item,
	Empty,
}
