import type { ValidationType } from '@/types/common'

export interface TextareaRootProps {
	value?: string
	defaultValue?: string
	onChange?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
	onErrorChange?: (hasError: boolean) => void
	onInvalidTypeChange?: (type: string) => void
	validation?: ValidationType
	invalidType?: string
	errorMessage?: Record<string, string>
	isRequired?: boolean
	isSuccess?: boolean
	id?: string
	children?: React.ReactNode
	className?: string
}

export interface TextareaFieldProps extends Omit<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	'value' | 'onChange'
> {
	className?: string
}

export interface TextareaLabelProps {
	children?: React.ReactNode
	className?: string
}

export interface TextareaErrorProps {
	children?: React.ReactNode
	className?: string
}

export interface TextareaContextValue {
	value: string
	textareaId: string
	isActive: boolean
	invalidType: string
	isSuccess: boolean
	isRequired: boolean
	errorMessage: Record<string, string>
	validation: ValidationType
	handleChange: (value: string) => void
	handleFocus: () => void
	handleBlur: () => void
	fieldRef: React.RefObject<HTMLTextAreaElement | null>
	setFieldNode: (node: HTMLTextAreaElement | null) => void
}

export interface TextareaHandle {
	validate: () => void
}
