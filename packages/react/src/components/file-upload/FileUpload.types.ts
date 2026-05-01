import React from 'react';

export interface FileUploadRootProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
	React.InputHTMLAttributes<HTMLInputElement>,
	'type' | 'value' | 'defaultValue' | 'onChange'
>;

export type FileUploadTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type FileUploadDropzoneProps = React.HTMLAttributes<HTMLDivElement>;

export interface FileUploadContextValue {
	files: File[];
	disabled: boolean;
	multiple: boolean;
	accept?: string;
	maxFiles?: number;
	maxSize?: number;
	isDragging: boolean;
	addFiles: (incoming: File[]) => void;
	removeFile: (index: number) => void;
	openPicker: () => void;
	registerInput: (el: HTMLInputElement | null) => void;
	setDragging: (v: boolean) => void;
}
