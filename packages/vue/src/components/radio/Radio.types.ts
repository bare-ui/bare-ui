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
	value?: string | number;
	defaultValue?: string | number;
	onChange?: (value: string | number) => void;
	name?: string;
	class?: string;
}

export interface RadioItemProps {
	value: string | number;
	disabled?: boolean;
	class?: string;
}

export interface RadioIndicatorProps {
	class?: string;
}

export interface RadioLabelProps {
	class?: string;
}
