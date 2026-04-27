import type { JSX } from 'solid-js';

export interface CheckboxRootProps {
	value?: (string | number)[];
	defaultValue?: (string | number)[];
	onChange?: (value: (string | number)[]) => void;
	name?: string;
	children?: JSX.Element;
	class?: string;
}

export interface CheckboxItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	value: string | number;
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
