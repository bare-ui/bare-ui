export interface RadioRootProps {
	value?: string | number
	defaultValue?: string | number
	onChange?: (value: string | number) => void
	onErrorChange?: (hasError: boolean) => void
	isRequired?: boolean
	name?: string
	children?: React.ReactNode
	className?: string
}

export interface RadioItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	value: string | number
	disabled?: boolean
	children?: React.ReactNode
}

export interface RadioIndicatorProps {
	children?: React.ReactNode
	className?: string
}

export interface RadioLabelProps {
	children?: React.ReactNode
	className?: string
}

export interface RadioContextValue {
	selectedValue: string | number | undefined
	isRequired: boolean
	name: string
	select: (itemValue: string | number) => void
	isSelected: (itemValue: string | number) => boolean
}

export interface RadioItemContextValue {
	value: string | number
	disabled: boolean
	checked: boolean
}

export interface RadioHandle {
	validate: () => void
}
