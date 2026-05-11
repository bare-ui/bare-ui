import type { JSX } from 'solid-js';

export interface FileUploadRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Controlled list of files. */
	value?: File[];
	/** Initial file list (uncontrolled). */
	defaultValue?: File[];
	/** Called whenever the file list changes. */
	onChange?: (files: File[]) => void;
	/** Allow selecting multiple files. */
	multiple?: boolean;
	/** Accept attribute, e.g. "image/*" or ".pdf,.doc". */
	accept?: string;
	/** Maximum number of files. */
	maxFiles?: number;
	/** Maximum size per file in bytes. */
	maxSize?: number;
	/** Disable the dropzone + trigger. */
	disabled?: boolean;
	/** Called when files are rejected (too many, too large, wrong type). */
	onReject?: (rejected: { file: File; reason: 'maxFiles' | 'maxSize' | 'accept' }[]) => void;
}

export type FileUploadInputProps = Omit<
	JSX.InputHTMLAttributes<HTMLInputElement>,
	'type' | 'value' | 'defaultValue' | 'onChange'
>;

export type FileUploadTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type FileUploadDropzoneProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface FileUploadContextValue {
	readonly files: File[];
	readonly disabled: boolean;
	readonly multiple: boolean;
	readonly accept?: string;
	readonly maxFiles?: number;
	readonly maxSize?: number;
	readonly isDragging: boolean;
	addFiles: (incoming: File[]) => void;
	removeFile: (index: number) => void;
	openPicker: () => void;
	registerInput: (el: HTMLInputElement | null) => void;
	setDragging: (v: boolean) => void;
}
