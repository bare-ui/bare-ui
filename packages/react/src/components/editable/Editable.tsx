import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useMergedRefs } from '@/hooks/use-merged-refs';
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
	if (!ctx) throw new globalThis.Error('Editable sub-components must be used within Editable.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, EditableRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onChange,
			editing: controlledEditing,
			defaultEditing = false,
			onEditingChange,
			onSubmit,
			onCancel,
			onEdit,
			submitOnBlur = true,
			disabled = false,
			placeholder,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const [value, setValue] = useControllableState<string>({
			value: controlledValue,
			defaultValue,
			onChange,
		});
		const [isEditing, setEditing] = useControllableState<boolean>({
			value: controlledEditing,
			defaultValue: defaultEditing,
			onChange: onEditingChange,
		});
		const [draft, setDraft] = useState(value);

		const startEdit = useCallback(() => {
			if (disabled) return;
			setDraft(value);
			setEditing(true);
			onEdit?.();
		}, [disabled, value, setEditing, onEdit]);

		const submit = useCallback(() => {
			setValue(draft);
			setEditing(false);
			onSubmit?.(draft);
		}, [draft, setValue, setEditing, onSubmit]);

		const cancel = useCallback(() => {
			setDraft(value);
			setEditing(false);
			onCancel?.();
		}, [value, setEditing, onCancel]);

		const ctx: EditableContextValue = {
			value,
			draft,
			isEditing,
			disabled,
			placeholder,
			submitOnBlur,
			setDraft,
			startEdit,
			cancel,
			submit,
		};

		return (
			<EditableContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-editing={isEditing ? '' : undefined}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</EditableContext.Provider>
		);
	},
);

Root.displayName = 'Editable.Root';

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

const Preview = React.forwardRef<HTMLSpanElement, EditablePreviewProps>(
	({ className, children, onClick, onKeyDown, ...rest }, ref) => {
		const ctx = useEditableContext();
		if (ctx.isEditing) return null;

		const isEmpty = ctx.value.length === 0;

		return (
			<span
				ref={ref}
				role='button'
				tabIndex={ctx.disabled ? -1 : 0}
				aria-disabled={ctx.disabled || undefined}
				data-empty={isEmpty ? '' : undefined}
				className={className}
				{...rest}
				onClick={(e) => {
					ctx.startEdit();
					onClick?.(e);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.defaultPrevented) return;
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						ctx.startEdit();
					}
				}}>
				{children ?? (isEmpty ? ctx.placeholder : ctx.value)}
			</span>
		);
	},
);

Preview.displayName = 'Editable.Preview';

// ---------------------------------------------------------------------------
// Shared edit-field behaviour
// ---------------------------------------------------------------------------

function useEditFieldHandlers(multiline: boolean) {
	const ctx = useEditableContext();

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			ctx.cancel();
		} else if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			ctx.submit();
		}
	};

	return { ctx, onKeyDown };
}

// ---------------------------------------------------------------------------
// Input (single line)
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, EditableInputProps>(
	({ className, onKeyDown, onBlur, ...rest }, ref) => {
		const { ctx, onKeyDown: fieldKeyDown } = useEditFieldHandlers(false);
		const innerRef = useRef<HTMLInputElement | null>(null);
		const mergedRef = useMergedRefs(innerRef, ref);

		useIsomorphicLayoutEffect(() => {
			if (ctx.isEditing) {
				innerRef.current?.focus();
				innerRef.current?.select();
			}
		}, [ctx.isEditing]);

		if (!ctx.isEditing) return null;

		return (
			<input
				ref={mergedRef}
				type='text'
				value={ctx.draft}
				disabled={ctx.disabled}
				placeholder={ctx.placeholder}
				className={className}
				{...rest}
				onChange={(e) => ctx.setDraft(e.target.value)}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (!e.defaultPrevented) fieldKeyDown(e);
				}}
				onBlur={(e) => {
					if (ctx.submitOnBlur) ctx.submit();
					onBlur?.(e);
				}}
			/>
		);
	},
);

Input.displayName = 'Editable.Input';

// ---------------------------------------------------------------------------
// Area (multi line)
// ---------------------------------------------------------------------------

const Area = React.forwardRef<HTMLTextAreaElement, EditableAreaProps>(
	({ className, onKeyDown, onBlur, ...rest }, ref) => {
		const { ctx, onKeyDown: fieldKeyDown } = useEditFieldHandlers(true);
		const innerRef = useRef<HTMLTextAreaElement | null>(null);
		const mergedRef = useMergedRefs(innerRef, ref);

		useIsomorphicLayoutEffect(() => {
			if (ctx.isEditing) {
				innerRef.current?.focus();
				innerRef.current?.select();
			}
		}, [ctx.isEditing]);

		if (!ctx.isEditing) return null;

		return (
			<textarea
				ref={mergedRef}
				value={ctx.draft}
				disabled={ctx.disabled}
				placeholder={ctx.placeholder}
				className={className}
				{...rest}
				onChange={(e) => ctx.setDraft(e.target.value)}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (!e.defaultPrevented) fieldKeyDown(e);
				}}
				onBlur={(e) => {
					if (ctx.submitOnBlur) ctx.submit();
					onBlur?.(e);
				}}
			/>
		);
	},
);

Area.displayName = 'Editable.Area';

// ---------------------------------------------------------------------------
// Triggers
// ---------------------------------------------------------------------------

const EditTrigger = React.forwardRef<HTMLButtonElement, EditableEditTriggerProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const ctx = useEditableContext();
		if (ctx.isEditing) return null;
		return (
			<button
				ref={ref}
				type='button'
				disabled={ctx.disabled}
				className={className}
				{...rest}
				onClick={(e) => {
					ctx.startEdit();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

EditTrigger.displayName = 'Editable.EditTrigger';

const SubmitTrigger = React.forwardRef<HTMLButtonElement, EditableSubmitTriggerProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const ctx = useEditableContext();
		if (!ctx.isEditing) return null;
		return (
			<button
				ref={ref}
				type='button'
				className={className}
				{...rest}
				// Run before the field's blur-submit so both don't fire twice.
				onMouseDown={(e) => e.preventDefault()}
				onClick={(e) => {
					ctx.submit();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

SubmitTrigger.displayName = 'Editable.SubmitTrigger';

const CancelTrigger = React.forwardRef<HTMLButtonElement, EditableCancelTriggerProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const ctx = useEditableContext();
		if (!ctx.isEditing) return null;
		return (
			<button
				ref={ref}
				type='button'
				className={className}
				{...rest}
				onMouseDown={(e) => e.preventDefault()}
				onClick={(e) => {
					ctx.cancel();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

CancelTrigger.displayName = 'Editable.CancelTrigger';

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
