export interface RadioRootProps {
	/** Controlled selected value. */
	value?: string | number;
	/** Initially selected value (uncontrolled). */
	defaultValue?: string | number;
	/** Called with the newly selected value. */
	onChange?: (value: string | number) => void;
	/** Form field name shared by every radio in the group. */
	name?: string;
	children?: React.ReactNode;
	className?: string;
}

export interface RadioItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** This item's value; becomes the group's value when selected. */
	value: string | number;
	/** Disable this radio item. */
	disabled?: boolean;
	children?: React.ReactNode;
}

export interface RadioIndicatorProps {
	children?: React.ReactNode;
	className?: string;
}

export interface RadioLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	children?: React.ReactNode;
	className?: string;
}

export interface RadioContextValue {
	selectedValue: string | number | undefined;
	name: string;
	select: (itemValue: string | number) => void;
	isSelected: (itemValue: string | number) => boolean;
}

export interface RadioItemContextValue {
	value: string | number;
	disabled: boolean;
	checked: boolean;
	/** id of the underlying radio input, used by Radio.Label's htmlFor. */
	inputId: string;
}
