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
	TextareaContextValue,
	TextareaErrorProps,
	TextareaFieldProps,
	TextareaHandle,
	TextareaLabelProps,
	TextareaRootProps,
} from './Textarea.types'

const TextareaContext = createContext<TextareaContextValue | null>(null)

function useTextareaContext() {
	const context = useContext(TextareaContext)
	if (!context) {
		throw new globalThis.Error('Textarea compound components must be used within Textarea.Root')
	}
	return context
}

const Root = React.forwardRef<TextareaHandle, TextareaRootProps>(
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

		const fieldRef = useRef<HTMLTextAreaElement>(null)
		const textareaId = useMemo(() => id || Helper.generateUUID(), [id])

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

		const contextValue: TextareaContextValue = {
			value,
			textareaId,
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
			setFieldNode: (node: HTMLTextAreaElement | null) => {
				;(fieldRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
			},
		}

		return (
			<TextareaContext.Provider value={contextValue}>
				<div className={className} {...rest}>
					{children}
				</div>
			</TextareaContext.Provider>
		)
	},
)

Root.displayName = 'Textarea.Root'

const Field = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
	({ className, ...rest }, ref) => {
		const ctx = useTextareaContext()

		const combinedRef = (node: HTMLTextAreaElement | null) => {
			ctx.setFieldNode(node)
			if (typeof ref === 'function') ref(node)
			else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
		}

		return (
			<textarea
				ref={combinedRef}
				id={ctx.textareaId}
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
	},
)

Field.displayName = 'Textarea.Field'

const Label = React.forwardRef<HTMLLabelElement, TextareaLabelProps>(
	({ children, className, ...rest }, ref) => {
		const ctx = useTextareaContext()

		return (
			<label ref={ref} htmlFor={ctx.textareaId} className={className} {...rest}>
				{ctx.isRequired && <span>*</span>}
				{children}
			</label>
		)
	},
)

Label.displayName = 'Textarea.Label'

const Error = React.forwardRef<HTMLElement, TextareaErrorProps>(
	({ children, className, ...rest }, ref) => {
		const ctx = useTextareaContext()

		if (!ctx.invalidType) return null

		const message = children ?? ctx.errorMessage[ctx.invalidType]

		return (
			<small ref={ref} role="alert" className={className} {...rest}>
				{message}
			</small>
		)
	},
)

Error.displayName = 'Textarea.Error'

export const Textarea = {
	Root,
	Field,
	Label,
	Error,
}
