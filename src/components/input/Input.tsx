import React, {
	createContext,
	useCallback,
	useContext,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react'
import { Helper } from '@/utils/helper'
import type {
	InputContextValue,
	InputErrorProps,
	InputFieldProps,
	InputHandle,
	InputLabelProps,
	InputRootProps,
} from './Input.types'

const InputContext = createContext<InputContextValue | null>(null)

function useInputContext() {
	const context = useContext(InputContext)
	if (!context) {
		throw new globalThis.Error('Input compound components must be used within Input.Root')
	}
	return context
}

const Root = React.forwardRef<InputHandle, InputRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onChange,
			onFocus,
			onBlur,
			onErrorChange,
			onInvalidTypeChange,
			validation = '',
			invalidType: controlledInvalidType,
			errorMessage = {},
			isRequired = false,
			isSuccess = false,
			id,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
		const isControlled = controlledValue !== undefined
		const value = isControlled ? controlledValue : uncontrolledValue

		const [isActive, setIsActive] = useState(false)
		const [internalInvalidType, setInternalInvalidType] = useState('')
		const invalidType =
			controlledInvalidType !== undefined ? controlledInvalidType : internalInvalidType

		const fieldRef = useRef<HTMLInputElement>(null)
		const inputId = useMemo(() => id || Helper.generateUUID(), [id])

		const setInvalidType = useCallback(
			(type: string) => {
				if (controlledInvalidType === undefined) {
					setInternalInvalidType(type)
				}
				onInvalidTypeChange?.(type)
			},
			[controlledInvalidType, onInvalidTypeChange],
		)

		const setError = useCallback(
			(hasError: boolean) => {
				onErrorChange?.(hasError)
			},
			[onErrorChange],
		)

		const handleValidation = useCallback(() => {
			if (validation === 'phone') return

			const currentValue = fieldRef.current?.value ?? ''
			const trimmedValue = validation === 'email' ? currentValue.trim() : currentValue

			if (validation === 'email' && fieldRef.current) {
				fieldRef.current.value = trimmedValue
			}

			const validator = Helper.isValid({
				value: trimmedValue,
				type: validation as 'email' | 'name' | 'phone',
			})

			if (validator.isValid) {
				setError(false)
				setInvalidType('')
			} else {
				setError(true)
				setInvalidType(validation)
			}
		}, [validation, setError, setInvalidType])

		const handleIsEmpty = useCallback((): boolean => {
			const currentValue = fieldRef.current?.value ?? ''
			const empty = Helper.isEmpty(currentValue)

			if (empty) {
				setError(true)
				setInvalidType('required')
				return true
			} else {
				setError(false)
				setInvalidType('')
				return false
			}
		}, [setError, setInvalidType])

		const handleChange = useCallback(
			(newValue: string) => {
				if (!isControlled) {
					setUncontrolledValue(newValue)
				}
				onChange?.(newValue)
			},
			[isControlled, onChange],
		)

		const handleFocus = useCallback(() => {
			setIsActive(true)
			onFocus?.()
		}, [onFocus])

		const handleBlur = useCallback(() => {
			const currentValue = fieldRef.current?.value ?? ''
			if (isActive && currentValue.length === 0) {
				setIsActive(false)
			}

			if (isRequired) {
				const empty = handleIsEmpty()
				if (!empty && validation.length) {
					handleValidation()
				}
			} else {
				if (validation.length && currentValue.length) {
					handleValidation()
				}
			}

			onBlur?.()
		}, [isActive, isRequired, validation, handleIsEmpty, handleValidation, onBlur])

		const validate = useCallback(() => {
			handleBlur()
		}, [handleBlur])

		useImperativeHandle(ref, () => ({ validate }), [validate])

		const contextValue: InputContextValue = {
			value,
			inputId,
			isActive,
			invalidType,
			isSuccess,
			isRequired,
			errorMessage,
			validation,
			handleChange,
			handleFocus,
			handleBlur,
			fieldRef,
			setFieldNode: (node: HTMLInputElement | null) => {
				;(fieldRef as React.MutableRefObject<HTMLInputElement | null>).current = node
			},
		}

		return (
			<InputContext.Provider value={contextValue}>
				<div className={className} {...rest}>
					{children}
				</div>
			</InputContext.Provider>
		)
	},
)

Root.displayName = 'Input.Root'

const Field = React.forwardRef<HTMLInputElement, InputFieldProps>(({ className, ...rest }, ref) => {
	const ctx = useInputContext()

	const combinedRef = (node: HTMLInputElement | null) => {
		ctx.setFieldNode(node)
		if (typeof ref === 'function') ref(node)
		else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
	}

	return (
		<input
			ref={combinedRef}
			id={ctx.inputId}
			value={ctx.value}
			required={ctx.isRequired}
			className={className}
			aria-required={ctx.isRequired || undefined}
			aria-invalid={ctx.invalidType ? true : undefined}
			data-invalid={ctx.invalidType ? '' : undefined}
			data-active={ctx.isActive ? '' : undefined}
			data-success={ctx.isSuccess ? '' : undefined}
			onFocus={ctx.handleFocus}
			onBlur={ctx.handleBlur}
			onChange={(e) => ctx.handleChange(e.target.value)}
			{...rest}
		/>
	)
})

Field.displayName = 'Input.Field'

const Label = React.forwardRef<HTMLLabelElement, InputLabelProps>(
	({ children, className, ...rest }, ref) => {
		const ctx = useInputContext()

		return (
			<label ref={ref} htmlFor={ctx.inputId} className={className} {...rest}>
				{ctx.isRequired && <span>*</span>}
				{children}
			</label>
		)
	},
)

Label.displayName = 'Input.Label'

const Error = React.forwardRef<HTMLElement, InputErrorProps>(
	({ children, className, ...rest }, ref) => {
		const ctx = useInputContext()

		if (!ctx.invalidType) return null

		const message = children ?? ctx.errorMessage[ctx.invalidType]

		return (
			<small ref={ref} role="alert" className={className} {...rest}>
				{message}
			</small>
		)
	},
)

Error.displayName = 'Input.Error'

export const Input = {
	Root,
	Field,
	Label,
	Error,
}
