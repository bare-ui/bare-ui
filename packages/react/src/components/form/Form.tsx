import React, { createContext, useContext, useId, useMemo, useState } from 'react';
import type {
	FormControlProps,
	FormDescriptionProps,
	FormErrorProps,
	FormFieldContextValue,
	FormFieldProps,
	FormLabelProps,
	FormRootProps,
} from './Form.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function useFieldContext() {
	const ctx = useContext(FormFieldContext);
	if (!ctx) throw new globalThis.Error('Form field components must be used within Form.Field');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLFormElement, FormRootProps>(({ children, className, ...rest }, ref) => (
	<form
		ref={ref}
		className={className}
		noValidate
		{...rest}>
		{children}
	</form>
));
Root.displayName = 'Form.Root';

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

const Field = React.forwardRef<HTMLDivElement, FormFieldProps>(
	({ name, invalid = false, required = false, disabled = false, children, className, ...rest }, ref) => {
		const reactId = useId();
		const id = name ? `${name}-${reactId}` : reactId;
		const descriptionId = `${id}-description`;
		const errorId = `${id}-error`;

		const [hasDescription, setHasDescription] = useState(false);
		const [hasError, setHasError] = useState(false);

		const ctx = useMemo<FormFieldContextValue>(
			() => ({
				id,
				descriptionId,
				errorId,
				name,
				invalid,
				required,
				disabled,
				hasDescription,
				hasError,
				registerDescription: setHasDescription,
				registerError: setHasError,
			}),
			[id, descriptionId, errorId, name, invalid, required, disabled, hasDescription, hasError],
		);

		return (
			<FormFieldContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-invalid={invalid ? '' : undefined}
					data-required={required ? '' : undefined}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</FormFieldContext.Provider>
		);
	},
);
Field.displayName = 'Form.Field';

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

const Label = React.forwardRef<HTMLLabelElement, FormLabelProps>(
	({ asChild = false, className, children, ...rest }, ref) => {
		const ctx = useFieldContext();
		if (asChild && React.isValidElement(children)) {
			const child = children as React.ReactElement<Record<string, unknown>>;
			return React.cloneElement(child, {
				...rest,
				htmlFor: ctx.id,
				className: [(child.props as { className?: string }).className, className].filter(Boolean).join(' '),
				ref,
			} as Record<string, unknown>);
		}
		return (
			<label
				ref={ref}
				htmlFor={ctx.id}
				className={className}
				data-invalid={ctx.invalid ? '' : undefined}
				data-required={ctx.required ? '' : undefined}
				data-disabled={ctx.disabled ? '' : undefined}
				{...rest}>
				{children}
			</label>
		);
	},
);
Label.displayName = 'Form.Label';

// ---------------------------------------------------------------------------
// Control — clones the single child input and injects id/aria-* attributes
// ---------------------------------------------------------------------------

const Control: React.FC<FormControlProps> = ({ children }) => {
	const ctx = useFieldContext();
	if (!React.isValidElement(children)) {
		throw new globalThis.Error('Form.Control requires exactly one React element child.');
	}

	const child = children as React.ReactElement<Record<string, unknown>>;
	const childProps = child.props as Record<string, unknown>;

	const describedBy = [
		ctx.hasDescription ? ctx.descriptionId : null,
		ctx.hasError ? ctx.errorId : null,
		childProps['aria-describedby'] as string | undefined,
	]
		.filter(Boolean)
		.join(' ') || undefined;

	return React.cloneElement(child, {
		id: ctx.id,
		name: ctx.name ?? (childProps.name as string | undefined),
		'aria-invalid': ctx.invalid || undefined,
		'aria-required': ctx.required || undefined,
		'aria-describedby': describedBy,
		disabled: ctx.disabled || (childProps.disabled as boolean | undefined),
		'data-invalid': ctx.invalid ? '' : undefined,
		'data-required': ctx.required ? '' : undefined,
		'data-disabled': ctx.disabled ? '' : undefined,
	} as Record<string, unknown>);
};
Control.displayName = 'Form.Control';

// ---------------------------------------------------------------------------
// Description
// ---------------------------------------------------------------------------

const Description = React.forwardRef<HTMLDivElement, FormDescriptionProps>(
	({ className, children, ...rest }, ref) => {
		const ctx = useFieldContext();
		React.useEffect(() => {
			ctx.registerDescription(true);
			return () => ctx.registerDescription(false);
		}, [ctx]);

		return (
			<div
				ref={ref}
				id={ctx.descriptionId}
				className={className}
				{...rest}>
				{children}
			</div>
		);
	},
);
Description.displayName = 'Form.Description';

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

const Error = React.forwardRef<HTMLDivElement, FormErrorProps>(
	({ forceMount = false, className, children, ...rest }, ref) => {
		const ctx = useFieldContext();
		const visible = forceMount || ctx.invalid;

		React.useEffect(() => {
			ctx.registerError(visible);
			return () => ctx.registerError(false);
		}, [ctx, visible]);

		if (!visible) return null;

		return (
			<div
				ref={ref}
				id={ctx.errorId}
				role='alert'
				className={className}
				{...rest}>
				{children}
			</div>
		);
	},
);
Error.displayName = 'Form.Error';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Form = { Root, Field, Label, Control, Description, Error };
