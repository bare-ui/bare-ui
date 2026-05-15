import { createContext, createMemo, createSignal, Show, splitProps, useContext } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
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
		throw new Error('Textarea compound components must be used within Textarea.Root');
	}
	return context;
}

function Root(props: TextareaRootProps) {
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

	const textareaId = createMemo(() => local.id || createId('textarea'));

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

	const contextValue: TextareaContextValue = {
		get value() {
			return value() ?? '';
		},
		get textareaId() {
			return textareaId();
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
		<TextareaContext.Provider value={contextValue}>
			<div
				class={local.class}
				{...(rest as object)}>
				{local.children}
			</div>
		</TextareaContext.Provider>
	);
}

function Field(props: TextareaFieldProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useTextareaContext();

	return (
		<textarea
			id={ctx.textareaId}
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

function Label(props: TextareaLabelProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useTextareaContext();

	return (
		<label
			for={ctx.textareaId}
			class={local.class}
			{...(rest as object)}>
			<Show when={ctx.isRequired}>
				<span>*</span>
			</Show>
			{local.children}
		</label>
	);
}

function ErrorMessage(props: TextareaErrorProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useTextareaContext();

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

export const Textarea = {
	Root,
	Field,
	Label,
	Error: ErrorMessage,
};
