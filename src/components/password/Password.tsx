import React, { createContext, useCallback, useContext, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Helper } from '@/utils/helper';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	PasswordContextValue,
	PasswordErrorProps,
	PasswordFieldProps,
	PasswordHandle,
	PasswordLabelProps,
	PasswordRootProps,
	PasswordToggleProps,
} from './Password.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const PasswordContext = createContext<PasswordContextValue | null>(null);

function usePasswordContext() {
	const ctx = useContext(PasswordContext);
	if (!ctx) throw new globalThis.Error('Password sub-components must be used within Password.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<PasswordHandle, PasswordRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onChange,
			onFocus,
			onBlur,
			onErrorChange,
			isRequired = false,
			errorMessage = {},
			invalidType: controlledInvalidType,
			id,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
		const isControlled = controlledValue !== undefined;
		const value = isControlled ? controlledValue : uncontrolledValue;

		const [visible, setVisible] = useState(false);
		const [internalInvalidType, setInternalInvalidType] = useState('');
		const invalidType = controlledInvalidType !== undefined ? controlledInvalidType : internalInvalidType;

		const fieldRef = useRef<HTMLInputElement>(null);
		const inputId = useMemo(() => id ?? Helper.generateUUID(), [id]);

		const setError = useCallback((hasError: boolean) => onErrorChange?.(hasError), [onErrorChange]);

		const handleIsEmpty = useCallback((): boolean => {
			const empty = Helper.isEmpty(fieldRef.current?.value ?? '');
			if (empty) {
				setError(true);
				if (controlledInvalidType === undefined) setInternalInvalidType('required');
			} else {
				setError(false);
				if (controlledInvalidType === undefined) setInternalInvalidType('');
			}
			return empty;
		}, [setError, controlledInvalidType]);

		const handleChange = useCallback(
			(val: string) => {
				if (!isControlled) setUncontrolledValue(val);
				onChange?.(val);
			},
			[isControlled, onChange],
		);

		const handleFocus = useCallback(() => onFocus?.(), [onFocus]);

		const handleBlur = useCallback(() => {
			if (isRequired) handleIsEmpty();
			onBlur?.();
		}, [isRequired, handleIsEmpty, onBlur]);

		const validate = useCallback(() => handleBlur(), [handleBlur]);

		useImperativeHandle(ref, () => ({ validate }), [validate]);

		return (
			<PasswordContext.Provider
				value={{
					inputId,
					value,
					visible,
					isRequired,
					invalidType,
					errorMessage,
					setVisible,
					handleChange,
					handleFocus,
					handleBlur,
					setFieldNode: (node) => {
						(fieldRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
					},
				}}>
				<div
					className={className}
					{...rest}>
					{children}
				</div>
			</PasswordContext.Provider>
		);
	},
);

Root.displayName = 'Password.Root';

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

const Field = React.forwardRef<HTMLInputElement, PasswordFieldProps>(({ className, ...rest }, externalRef) => {
	const ctx = usePasswordContext();

	return (
		<input
			ref={(el) => {
				ctx.setFieldNode(el);
				if (typeof externalRef === 'function') externalRef(el);
				else if (externalRef) externalRef.current = el;
			}}
			id={ctx.inputId}
			value={ctx.value}
			type={ctx.visible ? 'text' : 'password'}
			required={ctx.isRequired}
			className={className}
			aria-required={ctx.isRequired || undefined}
			aria-invalid={ctx.invalidType ? true : undefined}
			data-invalid={ctx.invalidType ? '' : undefined}
			data-visible={ctx.visible ? '' : undefined}
			onFocus={ctx.handleFocus}
			onBlur={ctx.handleBlur}
			onChange={(e) => ctx.handleChange(e.target.value)}
			{...rest}
		/>
	);
});

Field.displayName = 'Password.Field';

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

const Toggle = React.forwardRef<HTMLButtonElement, PasswordToggleProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const ctx = usePasswordContext();
		const { handlers, dataAttributes } = useInteractiveState();
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				aria-label={ctx.visible ? 'Hide password' : 'Show password'}
				className={className}
				data-visible={ctx.visible ? '' : undefined}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					ctx.setVisible(!ctx.visible);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Toggle.displayName = 'Password.Toggle';

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

const Label = React.forwardRef<HTMLLabelElement, PasswordLabelProps>(({ children, className, ...rest }, ref) => {
	const { inputId, isRequired } = usePasswordContext();

	return (
		<label
			ref={ref}
			htmlFor={inputId}
			className={className}
			{...rest}>
			{isRequired && <span aria-hidden='true'>*</span>}
			{children}
		</label>
	);
});

Label.displayName = 'Password.Label';

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

const Error = React.forwardRef<HTMLElement, PasswordErrorProps>(({ children, className, ...rest }, ref) => {
	const { invalidType, errorMessage } = usePasswordContext();

	if (!invalidType) return null;

	return (
		<small
			ref={ref}
			role='alert'
			className={className}
			{...rest}>
			{children ?? errorMessage[invalidType]}
		</small>
	);
});

Error.displayName = 'Password.Error';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Password = { Root, Field, Toggle, Label, Error };
