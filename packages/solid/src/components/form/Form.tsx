import {
	children as resolveChildren,
	createContext,
	createEffect,
	createSignal,
	createUniqueId,
	onCleanup,
	Show,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
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
	if (!ctx) throw new Error('Form field components must be used within Form.Field');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: FormRootProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<form
			class={local.class}
			noValidate
			{...rest}>
			{local.children}
		</form>
	);
}

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

function Field(props: FormFieldProps) {
	const [local, rest] = splitProps(props, ['name', 'invalid', 'required', 'disabled', 'children', 'class']);

	const uniq = createUniqueId();
	const id = () => (local.name ? `${local.name}-${uniq}` : uniq);
	const descriptionId = () => `${id()}-description`;
	const errorId = () => `${id()}-error`;

	const [hasDescription, setHasDescription] = createSignal(false);
	const [hasError, setHasError] = createSignal(false);

	const ctxValue: FormFieldContextValue = {
		get id() {
			return id();
		},
		get descriptionId() {
			return descriptionId();
		},
		get errorId() {
			return errorId();
		},
		get name() {
			return local.name;
		},
		get invalid() {
			return !!local.invalid;
		},
		get required() {
			return !!local.required;
		},
		get disabled() {
			return !!local.disabled;
		},
		get hasDescription() {
			return hasDescription();
		},
		get hasError() {
			return hasError();
		},
		registerDescription: setHasDescription,
		registerError: setHasError,
	};

	return (
		<FormFieldContext.Provider value={ctxValue}>
			<div
				class={local.class}
				data-invalid={local.invalid ? '' : undefined}
				data-required={local.required ? '' : undefined}
				data-disabled={local.disabled ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</FormFieldContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

function Label(props: FormLabelProps) {
	const [local, rest] = splitProps(props, ['asChild', 'class', 'children']);
	const ctx = useFieldContext();

	// asChild is read once at setup — toggling it post-mount isn't supported.
	// eslint-disable-next-line solid/reactivity
	if (local.asChild) {
		// Solid evaluates JSX children to DOM nodes, so we mutate the child's
		// attributes / class imperatively rather than cloning.
		const resolved = resolveChildren(() => local.children);

		createEffect(() => {
			const el = resolved() as HTMLElement | null;
			if (!(el instanceof HTMLElement)) return;
			el.setAttribute('for', ctx.id);
			if (local.class) {
				const existing = el.getAttribute('class') ?? '';
				el.setAttribute('class', [existing, local.class].filter(Boolean).join(' '));
			}
			for (const [key, value] of Object.entries(rest)) {
				if (value === undefined || value === null || typeof value === 'function') continue;
				el.setAttribute(key, String(value));
			}
		});

		// eslint-disable-next-line solid/components-return-once
		return resolved() as unknown as JSX.Element;
	}

	return (
		<label
			for={ctx.id}
			class={local.class}
			data-invalid={ctx.invalid ? '' : undefined}
			data-required={ctx.required ? '' : undefined}
			data-disabled={ctx.disabled ? '' : undefined}
			{...rest}>
			{local.children}
		</label>
	);
}

// ---------------------------------------------------------------------------
// Control — mutates the single child element to inject id/aria-* attributes
// ---------------------------------------------------------------------------

function Control(props: FormControlProps) {
	const ctx = useFieldContext();
	const resolved = resolveChildren(() => props.children);

	createEffect(() => {
		const el = resolved() as HTMLElement | null;
		if (!(el instanceof HTMLElement)) return;

		el.setAttribute('id', ctx.id);
		if (ctx.name && !el.hasAttribute('name')) el.setAttribute('name', ctx.name);

		// Merge aria-describedby with whatever the child already has.
		const existingDescribedBy = el.getAttribute('aria-describedby') ?? '';
		const parts = [
			ctx.hasDescription ? ctx.descriptionId : null,
			ctx.hasError ? ctx.errorId : null,
			existingDescribedBy || null,
		].filter(Boolean);
		if (parts.length > 0) {
			el.setAttribute('aria-describedby', parts.join(' '));
		} else {
			el.removeAttribute('aria-describedby');
		}

		const setOrRemoveAttr = (key: string, on: boolean, value: string) => {
			if (on) el.setAttribute(key, value);
			else el.removeAttribute(key);
		};

		setOrRemoveAttr('aria-invalid', ctx.invalid, 'true');
		setOrRemoveAttr('aria-required', ctx.required, 'true');
		setOrRemoveAttr('data-invalid', ctx.invalid, '');
		setOrRemoveAttr('data-required', ctx.required, '');
		setOrRemoveAttr('data-disabled', ctx.disabled, '');

		if (ctx.disabled) {
			(el as HTMLInputElement).disabled = true;
		}
	});

	return resolved() as unknown as JSX.Element;
}

// ---------------------------------------------------------------------------
// Description
// ---------------------------------------------------------------------------

function Description(props: FormDescriptionProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useFieldContext();

	ctx.registerDescription(true);
	onCleanup(() => ctx.registerDescription(false));

	return (
		<div
			id={ctx.descriptionId}
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

function ErrorMessage(props: FormErrorProps) {
	const [local, rest] = splitProps(props, ['forceMount', 'class', 'children']);
	const ctx = useFieldContext();
	const visible = () => !!local.forceMount || ctx.invalid;

	createEffect(() => {
		ctx.registerError(visible());
	});
	onCleanup(() => ctx.registerError(false));

	return (
		<Show when={visible()}>
			<div
				id={ctx.errorId}
				role='alert'
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Form = { Root, Field, Label, Control, Description, Error: ErrorMessage };
