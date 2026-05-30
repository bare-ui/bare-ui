export interface RadioContextValue {
	selectedValue: string | number | undefined;
	name: string;
	select: (value: string | number) => void;
	isSelected: (value: string | number) => boolean;
}

export interface RadioItemContextValue {
	value: string | number;
	disabled: boolean;
	checked: boolean;
}

export interface RadioRootProps {
	/** Controlled selected value. */
	value?: string | number;
	/** Initially selected value (uncontrolled). */
	defaultValue?: string | number;
	/** Called with the newly selected value. */
	onChange?: (value: string | number) => void;
	/** Form field name shared by every radio in the group. */
	name?: string;
	class?: string;
}

export interface RadioItemProps {
	/** This item's value; becomes the group's value when selected. */
	value: string | number;
	/** Disable this radio item. */
	disabled?: boolean;
	class?: string;
}

export interface RadioIndicatorProps {
	class?: string;
}

export interface RadioLabelProps {
	class?: string;
}
