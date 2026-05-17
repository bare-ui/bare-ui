import { createContext, createSignal, For, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
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
	const tokens = accept
		.split(',')
		.map((t) => t.trim().toLowerCase())
		.filter(Boolean);
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
	if (!ctx) throw new Error('FileUpload compound components must be used within FileUpload.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: FileUploadRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'multiple',
		'accept',
		'maxFiles',
		'maxSize',
		'disabled',
		'onReject',
		'children',
		'class',
	]);

	const [files, setFiles] = createControllableState<File[]>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? [],
		get onChange() {
			return local.onChange;
		},
	});
	const [isDragging, setDragging] = createSignal(false);
	let inputEl: HTMLInputElement | null = null;

	const addFiles = (incoming: File[]) => {
		if (local.disabled) return;
		const accepted: File[] = [];
		const rejected: { file: File; reason: 'maxFiles' | 'maxSize' | 'accept' }[] = [];
		const base = local.multiple ? files() : [];
		const slotsAvailable = local.maxFiles !== undefined ? Math.max(0, local.maxFiles - base.length) : Infinity;

		for (const file of incoming) {
			if (!matchesAccept(file, local.accept)) {
				rejected.push({ file, reason: 'accept' });
				continue;
			}
			if (local.maxSize !== undefined && file.size > local.maxSize) {
				rejected.push({ file, reason: 'maxSize' });
				continue;
			}
			if (accepted.length >= slotsAvailable) {
				rejected.push({ file, reason: 'maxFiles' });
				continue;
			}
			accepted.push(file);
			if (!local.multiple) break;
		}

		if (rejected.length > 0) local.onReject?.(rejected);
		if (accepted.length > 0) setFiles(local.multiple ? [...base, ...accepted] : accepted);
	};

	const removeFile = (index: number) => {
		if (local.disabled) return;
		setFiles(files().filter((_, i) => i !== index));
	};

	const openPicker = () => {
		if (local.disabled) return;
		inputEl?.click();
	};

	const registerInput = (el: HTMLInputElement | null) => {
		inputEl = el;
	};

	const ctxValue: FileUploadContextValue = {
		get files() {
			return files();
		},
		get disabled() {
			return !!local.disabled;
		},
		get multiple() {
			return !!local.multiple;
		},
		get accept() {
			return local.accept;
		},
		get maxFiles() {
			return local.maxFiles;
		},
		get maxSize() {
			return local.maxSize;
		},
		get isDragging() {
			return isDragging();
		},
		addFiles,
		removeFile,
		openPicker,
		registerInput,
		setDragging,
	};

	return (
		<FileUploadContext.Provider value={ctxValue}>
			<div
				class={local.class}
				data-disabled={local.disabled ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</FileUploadContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Input (hidden native file input)
// ---------------------------------------------------------------------------

function Input(props: FileUploadInputProps) {
	const [local, rest] = splitProps(props, ['class', 'style', 'ref']);
	const ctx = useFileUploadContext();
	const mergedRef = createMergedRefs<HTMLInputElement>(
		(el) => ctx.registerInput(el),
		(el) => (local.ref as ((el: HTMLInputElement) => void) | undefined)?.(el),
	);

	const mergedStyle = (): JSX.CSSProperties | string | undefined => {
		const ours: JSX.CSSProperties = {
			position: 'absolute',
			width: '1px',
			height: '1px',
			opacity: 0,
			overflow: 'hidden',
			clip: 'rect(0 0 0 0)',
			'clip-path': 'inset(50%)',
			'white-space': 'nowrap',
		};
		const userStyle = local.style;
		if (typeof userStyle === 'string' || !userStyle) return ours;
		return { ...ours, ...(userStyle as JSX.CSSProperties) };
	};

	return (
		<input
			ref={mergedRef}
			type='file'
			multiple={ctx.multiple}
			accept={ctx.accept}
			disabled={ctx.disabled}
			tabIndex={-1}
			aria-hidden='true'
			class={local.class}
			style={mergedStyle()}
			{...rest}
			onChange={(e) => {
				const list = e.currentTarget.files;
				if (list && list.length > 0) ctx.addFiles(Array.from(list));
				// Reset so re-selecting the same file fires change again.
				e.currentTarget.value = '';
			}}
		/>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: FileUploadTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useFileUploadContext();
	const state = createInteractiveState({
		get disabled() {
			return ctx.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.openPicker();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			disabled={ctx.disabled}
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Dropzone
// ---------------------------------------------------------------------------

function Dropzone(props: FileUploadDropzoneProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick', 'onKeyDown']);
	const ctx = useFileUploadContext();

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!ctx.disabled) ctx.openPicker();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		if (!ctx.disabled && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			ctx.openPicker();
		}
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			role='button'
			tabIndex={ctx.disabled ? -1 : 0}
			aria-disabled={ctx.disabled || undefined}
			class={local.class}
			data-dragging={ctx.isDragging ? '' : undefined}
			data-disabled={ctx.disabled ? '' : undefined}
			{...rest}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
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
				const dropped = Array.from(e.dataTransfer?.files ?? []);
				if (dropped.length > 0) ctx.addFiles(dropped);
			}}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Items render-prop
// ---------------------------------------------------------------------------

interface FileUploadItemsProps {
	children: (file: File, index: number, remove: () => void) => JSX.Element;
}

function Items(props: FileUploadItemsProps) {
	const ctx = useFileUploadContext();
	return (
		<For each={ctx.files}>
			{(file, i) => {
				// Snapshot index at render time. `i` shifts when items above are removed,
				// but the render-prop result is created once per file and stable thereafter.
				// The remove callback re-reads `i()` so it always removes the current
				// position, not the original.
				// eslint-disable-next-line solid/reactivity
				return props.children(file, i(), () => ctx.removeFile(i()));
			}}
		</For>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const FileUpload = { Root, Input, Trigger, Dropzone, Items };
