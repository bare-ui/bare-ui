import type { JSX } from 'solid-js';

export interface RadioRootProps {
	value?: string | number;
	defaultValue?: string | number;
	onChange?: (value: string | number) => void;
	name?: string;
	children?: JSX.Element;
	class?: string;
}

export interface RadioItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	value: string | number;
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
