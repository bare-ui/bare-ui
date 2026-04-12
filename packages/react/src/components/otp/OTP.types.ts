import React from 'react';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface OTPContextValue {
	chars: string[];
	length: number;
	disabled: boolean;
	isComplete: boolean;
	registerRef: (index: number, el: HTMLInputElement | null) => void;
	handleChange: (index: number, value: string) => void;
	handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
	handlePaste: (index: number, e: React.ClipboardEvent<HTMLInputElement>) => void;
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface OTPRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Number of slots (default: 6) */
	length?: number;
	/** Controlled value */
	value?: string;
	/** Initial uncontrolled value */
	defaultValue?: string;
	/** Called on every change with the current full value string */
	onChange?: (value: string) => void;
	/** Called once all slots are filled */
	onComplete?: (value: string) => void;
	/** Restrict input to numeric or alphanumeric characters (default: 'numeric') */
	pattern?: 'numeric' | 'alphanumeric';
	/** Disables all slots */
	disabled?: boolean;
}

export interface OTPSlotProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Zero-based slot index */
	index: number;
}

export type OTPSeparatorProps = React.HTMLAttributes<HTMLSpanElement>;
