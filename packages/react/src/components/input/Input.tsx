'use client';

import React, { createContext, useCallback, useContext, useId, useMemo, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import type {
	InputContextValue,
	InputErrorProps,
	InputFieldProps,
	InputLabelProps,
	InputRootProps,
} from './Input.types';

const InputContext = createContext<InputContextValue | null>(null);

function useInputContext() {
	const context = useContext(InputContext);
	if (!context) {
		throw new globalThis.Error('Input compound components must be used within Input.Root');
	}
	return context;
}

const Root = React.forwardRef<HTMLDivElement, InputRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onChange,
			onFocus,
			onBlur,
			invalidType = '',
			errorMessage = {},
			isRequired = false,
			isSuccess = false,
			id,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [value, setValue] = useControllableState<string>({
			value: controlledValue,
			defaultValue,
			onChange,
		});
		const [isActive, setIsActive] = useState(false);
		// SSR-stable: useId() returns identical IDs on server and client, so the
		// rendered id/htmlFor/aria-describedby match during hydration.
		const generatedId = useId();
		const inputId = id || generatedId;
		const errorId = useMemo(() => `${inputId}-error`, [inputId]);

		const handleChange = useCallback((newValue: string) => setValue(newValue), [setValue]);

		const handleFocus = useCallback(() => {
			setIsActive(true);
			onFocus?.();
		}, [onFocus]);

		const handleBlur = useCallback(() => {
			setIsActive(false);
			onBlur?.();
		}, [onBlur]);

		const contextValue: InputContextValue = {
			value,
			inputId,
			errorId,
			isActive,
			invalidType,
			isSuccess,
			isRequired,
			errorMessage,
			handleChange,
			handleFocus,
			handleBlur,
		};

		return (
			<InputContext.Provider value={contextValue}>
				<div
					ref={ref}
					className={className}
					{...rest}>
					{children}
				</div>
			</InputContext.Provider>
		);
	},
);

Root.displayName = 'Input.Root';

const Field = React.forwardRef<HTMLInputElement, InputFieldProps>(({ className, ...rest }, ref) => {
	const ctx = useInputContext();

	return (
		<input
			ref={ref}
			id={ctx.inputId}
			value={ctx.value}
			required={ctx.isRequired}
			className={className}
			aria-required={ctx.isRequired || undefined}
			aria-invalid={ctx.invalidType ? true : undefined}
			aria-describedby={ctx.invalidType ? ctx.errorId : undefined}
			data-invalid={ctx.invalidType ? '' : undefined}
			data-active={ctx.isActive ? '' : undefined}
			data-success={ctx.isSuccess ? '' : undefined}
			onFocus={ctx.handleFocus}
			onBlur={ctx.handleBlur}
			onChange={(e) => ctx.handleChange(e.target.value)}
			{...rest}
		/>
	);
});

Field.displayName = 'Input.Field';

const Label = React.forwardRef<HTMLLabelElement, InputLabelProps>(({ children, className, ...rest }, ref) => {
	const ctx = useInputContext();

	return (
		<label
			ref={ref}
			htmlFor={ctx.inputId}
			className={className}
			{...rest}>
			{ctx.isRequired && <span>*</span>}
			{children}
		</label>
	);
});

Label.displayName = 'Input.Label';

const Error = React.forwardRef<HTMLElement, InputErrorProps>(({ children, className, ...rest }, ref) => {
	const ctx = useInputContext();

	if (!ctx.invalidType) return null;

	const message = children ?? ctx.errorMessage[ctx.invalidType];

	return (
		<small
			ref={ref}
			id={ctx.errorId}
			role='alert'
			className={className}
			{...rest}>
			{message}
		</small>
	);
});

Error.displayName = 'Input.Error';

export const Input = {
	Root,
	Field,
	Label,
	Error,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Input.*`).
export { Root, Field, Label, Error };
