export interface SwitchContextValue {
	checked: boolean;
	disabled: boolean;
}

export interface SwitchRootProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	class?: string;
}

export interface SwitchThumbProps {
	class?: string;
}
