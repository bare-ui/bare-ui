export interface CheckboxRootProps {
	/** Controlled list of checked item values. */
	value?: (string | number)[];
	/** Initially checked item values (uncontrolled). */
	defaultValue?: (string | number)[];
	/** Called with the new list of checked values whenever the selection changes. */
	onChange?: (value: (string | number)[]) => void;
	/** Form field name shared by every checkbox in the group. */
	name?: string;
	children?: React.ReactNode;
	className?: string;
}

export interface CheckboxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** This item's value; added to the group's value array while checked. */
	value: string | number;
	/** Disable this checkbox item. */
	disabled?: boolean;
	children?: React.ReactNode;
}

export interface CheckboxIndicatorProps {
	children?: React.ReactNode;
	className?: string;
}

export interface CheckboxLabelProps {
	children?: React.ReactNode;
	className?: string;
}

export interface CheckboxContextValue {
	values: (string | number)[];
	name: string;
	toggle: (itemValue: string | number) => void;
	isChecked: (itemValue: string | number) => boolean;
}

export interface CheckboxItemContextValue {
	value: string | number;
	disabled: boolean;
	checked: boolean;
	/** Unique id of the item's native input, used to associate the label via htmlFor. */
	inputId: string;
}
