export interface CheckboxContextValue {
	values: (string | number)[];
	name: string;
	toggle: (value: string | number) => void;
	isChecked: (value: string | number) => boolean;
}

export interface CheckboxItemContextValue {
	value: string | number;
	disabled: boolean;
	checked: boolean;
}

export interface CheckboxRootProps {
	/** Controlled list of checked item values. */
	value?: (string | number)[];
	/** Initially checked item values (uncontrolled). */
	defaultValue?: (string | number)[];
	/** Called with the new list of checked values whenever the selection changes. */
	onChange?: (value: (string | number)[]) => void;
	/** Form field name shared by every checkbox in the group. */
	name?: string;
	class?: string;
}

export interface CheckboxItemProps {
	/** This item's value; added to the group's value array while checked. */
	value: string | number;
	/** Disable this checkbox item. */
	disabled?: boolean;
	class?: string;
}

export interface CheckboxIndicatorProps {
	class?: string;
}

export interface CheckboxLabelProps {
	class?: string;
}
