export interface OTPContextValue {
	chars: string[];
	length: number;
	disabled: boolean;
	isComplete: boolean;
	registerRef: (index: number, el: HTMLInputElement | null) => void;
	handleChange: (index: number, value: string) => void;
	handleKeyDown: (index: number, e: KeyboardEvent) => void;
	handlePaste: (index: number, e: ClipboardEvent) => void;
}

export interface OTPRootProps {
	length?: number;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
	pattern?: 'numeric' | 'alphanumeric';
	disabled?: boolean;
	class?: string;
}

export interface OTPSlotProps {
	index: number;
	class?: string;
}

export interface OTPSeparatorProps {
	class?: string;
}
