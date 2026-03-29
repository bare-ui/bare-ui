import React, { createContext, useCallback, useContext, useImperativeHandle, useState } from 'react'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import type {
	RadioContextValue,
	RadioHandle,
	RadioIndicatorProps,
	RadioItemContextValue,
	RadioItemProps,
	RadioLabelProps,
	RadioRootProps,
} from './Radio.types'
import { Helper } from '@/utils/helper'

const RadioContext = createContext<RadioContextValue | null>(null)
const RadioItemContext = createContext<RadioItemContextValue | null>(null)

function useRadioContext() {
	const context = useContext(RadioContext)
	if (!context) {
		throw new globalThis.Error('Radio compound components must be used within Radio.Root')
	}
	return context
}

function useRadioItemContext() {
	const context = useContext(RadioItemContext)
	if (!context) {
		throw new globalThis.Error('Radio.Indicator/Label must be used within Radio.Item')
	}
	return context
}

const Root = React.forwardRef<RadioHandle, RadioRootProps>(
	(
		{
			value: controlledValue,
			defaultValue,
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
		const selectedValue = isControlled ? controlledValue : uncontrolledValue

		const groupName = React.useMemo(() => name || Helper.generateUUID(), [name])

		const handleValidation = useCallback(
			(val: string | number | undefined) => {
				if (!isRequired) return
				const hasValue = val !== undefined && val !== null && String(val).length > 0
				onErrorChange?.(!hasValue)
			},
			[isRequired, onErrorChange],
		)

		const isSelected = useCallback(
			(itemValue: string | number) => {
				if (selectedValue === undefined || selectedValue === null) return false
				return String(selectedValue) === String(itemValue)
			},
			[selectedValue],
		)

		const select = useCallback(
			(itemValue: string | number) => {
				if (!isControlled) {
					setUncontrolledValue(itemValue)
				}
				onChange?.(itemValue)
				handleValidation(itemValue)
			},
			[isControlled, onChange, handleValidation],
		)

		const validate = useCallback(() => {
			handleValidation(selectedValue)
		}, [handleValidation, selectedValue])

		useImperativeHandle(ref, () => ({ validate }), [validate])

		return (
			<RadioContext.Provider
				value={{ selectedValue, isRequired, name: groupName, select, isSelected }}
			>
				<div role="radiogroup" className={className} {...rest}>
					{children}
				</div>
			</RadioContext.Provider>
		)
	},
)

Root.displayName = 'Radio.Root'

const Item = React.forwardRef<HTMLInputElement, RadioItemProps>(
	({ value, disabled = false, children, className, onClick, ...rest }, ref) => {
		const ctx = useRadioContext()
		const checked = ctx.isSelected(value)
		const { handlers, dataAttributes } = useInteractiveState({ disabled })

		return (
			<RadioItemContext.Provider value={{ value, disabled, checked }}>
				<div
					className={className}
					data-checked={checked ? '' : undefined}
					{...dataAttributes}
					onMouseEnter={handlers.onMouseEnter}
					onMouseLeave={handlers.onMouseLeave}
					onPointerDown={handlers.onPointerDown}
					onPointerUp={handlers.onPointerUp}
					onClick={(e) => {
						if (!disabled) ctx.select(value)
						onClick?.(e)
					}}
					{...rest}
				>
					<input
						ref={ref}
						type="radio"
						name={ctx.name}
						value={String(value)}
						checked={checked}
						disabled={disabled}
						onChange={() => ctx.select(value)}
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
			</RadioItemContext.Provider>
		)
	},
)

Item.displayName = 'Radio.Item'

const Indicator = React.forwardRef<HTMLSpanElement, RadioIndicatorProps>(
	({ children, className, ...rest }, ref) => {
		const { checked } = useRadioItemContext()

		if (!checked) return null

		return (
			<span ref={ref} className={className} data-checked="" {...rest}>
				{children}
			</span>
		)
	},
)

Indicator.displayName = 'Radio.Indicator'

const Label = React.forwardRef<HTMLLabelElement, RadioLabelProps>(
	({ children, className, ...rest }, ref) => {
		const { disabled } = useRadioItemContext()

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

Label.displayName = 'Radio.Label'

export const Radio = {
	Root,
	Item,
	Indicator,
	Label,
}
