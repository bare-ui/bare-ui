import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { Helper } from '@/utils/helper';
import { mergeProps } from '@/utils/merge-props';
import type {
	PasswordContextValue,
	PasswordErrorProps,
	PasswordFieldProps,
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

const Root = React.forwardRef<HTMLDivElement, PasswordRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onChange,
			onFocus,
			onBlur,
			isRequired = false,
			errorMessage = {},
			invalidType = '',
			id,
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

		const [visible, setVisible] = useState(false);
		const fieldRef = useRef<HTMLInputElement | null>(null);
		const inputId = useMemo(() => id ?? Helper.generateUUID(), [id]);

		const handleChange = useCallback((val: string) => setValue(val), [setValue]);

		const handleFocus = useCallback(() => onFocus?.(), [onFocus]);

		const handleBlur = useCallback(() => onBlur?.(), [onBlur]);

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
					fieldRef,
				}}>
				<div
					ref={ref}
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
	const mergedRef = useMergedRefs<HTMLInputElement>(ctx.fieldRef, externalRef);

	return (
		<input
			ref={mergedRef}
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

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Password.*`).
export { Root, Field, Toggle, Label, Error };
