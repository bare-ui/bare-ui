import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { Helper } from '@/utils/helper';
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
		const inputId = useMemo(() => id || Helper.generateUUID(), [id]);

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
