import { createContext, createMemo, createSignal, Show, splitProps, useContext } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
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
		throw new Error('Input compound components must be used within Input.Root');
	}
	return context;
}

function Root(props: InputRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'onFocus',
		'onBlur',
		'invalidType',
		'errorMessage',
		'isRequired',
		'isSuccess',
		'id',
		'children',
		'class',
	]);

	const [value, setValue] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? '',
		onChange: local.onChange,
	});
	const [isActive, setIsActive] = createSignal(false);

	const inputId = createMemo(() => local.id || createId('input'));

	const handleChange = (newValue: string) => {
		setValue(newValue);
	};

	const handleFocus = () => {
		setIsActive(true);
		local.onFocus?.();
	};

	const handleBlur = () => {
		setIsActive(false);
		local.onBlur?.();
	};

	const contextValue: InputContextValue = {
		get value() {
			return value() ?? '';
		},
		get inputId() {
			return inputId();
		},
		get isActive() {
			return isActive();
		},
		get invalidType() {
			return local.invalidType ?? '';
		},
		get isSuccess() {
			return !!local.isSuccess;
		},
		get isRequired() {
			return !!local.isRequired;
		},
		get errorMessage() {
			return local.errorMessage ?? {};
		},
		handleChange,
		handleFocus,
		handleBlur,
	};

	return (
		<InputContext.Provider value={contextValue}>
			<div
				class={local.class}
				{...(rest as object)}>
				{local.children}
			</div>
		</InputContext.Provider>
	);
}

function Field(props: InputFieldProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useInputContext();

	return (
		<input
			id={ctx.inputId}
			value={ctx.value}
			required={ctx.isRequired}
			class={local.class}
			aria-required={ctx.isRequired || undefined}
			aria-invalid={ctx.invalidType ? true : undefined}
			data-invalid={ctx.invalidType ? '' : undefined}
			data-active={ctx.isActive ? '' : undefined}
			data-success={ctx.isSuccess ? '' : undefined}
			onFocus={() => ctx.handleFocus()}
			onBlur={() => ctx.handleBlur()}
			onInput={(e) => ctx.handleChange(e.currentTarget.value)}
			{...rest}
		/>
	);
}

function Label(props: InputLabelProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useInputContext();

	return (
		<label
			for={ctx.inputId}
			class={local.class}
			{...(rest as object)}>
			<Show when={ctx.isRequired}>
				<span>*</span>
			</Show>
			{local.children}
		</label>
	);
}

function ErrorMessage(props: InputErrorProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useInputContext();

	return (
		<Show when={ctx.invalidType}>
			<small
				role='alert'
				class={local.class}
				{...(rest as object)}>
				{local.children ?? ctx.errorMessage[ctx.invalidType]}
			</small>
		</Show>
	);
}

export const Input = {
	Root,
	Field,
	Label,
	Error: ErrorMessage,
};
