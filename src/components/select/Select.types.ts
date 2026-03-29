import React from 'react'

export interface SelectContextValue {
	open: boolean
	selectedValue: string
	selectedLabel: string
	disabled: boolean
	setOpen: (open: boolean) => void
	select: (value: string, label: string) => void
	registerItem: (value: string, label: string) => void
	unregisterItem: (value: string) => void
}

export interface SelectRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Controlled selected value */
	value?: string
	/** Initial selected value (uncontrolled) */
	defaultValue?: string
	/** Called when the selection changes */
	onChange?: (value: string) => void
	/** Disables the entire select */
	disabled?: boolean
}

export type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** Shown when nothing is selected */
	placeholder?: string
}

export type SelectContentProps = React.HTMLAttributes<HTMLDivElement>

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The value submitted on selection */
	value: string
	/** Override the display label (defaults to string children) */
	textValue?: string
	/** Disables this specific item */
	disabled?: boolean
}

export type SelectSeparatorProps = React.HTMLAttributes<HTMLHRElement>

export type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>

export type SelectGroupLabelProps = React.HTMLAttributes<HTMLSpanElement>
