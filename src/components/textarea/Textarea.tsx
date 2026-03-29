import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Helper } from '@/utils/helper';
import type {
	TextareaContextValue,
	TextareaErrorProps,
	TextareaFieldProps,
	TextareaLabelProps,
	TextareaRootProps,
} from './Textarea.types';

const TextareaContext = createContext<TextareaContextValue | null>(null);

function useTextareaContext() {
	const context = useContext(TextareaContext);
	if (!context) {
		throw new globalThis.Error('Textarea compound components must be used within Textarea.Root');
	}
	return context;
}

const Root = React.forwardRef<HTMLDivElement, TextareaRootProps>(
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
		const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
		const isControlled = controlledValue !== undefined;
		const value = isControlled ? controlledValue : uncontrolledValue;
		const [isActive, setIsActive] = useState(false);
		const textareaId = useMemo(() => id || Helper.generateUUID(), [id]);

		const handleChange = useCallback(
			(newValue: string) => {
				if (!isControlled) setUncontrolledValue(newValue);
				onChange?.(newValue);
			},
			[isControlled, onChange],
		);

		const handleFocus = useCallback(() => {
			setIsActive(true);
			onFocus?.();
		}, [onFocus]);

		const handleBlur = useCallback(() => {
			setIsActive(false);
			onBlur?.();
		}, [onBlur]);

		const contextValue: TextareaContextValue = {
			value,
			textareaId,
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
			<TextareaContext.Provider value={contextValue}>
				<div
					ref={ref}
					className={className}
					{...rest}>
					{children}
				</div>
			</TextareaContext.Provider>
		);
	},
);

Root.displayName = 'Textarea.Root';

const Field = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(({ className, ...rest }, ref) => {
	const ctx = useTextareaContext();

	return (
		<textarea
			ref={ref}
			id={ctx.textareaId}
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

Field.displayName = 'Textarea.Field';

const Label = React.forwardRef<HTMLLabelElement, TextareaLabelProps>(({ children, className, ...rest }, ref) => {
	const ctx = useTextareaContext();

	return (
		<label
			ref={ref}
			htmlFor={ctx.textareaId}
			className={className}
			{...rest}>
			{ctx.isRequired && <span>*</span>}
			{children}
		</label>
	);
});

Label.displayName = 'Textarea.Label';

const Error = React.forwardRef<HTMLElement, TextareaErrorProps>(({ children, className, ...rest }, ref) => {
	const ctx = useTextareaContext();

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

Error.displayName = 'Textarea.Error';

export const Textarea = {
	Root,
	Field,
	Label,
	Error,
};
