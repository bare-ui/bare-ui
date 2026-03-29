export interface CheckboxRootProps {
	value?: (string | number)[]
	defaultValue?: (string | number)[]
	onChange?: (value: (string | number)[]) => void
	onErrorChange?: (hasError: boolean) => void
	isRequired?: boolean
	name?: string
	children?: React.ReactNode
	className?: string
}

export interface CheckboxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	value: string | number
	disabled?: boolean
	children?: React.ReactNode
}

export interface CheckboxIndicatorProps {
	children?: React.ReactNode
	className?: string
}

export interface CheckboxLabelProps {
	children?: React.ReactNode
	className?: string
}

export interface CheckboxContextValue {
	values: (string | number)[]
	isRequired: boolean
	name: string
	toggle: (itemValue: string | number) => void
	isChecked: (itemValue: string | number) => boolean
}

export interface CheckboxItemContextValue {
	value: string | number
	disabled: boolean
	checked: boolean
}

export interface CheckboxHandle {
	validate: () => void
}
