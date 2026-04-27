import type { JSX } from 'solid-js';

export interface SwitchContextValue {
	readonly checked: boolean;
	readonly disabled: boolean;
}

export interface SwitchRootProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
	/** Controlled checked state */
	checked?: boolean;
	/** Initial unchecked state (uncontrolled) */
	defaultChecked?: boolean;
	/** Called when the switch is toggled */
	onChange?: (checked: boolean) => void;
	/** Disables the switch */
	disabled?: boolean;
}

export type SwitchThumbProps = JSX.HTMLAttributes<HTMLSpanElement>;
