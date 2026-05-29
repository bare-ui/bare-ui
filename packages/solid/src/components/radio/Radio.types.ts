import type { JSX } from 'solid-js';

export interface RadioRootProps {
	/** Controlled selected value. */
	value?: string | number;
	/** Initially selected value (uncontrolled). */
	defaultValue?: string | number;
	/** Called with the newly selected value. */
	onChange?: (value: string | number) => void;
	/** Form field name shared by every radio in the group. */
	name?: string;
	children?: JSX.Element;
	class?: string;
}

export interface RadioItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** This item's value; becomes the group's value when selected. */
	value: string | number;
	/** Disable this radio item. */
	disabled?: boolean;
	children?: JSX.Element;
}

export interface RadioIndicatorProps {
	children?: JSX.Element;
	class?: string;
}

export interface RadioLabelProps {
	children?: JSX.Element;
	class?: string;
}

export interface RadioContextValue {
	readonly selectedValue: string | number | undefined;
	readonly name: string;
	select: (itemValue: string | number) => void;
	isSelected: (itemValue: string | number) => boolean;
}

export interface RadioItemContextValue {
	readonly value: string | number;
	readonly disabled: boolean;
	readonly checked: boolean;
}
