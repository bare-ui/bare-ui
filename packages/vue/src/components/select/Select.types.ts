export interface SelectContextValue {
	open: boolean;
	selectedValue: string;
	selectedLabel: string;
	disabled: boolean;
	setOpen: (open: boolean) => void;
	select: (value: string, label: string) => void;
	registerItem: (value: string, label: string) => void;
	unregisterItem: (value: string) => void;
}

export interface SelectRootProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	class?: string;
}

export interface SelectTriggerProps {
	class?: string;
}

export interface SelectValueProps {
	placeholder?: string;
	class?: string;
}

export interface SelectContentProps {
	class?: string;
}

export interface SelectItemProps {
	value: string;
	textValue?: string;
	disabled?: boolean;
	class?: string;
}

export interface SelectSeparatorProps {
	class?: string;
}

export interface SelectGroupProps {
	class?: string;
}

export interface SelectGroupLabelProps {
	class?: string;
}
