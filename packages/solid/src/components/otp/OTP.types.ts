import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface OTPContextValue {
	readonly chars: string[];
	readonly length: number;
	readonly disabled: boolean;
	readonly isComplete: boolean;
	registerRef: (index: number, el: HTMLInputElement | null) => void;
	handleChange: (index: number, value: string) => void;
	handleKeyDown: (index: number, e: KeyboardEvent) => void;
	handlePaste: (index: number, e: ClipboardEvent) => void;
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface OTPRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export interface OTPSlotProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	/** Zero-based slot index */
	index: number;
}

export type OTPSeparatorProps = JSX.HTMLAttributes<HTMLSpanElement>;
