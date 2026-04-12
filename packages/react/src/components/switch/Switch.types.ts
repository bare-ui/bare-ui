import React from 'react';

export interface SwitchContextValue {
	checked: boolean;
	disabled: boolean;
}

export interface SwitchRootProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
	/** Controlled checked state */
	checked?: boolean;
	/** Initial unchecked state (uncontrolled) */
	defaultChecked?: boolean;
	/** Called when the switch is toggled */
	onChange?: (checked: boolean) => void;
	/** Disables the switch */
	disabled?: boolean;
}

export type SwitchThumbProps = React.HTMLAttributes<HTMLSpanElement>;
