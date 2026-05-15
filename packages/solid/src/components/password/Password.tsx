import { createContext, createMemo, createSignal, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
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
	if (!ctx) throw new Error('Password sub-components must be used within Password.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: PasswordRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'onFocus',
		'onBlur',
		'isRequired',
		'errorMessage',
		'invalidType',
		'id',
		'class',
		'children',
	]);

	const [value, setValue] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? '',
		onChange: local.onChange,
	});

	const [visible, setVisible] = createSignal(false);
	const inputId = createMemo(() => local.id ?? createId('password'));

	const handleChange = (val: string) => {
		setValue(val);
	};

	const handleFocus = () => local.onFocus?.();
	const handleBlur = () => local.onBlur?.();

	const ctxValue: PasswordContextValue = {
		get inputId() {
			return inputId();
		},
		get value() {
			return value() ?? '';
		},
		get visible() {
			return visible();
		},
		get isRequired() {
			return !!local.isRequired;
		},
		get invalidType() {
			return local.invalidType ?? '';
		},
		get errorMessage() {
			return local.errorMessage ?? {};
		},
		setVisible,
		handleChange,
		handleFocus,
		handleBlur,
	};

	return (
		<PasswordContext.Provider value={ctxValue}>
			<div
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</PasswordContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

function Field(props: PasswordFieldProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = usePasswordContext();

	return (
		<input
			id={ctx.inputId}
			value={ctx.value}
			type={ctx.visible ? 'text' : 'password'}
			required={ctx.isRequired}
			class={local.class}
			aria-required={ctx.isRequired || undefined}
			aria-invalid={ctx.invalidType ? true : undefined}
			data-invalid={ctx.invalidType ? '' : undefined}
			data-visible={ctx.visible ? '' : undefined}
			onFocus={() => ctx.handleFocus()}
			onBlur={() => ctx.handleBlur()}
			onInput={(e) => ctx.handleChange(e.currentTarget.value)}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

function Toggle(props: PasswordToggleProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick']);
	const ctx = usePasswordContext();
	const state = createInteractiveState();
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.setVisible(!ctx.visible);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			aria-label={ctx.visible ? 'Hide password' : 'Show password'}
			class={local.class}
			data-visible={ctx.visible ? '' : undefined}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

function Label(props: PasswordLabelProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = usePasswordContext();

	return (
		<label
			for={ctx.inputId}
			class={local.class}
			{...rest}>
			<Show when={ctx.isRequired}>
				<span aria-hidden='true'>*</span>
			</Show>
			{local.children}
		</label>
	);
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

function ErrorMessage(props: PasswordErrorProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = usePasswordContext();

	return (
		<Show when={ctx.invalidType}>
			<small
				role='alert'
				class={local.class}
				{...rest}>
				{local.children ?? ctx.errorMessage[ctx.invalidType]}
			</small>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Password = { Root, Field, Toggle, Label, Error: ErrorMessage };
