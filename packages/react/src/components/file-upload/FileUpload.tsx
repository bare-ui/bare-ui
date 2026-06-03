'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	FileUploadContextValue,
	FileUploadDropzoneProps,
	FileUploadInputProps,
	FileUploadRootProps,
	FileUploadTriggerProps,
} from './FileUpload.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matchesAccept(file: File, accept: string | undefined): boolean {
	if (!accept) return true;
	const tokens = accept.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
	if (tokens.length === 0) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return tokens.some((token) => {
		if (token.startsWith('.')) return name.endsWith(token);
		if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
		return type === token;
	});
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

function useFileUploadContext() {
	const ctx = useContext(FileUploadContext);
	if (!ctx) throw new globalThis.Error('FileUpload compound components must be used within FileUpload.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, FileUploadRootProps>(
	(
		{
			value: controlledValue,
			defaultValue,
			onChange,
			multiple = false,
			accept,
			maxFiles,
			maxSize,
			disabled = false,
			onReject,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [files, setFilesState] = useControllableState<File[]>({
			value: controlledValue,
			defaultValue: defaultValue ?? [],
			onChange,
		});
		const [isDragging, setDragging] = useState(false);
		const inputRef = useRef<HTMLInputElement | null>(null);

		const setFiles = useCallback((next: File[]) => setFilesState(next), [setFilesState]);

		const addFiles = useCallback(
			(incoming: File[]) => {
				if (disabled) return;
				const accepted: File[] = [];
				const rejected: { file: File; reason: 'maxFiles' | 'maxSize' | 'accept' }[] = [];
				const base = multiple ? files : [];
				const slotsAvailable = maxFiles !== undefined ? Math.max(0, maxFiles - base.length) : Infinity;

				for (const file of incoming) {
					if (!matchesAccept(file, accept)) {
						rejected.push({ file, reason: 'accept' });
						continue;
					}
					if (maxSize !== undefined && file.size > maxSize) {
						rejected.push({ file, reason: 'maxSize' });
						continue;
					}
					if (accepted.length >= slotsAvailable) {
						rejected.push({ file, reason: 'maxFiles' });
						continue;
					}
					accepted.push(file);
					if (!multiple) break;
				}

				if (rejected.length > 0) onReject?.(rejected);
				if (accepted.length > 0) setFiles(multiple ? [...base, ...accepted] : accepted);
			},
			[disabled, multiple, files, maxFiles, maxSize, accept, onReject, setFiles],
		);

		const removeFile = useCallback(
			(index: number) => {
				if (disabled) return;
				setFiles(files.filter((_, i) => i !== index));
			},
			[disabled, files, setFiles],
		);

		const openPicker = useCallback(() => {
			if (disabled) return;
			inputRef.current?.click();
		}, [disabled]);

		const registerInput = useCallback((el: HTMLInputElement | null) => {
			inputRef.current = el;
		}, []);

		const ctx = useMemo<FileUploadContextValue>(
			() => ({
				files,
				disabled,
				multiple,
				accept,
				maxFiles,
				maxSize,
				isDragging,
				addFiles,
				removeFile,
				openPicker,
				registerInput,
				setDragging,
			}),
			[files, disabled, multiple, accept, maxFiles, maxSize, isDragging, addFiles, removeFile, openPicker, registerInput],
		);

		return (
			<FileUploadContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</FileUploadContext.Provider>
		);
	},
);
Root.displayName = 'FileUpload.Root';

// ---------------------------------------------------------------------------
// Input (hidden native file input)
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, FileUploadInputProps>(({ className, style, ...rest }, ref) => {
	const ctx = useFileUploadContext();

	const composedRef = useMergedRefs<HTMLInputElement>(ctx.registerInput, ref);

	return (
		<input
			ref={composedRef}
			type='file'
			multiple={ctx.multiple}
			accept={ctx.accept}
			disabled={ctx.disabled}
			tabIndex={-1}
			aria-hidden='true'
			className={className}
			style={{
				position: 'absolute',
				width: 1,
				height: 1,
				opacity: 0,
				overflow: 'hidden',
				clip: 'rect(0 0 0 0)',
				clipPath: 'inset(50%)',
				whiteSpace: 'nowrap',
				...style,
			}}
			{...rest}
			onChange={(e) => {
				const list = e.currentTarget.files;
				if (list && list.length > 0) ctx.addFiles(Array.from(list));
				// Reset so re-selecting the same file fires change again.
				e.currentTarget.value = '';
			}}
		/>
	);
});
Input.displayName = 'FileUpload.Input';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, FileUploadTriggerProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const ctx = useFileUploadContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled: ctx.disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				disabled={ctx.disabled}
				className={className}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					ctx.openPicker();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);
Trigger.displayName = 'FileUpload.Trigger';

// ---------------------------------------------------------------------------
// Dropzone
// ---------------------------------------------------------------------------

const Dropzone = React.forwardRef<HTMLDivElement, FileUploadDropzoneProps>(
	({ children, className, onClick, onKeyDown, ...rest }, ref) => {
		const ctx = useFileUploadContext();

		return (
			<div
				ref={ref}
				role='button'
				tabIndex={ctx.disabled ? -1 : 0}
				aria-disabled={ctx.disabled || undefined}
				className={className}
				data-dragging={ctx.isDragging ? '' : undefined}
				data-disabled={ctx.disabled ? '' : undefined}
				{...rest}
				onClick={(e) => {
					if (!ctx.disabled) ctx.openPicker();
					onClick?.(e);
				}}
				onKeyDown={(e) => {
					if (!ctx.disabled && (e.key === 'Enter' || e.key === ' ')) {
						e.preventDefault();
						ctx.openPicker();
					}
					onKeyDown?.(e);
				}}
				onDragEnter={(e) => {
					e.preventDefault();
					if (!ctx.disabled) ctx.setDragging(true);
				}}
				onDragOver={(e) => {
					e.preventDefault();
					if (!ctx.disabled) ctx.setDragging(true);
				}}
				onDragLeave={(e) => {
					e.preventDefault();
					if (e.currentTarget.contains(e.relatedTarget as Node)) return;
					ctx.setDragging(false);
				}}
				onDrop={(e) => {
					e.preventDefault();
					ctx.setDragging(false);
					if (ctx.disabled) return;
					const dropped = Array.from(e.dataTransfer.files);
					if (dropped.length > 0) ctx.addFiles(dropped);
				}}>
				{children}
			</div>
		);
	},
);
Dropzone.displayName = 'FileUpload.Dropzone';

// ---------------------------------------------------------------------------
// Items render-prop
// ---------------------------------------------------------------------------

interface FileUploadItemsProps {
	children: (file: File, index: number, remove: () => void) => React.ReactNode;
}

const Items: React.FC<FileUploadItemsProps> = ({ children }) => {
	const { files, removeFile } = useFileUploadContext();
	return <>{files.map((file, i) => children(file, i, () => removeFile(i)))}</>;
};
Items.displayName = 'FileUpload.Items';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const FileUpload = { Root, Input, Trigger, Dropzone, Items };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `FileUpload.*`).
export { Root, Input, Trigger, Dropzone, Items };
