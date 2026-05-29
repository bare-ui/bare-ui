import type { JSX } from 'solid-js';

export interface CheckboxRootProps {
	/** Controlled list of checked item values. */
	value?: (string | number)[];
	/** Initially checked item values (uncontrolled). */
	defaultValue?: (string | number)[];
	/** Called with the new list of checked values whenever the selection changes. */
	onChange?: (value: (string | number)[]) => void;
	/** Form field name shared by every checkbox in the group. */
	name?: string;
	children?: JSX.Element;
	class?: string;
}

export interface CheckboxItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** This item's value; added to the group's value array while checked. */
	value: string | number;
	/** Disable this checkbox item. */
	disabled?: boolean;
	children?: JSX.Element;
}

export interface CheckboxIndicatorProps {
	children?: JSX.Element;
	class?: string;
}

export interface CheckboxLabelProps {
	children?: JSX.Element;
	class?: string;
}

export interface CheckboxContextValue {
	readonly values: (string | number)[];
	readonly name: string;
	toggle: (itemValue: string | number) => void;
	isChecked: (itemValue: string | number) => boolean;
}

export interface CheckboxItemContextValue {
	readonly value: string | number;
	readonly disabled: boolean;
	readonly checked: boolean;
}
