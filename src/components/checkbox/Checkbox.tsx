import React, { createContext, useCallback, useContext, useImperativeHandle, useState } from 'react'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import type {
	CheckboxContextValue,
	CheckboxHandle,
	CheckboxIndicatorProps,
	CheckboxItemContextValue,
	CheckboxItemProps,
	CheckboxLabelProps,
	CheckboxRootProps,
} from './Checkbox.types'
import { Helper } from '@/utils/helper'

const CheckboxContext = createContext<CheckboxContextValue | null>(null)
const CheckboxItemContext = createContext<CheckboxItemContextValue | null>(null)

function useCheckboxContext() {
	const context = useContext(CheckboxContext)
	if (!context) {
		throw new globalThis.Error('Checkbox compound components must be used within Checkbox.Root')
	}
	return context
}

function useCheckboxItemContext() {
	const context = useContext(CheckboxItemContext)
	if (!context) {
		throw new globalThis.Error('Checkbox.Indicator/Label must be used within Checkbox.Item')
	}
	return context
}

const Root = React.forwardRef<CheckboxHandle, CheckboxRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = [],
			onChange,
			onErrorChange,
			isRequired = false,
			name,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
		const isControlled = controlledValue !== undefined
		const values = isControlled ? controlledValue : uncontrolledValue

		const groupName = React.useMemo(() => name || Helper.generateUUID(), [name])

		const handleValidation = useCallback(
			(val: (string | number)[]) => {
				if (!isRequired) return
				if (val.length > 0) {
					onErrorChange?.(false)
				} else {
					onErrorChange?.(true)
				}
			},
			[isRequired, onErrorChange],
		)

		const isChecked = useCallback(
			(itemValue: string | number) => {
				return values.some((v) => String(v) === String(itemValue))
			},
			[values],
		)

		const toggle = useCallback(
			(itemValue: string | number) => {
				const currentValues = [...values]
				const index = currentValues.findIndex((v) => String(v) === String(itemValue))

				if (index === -1) {
					currentValues.push(itemValue)
				} else {
					currentValues.splice(index, 1)
				}

				if (!isControlled) {
					setUncontrolledValue(currentValues)
				}
				onChange?.(currentValues)
				handleValidation(currentValues)
			},
			[values, isControlled, onChange, handleValidation],
		)

		const validate = useCallback(() => {
			handleValidation(values)
		}, [handleValidation, values])

		useImperativeHandle(ref, () => ({ validate }), [validate])

		return (
			<CheckboxContext.Provider
				value={{ values, isRequired, name: groupName, toggle, isChecked }}
			>
				<div role="group" className={className} {...rest}>
					{children}
				</div>
			</CheckboxContext.Provider>
		)
	},
)

Root.displayName = 'Checkbox.Root'

const Item = React.forwardRef<HTMLInputElement, CheckboxItemProps>(
	({ value, disabled = false, children, className, onClick, ...rest }, ref) => {
		const ctx = useCheckboxContext()
		const checked = ctx.isChecked(value)
		const { handlers, dataAttributes } = useInteractiveState({ disabled })

		return (
			<CheckboxItemContext.Provider value={{ value, disabled, checked }}>
				<div
					className={className}
					data-checked={checked ? '' : undefined}
					{...dataAttributes}
					onMouseEnter={handlers.onMouseEnter}
					onMouseLeave={handlers.onMouseLeave}
					onPointerDown={handlers.onPointerDown}
					onPointerUp={handlers.onPointerUp}
					onClick={(e) => {
						if (!disabled) ctx.toggle(value)
						onClick?.(e)
					}}
					{...rest}
				>
					<input
						ref={ref}
						type="checkbox"
						name={ctx.name}
						value={String(value)}
						checked={checked}
						disabled={disabled}
						onChange={() => ctx.toggle(value)}
						onFocus={handlers.onFocus}
						onBlur={handlers.onBlur}
						onKeyDown={handlers.onKeyDown}
						onKeyUp={handlers.onKeyUp}
						style={{
							position: 'absolute',
							opacity: 0,
							pointerEvents: 'none',
							width: 0,
							height: 0,
						}}
					/>
					{children}
				</div>
			</CheckboxItemContext.Provider>
		)
	},
)

Item.displayName = 'Checkbox.Item'

const Indicator = React.forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
	({ children, className, ...rest }, ref) => {
		const { checked } = useCheckboxItemContext()

		if (!checked) return null

		return (
			<span ref={ref} className={className} data-checked="" {...rest}>
				{children}
			</span>
		)
	},
)

Indicator.displayName = 'Checkbox.Indicator'

const Label = React.forwardRef<HTMLLabelElement, CheckboxLabelProps>(
	({ children, className, ...rest }, ref) => {
		const { disabled } = useCheckboxItemContext()

		return (
			<label
				ref={ref}
				className={className}
				data-disabled={disabled ? '' : undefined}
				{...rest}
			>
				{children}
			</label>
		)
	},
)

Label.displayName = 'Checkbox.Label'

export const Checkbox = {
	Root,
	Item,
	Indicator,
	Label,
}
