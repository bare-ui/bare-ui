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
	value?: (string | number)[];
	defaultValue?: (string | number)[];
	onChange?: (value: (string | number)[]) => void;
	name?: string;
	class?: string;
}

export interface CheckboxItemProps {
	value: string | number;
	disabled?: boolean;
	class?: string;
}

export interface CheckboxIndicatorProps {
	class?: string;
}

export interface CheckboxLabelProps {
	class?: string;
}
