import { createContext, createSignal, onMount, splitProps, useContext, Show, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import type {
	EditableAreaProps,
	EditableCancelTriggerProps,
	EditableContextValue,
	EditableEditTriggerProps,
	EditableInputProps,
	EditablePreviewProps,
	EditableRootProps,
	EditableSubmitTriggerProps,
} from './Editable.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const EditableContext = createContext<EditableContextValue | null>(null);

function useEditableContext() {
	const ctx = useContext(EditableContext);
	if (!ctx) throw new Error('Editable sub-components must be used within Editable.Root');
	return ctx;
}

function callUserHandler<E>(handler: unknown, e: E) {
	if (typeof handler === 'function') (handler as (event: E) => void)(e);
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: EditableRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'editing',
		'defaultEditing',
		'onEditingChange',
		'onSubmit',
		'onCancel',
		'onEdit',
		'submitOnBlur',
		'disabled',
		'placeholder',
		'class',
		'children',
	]);

	const [value, setValue] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? '',
		get onChange() {
			return local.onChange;
		},
	});

	const [isEditing, setEditing] = createControllableState<boolean>({
		get value() {
			return local.editing;
		},
		defaultValue: local.defaultEditing ?? false,
		get onChange() {
			return local.onEditingChange;
		},
	});

	const [draft, setDraft] = createSignal(value());

	const disabled = () => local.disabled ?? false;
	const submitOnBlur = () => local.submitOnBlur ?? true;

	const startEdit = () => {
		if (disabled()) return;
		setDraft(value());
		setEditing(true);
		local.onEdit?.();
	};

	const submit = () => {
		const next = draft();
		setValue(next);
		setEditing(false);
		local.onSubmit?.(next);
	};

	const cancel = () => {
		setDraft(value());
		setEditing(false);
		local.onCancel?.();
	};

	const ctx: EditableContextValue = {
		get value() {
			return value();
		},
		get draft() {
			return draft();
		},
		get isEditing() {
			return !!isEditing();
		},
		get disabled() {
			return disabled();
		},
		get placeholder() {
			return local.placeholder;
		},
		get submitOnBlur() {
			return submitOnBlur();
		},
		setDraft,
		startEdit,
		cancel,
		submit,
	};

	return (
		<EditableContext.Provider value={ctx}>
			<div
				class={local.class}
				data-editing={ctx.isEditing ? '' : undefined}
				data-disabled={disabled() ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</EditableContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

function Preview(props: EditablePreviewProps) {
	const ctx = useEditableContext();
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'onKeyDown']);

	const isEmpty = () => ctx.value.length === 0;

	const handleClick: JSX.EventHandler<HTMLSpanElement, MouseEvent> = (e) => {
		ctx.startEdit();
		callUserHandler(local.onClick, e);
	};

	const handleKeyDown: JSX.EventHandler<HTMLSpanElement, KeyboardEvent> = (e) => {
		callUserHandler(local.onKeyDown, e);
		if (e.defaultPrevented) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			ctx.startEdit();
		}
	};

	return (
		<Show when={!ctx.isEditing}>
			<span
				role='button'
				tabIndex={ctx.disabled ? -1 : 0}
				aria-disabled={ctx.disabled || undefined}
				data-empty={isEmpty() ? '' : undefined}
				class={local.class}
				{...rest}
				onClick={handleClick}
				onKeyDown={handleKeyDown}>
				{local.children ?? (isEmpty() ? ctx.placeholder : ctx.value)}
			</span>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Input (single line)
// ---------------------------------------------------------------------------

function Input(props: EditableInputProps) {
	const ctx = useEditableContext();
	const [local, rest] = splitProps(props, ['class', 'onKeyDown', 'onBlur', 'onInput', 'ref']);
	let innerRef: HTMLInputElement | undefined;
	const mergedRef = createMergedRefs<HTMLInputElement>(
		(el) => (innerRef = el),
		(el) => {
			const userRef = local.ref;
			if (typeof userRef === 'function') (userRef as (el: HTMLInputElement) => void)(el);
		},
	);

	const fieldKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			ctx.cancel();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			ctx.submit();
		}
	};

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		ctx.setDraft(e.currentTarget.value);
		callUserHandler(local.onInput, e);
	};

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		callUserHandler(local.onKeyDown, e);
		if (!e.defaultPrevented) fieldKeyDown(e);
	};

	const handleBlur: JSX.FocusEventHandler<HTMLInputElement, FocusEvent> = (e) => {
		if (ctx.submitOnBlur) ctx.submit();
		callUserHandler(local.onBlur, e);
	};

	return (
		<Show when={ctx.isEditing}>
			{(() => {
				onMount(() => {
					innerRef?.focus();
					innerRef?.select();
				});
				return (
					<input
						ref={mergedRef}
						type='text'
						value={ctx.draft}
						disabled={ctx.disabled}
						placeholder={ctx.placeholder}
						class={local.class}
						{...rest}
						onInput={handleInput}
						onKeyDown={handleKeyDown}
						onBlur={handleBlur}
					/>
				);
			})()}
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Area (multi line)
// ---------------------------------------------------------------------------

function Area(props: EditableAreaProps) {
	const ctx = useEditableContext();
	const [local, rest] = splitProps(props, ['class', 'onKeyDown', 'onBlur', 'onInput', 'ref']);
	let innerRef: HTMLTextAreaElement | undefined;
	const mergedRef = createMergedRefs<HTMLTextAreaElement>(
		(el) => (innerRef = el),
		(el) => {
			const userRef = local.ref;
			if (typeof userRef === 'function') (userRef as (el: HTMLTextAreaElement) => void)(el);
		},
	);

	const fieldKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			ctx.cancel();
		} else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			ctx.submit();
		}
	};

	const handleInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
		ctx.setDraft(e.currentTarget.value);
		callUserHandler(local.onInput, e);
	};

	const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (e) => {
		callUserHandler(local.onKeyDown, e);
		if (!e.defaultPrevented) fieldKeyDown(e);
	};

	const handleBlur: JSX.FocusEventHandler<HTMLTextAreaElement, FocusEvent> = (e) => {
		if (ctx.submitOnBlur) ctx.submit();
		callUserHandler(local.onBlur, e);
	};

	return (
		<Show when={ctx.isEditing}>
			{(() => {
				onMount(() => {
					innerRef?.focus();
					innerRef?.select();
				});
				return (
					<textarea
						ref={mergedRef}
						value={ctx.draft}
						disabled={ctx.disabled}
						placeholder={ctx.placeholder}
						class={local.class}
						{...rest}
						onInput={handleInput}
						onKeyDown={handleKeyDown}
						onBlur={handleBlur}
					/>
				);
			})()}
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Triggers
// ---------------------------------------------------------------------------

function EditTrigger(props: EditableEditTriggerProps) {
	const ctx = useEditableContext();
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick']);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.startEdit();
		callUserHandler(local.onClick, e);
	};

	return (
		<Show when={!ctx.isEditing}>
			<button
				type='button'
				disabled={ctx.disabled}
				class={local.class}
				{...rest}
				onClick={handleClick}>
				{local.children}
			</button>
		</Show>
	);
}

function SubmitTrigger(props: EditableSubmitTriggerProps) {
	const ctx = useEditableContext();
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'onMouseDown']);

	const handleMouseDown: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		// Run before the field's blur-submit so both don't fire twice.
		e.preventDefault();
		callUserHandler(local.onMouseDown, e);
	};

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.submit();
		callUserHandler(local.onClick, e);
	};

	return (
		<Show when={ctx.isEditing}>
			<button
				type='button'
				class={local.class}
				{...rest}
				onMouseDown={handleMouseDown}
				onClick={handleClick}>
				{local.children}
			</button>
		</Show>
	);
}

function CancelTrigger(props: EditableCancelTriggerProps) {
	const ctx = useEditableContext();
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'onMouseDown']);

	const handleMouseDown: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		e.preventDefault();
		callUserHandler(local.onMouseDown, e);
	};

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.cancel();
		callUserHandler(local.onClick, e);
	};

	return (
		<Show when={ctx.isEditing}>
			<button
				type='button'
				class={local.class}
				{...rest}
				onMouseDown={handleMouseDown}
				onClick={handleClick}>
				{local.children}
			</button>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Editable = {
	Root,
	Preview,
	Input,
	Area,
	EditTrigger,
	SubmitTrigger,
	CancelTrigger,
};

export { Root, Preview, Input, Area, EditTrigger, SubmitTrigger, CancelTrigger };
