import type { ComputedRef, Ref } from 'vue'

export interface FileUploadRootProps {
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

export type FileUploadInputProps = Record<string, never>;
export type FileUploadTriggerProps = Record<string, never>;
export type FileUploadDropzoneProps = Record<string, never>;

export interface FileUploadContextValue {
	files: ComputedRef<File[]>;
	disabled: ComputedRef<boolean>;
	multiple: ComputedRef<boolean>;
	accept: ComputedRef<string | undefined>;
	maxFiles: ComputedRef<number | undefined>;
	maxSize: ComputedRef<number | undefined>;
	isDragging: Ref<boolean>;
	addFiles: (incoming: File[]) => void;
	removeFile: (index: number) => void;
	openPicker: () => void;
	registerInput: (el: HTMLInputElement | null) => void;
	setDragging: (v: boolean) => void;
}
