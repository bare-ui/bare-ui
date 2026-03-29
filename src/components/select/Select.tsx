import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import { mergeProps } from '@/utils/merge-props'
import type {
	SelectContentProps,
	SelectContextValue,
	SelectGroupLabelProps,
	SelectGroupProps,
	SelectItemProps,
	SelectRootProps,
	SelectSeparatorProps,
	SelectTriggerProps,
	SelectValueProps,
} from './Select.types'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext() {
	const ctx = useContext(SelectContext)
	if (!ctx) throw new globalThis.Error('Select sub-components must be used within Select.Root')
	return ctx
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, SelectRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onChange,
			disabled = false,
			className,
			children,
			...rest
		},
		externalRef,
	) => {
		const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
		const isControlled = controlledValue !== undefined
		const selectedValue = isControlled ? controlledValue : uncontrolledValue

		const [open, setOpen] = useState(false)
		const [labelMap, setLabelMap] = useState<Record<string, string>>({})
		const [persistedLabel, setPersistedLabel] = useState('')

		const internalRef = useRef<HTMLDivElement>(null)
		useClickOutside(internalRef, () => setOpen(false))

		const select = useCallback(
			(value: string, label: string) => {
				if (!isControlled) setUncontrolledValue(value)
				setPersistedLabel(label)
				onChange?.(value)
				setOpen(false)
			},
			[isControlled, onChange],
		)

		const registerItem = useCallback((value: string, label: string) => {
			setLabelMap((prev) => ({ ...prev, [value]: label }))
		}, [])

		// Items must not unregister on unmount — the label map must persist
		// so Select.Value can display the selected label even when Content is closed.
		const unregisterItem = useCallback((_value: string) => {}, [])

		// Prefer the persisted label (set on explicit selection), fall back to the
		// label map (covers defaultValue / controlled value on first render).
		const selectedLabel = persistedLabel || labelMap[selectedValue] || ''

		return (
			<SelectContext.Provider
				value={{
					open,
					selectedValue,
					selectedLabel,
					disabled,
					setOpen,
					select,
					registerItem,
					unregisterItem,
				}}
			>
				<div
					ref={(el) => {
						internalRef.current = el
						if (typeof externalRef === 'function') externalRef(el)
						else if (externalRef) externalRef.current = el
					}}
					className={className}
					data-open={open ? '' : undefined}
					data-disabled={disabled ? '' : undefined}
					{...rest}
				>
					{children}
				</div>
			</SelectContext.Provider>
		)
	},
)

Root.displayName = 'Select.Root'

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const { open, disabled, setOpen } = useSelectContext()
		const { handlers, dataAttributes } = useInteractiveState({ disabled })
		const merged = mergeProps(
			rest as Record<string, unknown>,
			handlers as Record<string, unknown>,
		)

		return (
			<button
				ref={ref}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				disabled={disabled}
				className={className}
				data-state={open ? 'open' : 'closed'}
				data-disabled={disabled ? '' : undefined}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					if (!disabled) setOpen(!open)
					onClick?.(e)
				}}
				onKeyDown={(e) => {
					if (e.key === 'Escape') setOpen(false)
					if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						setOpen(true)
					}
					;(handlers as { onKeyDown?: (e: React.KeyboardEvent) => void }).onKeyDown?.(e)
				}}
			>
				{children}
			</button>
		)
	},
)

Trigger.displayName = 'Select.Trigger'

// ---------------------------------------------------------------------------
// Value
// ---------------------------------------------------------------------------

const Value = React.forwardRef<HTMLSpanElement, SelectValueProps>(
	({ placeholder = 'Select an option', className, ...rest }, ref) => {
		const { selectedLabel } = useSelectContext()

		return (
			<span
				ref={ref}
				className={className}
				data-placeholder={!selectedLabel ? '' : undefined}
				{...rest}
			>
				{selectedLabel || placeholder}
			</span>
		)
	},
)

Value.displayName = 'Select.Value'

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, SelectContentProps>(
	({ className, children, ...rest }, ref) => {
		const { open } = useSelectContext()

		if (!open) return null

		return (
			<div ref={ref} role="listbox" className={className} data-state="open" {...rest}>
				{children}
			</div>
		)
	},
)

Content.displayName = 'Select.Content'

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ value, textValue, disabled = false, className, children, onClick, ...rest }, ref) => {
		const { selectedValue, select, registerItem } = useSelectContext()
		const { handlers, dataAttributes } = useInteractiveState({ disabled })
		const merged = mergeProps(
			rest as Record<string, unknown>,
			handlers as Record<string, unknown>,
		)

		const isSelected = selectedValue === value

		// Derive label: textValue > string children > value
		const label = textValue ?? (typeof children === 'string' ? children : value)

		useEffect(() => {
			registerItem(value, label)
		}, [value, label, registerItem])

		return (
			<div
				ref={ref}
				role="option"
				aria-selected={isSelected}
				className={className}
				data-selected={isSelected ? '' : undefined}
				data-disabled={disabled ? '' : undefined}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					if (!disabled) select(value, label)
					onClick?.(e)
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						if (!disabled) select(value, label)
					}
					;(handlers as { onKeyDown?: (e: React.KeyboardEvent) => void }).onKeyDown?.(e)
				}}
			>
				{children}
			</div>
		)
	},
)

Item.displayName = 'Select.Item'

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<HTMLHRElement, SelectSeparatorProps>(
	({ className, ...rest }, ref) => (
		<hr ref={ref} className={className} aria-hidden="true" {...rest} />
	),
)

Separator.displayName = 'Select.Separator'

// ---------------------------------------------------------------------------
// Group + GroupLabel
// ---------------------------------------------------------------------------

const Group = React.forwardRef<HTMLDivElement, SelectGroupProps>(
	({ className, children, ...rest }, ref) => (
		<div ref={ref} role="group" className={className} {...rest}>
			{children}
		</div>
	),
)

Group.displayName = 'Select.Group'

const GroupLabel = React.forwardRef<HTMLSpanElement, SelectGroupLabelProps>(
	({ className, children, ...rest }, ref) => (
		<span ref={ref} className={className} {...rest}>
			{children}
		</span>
	),
)

GroupLabel.displayName = 'Select.GroupLabel'

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Select = { Root, Trigger, Value, Content, Item, Separator, Group, GroupLabel }
