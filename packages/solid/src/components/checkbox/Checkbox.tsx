'use client';

import { createContext, createMemo, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import type {
	CheckboxContextValue,
	CheckboxIndicatorProps,
	CheckboxItemContextValue,
	CheckboxItemProps,
	CheckboxLabelProps,
	CheckboxRootProps,
} from './Checkbox.types';

const CheckboxContext = createContext<CheckboxContextValue | null>(null);
const CheckboxItemContext = createContext<CheckboxItemContextValue | null>(null);

function useCheckboxContext() {
	const context = useContext(CheckboxContext);
	if (!context) {
		throw new Error('Checkbox compound components must be used within Checkbox.Root');
	}
	return context;
}

function useCheckboxItemContext() {
	const context = useContext(CheckboxItemContext);
	if (!context) {
		throw new Error('Checkbox.Indicator/Label must be used within Checkbox.Item');
	}
	return context;
}

function Root(props: CheckboxRootProps) {
	const [local, rest] = splitProps(props, ['value', 'defaultValue', 'onChange', 'name', 'children', 'class']);

	const [values, setValues] = createControllableState<(string | number)[]>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? [],
		get onChange() {
			return local.onChange;
		},
	});

	const groupName = createMemo(() => local.name || createId('checkbox-group'));

	const isChecked = (itemValue: string | number) => values().some((v) => String(v) === String(itemValue));

	const toggle = (itemValue: string | number) => {
		const currentValues = [...values()];
		const index = currentValues.findIndex((v) => String(v) === String(itemValue));

		if (index === -1) {
			currentValues.push(itemValue);
		} else {
			currentValues.splice(index, 1);
		}

		setValues(currentValues);
	};

	const ctxValue: CheckboxContextValue = {
		get values() {
			return values();
		},
		get name() {
			return groupName();
		},
		toggle,
		isChecked,
	};

	return (
		<CheckboxContext.Provider value={ctxValue}>
			<div
				role='group'
				class={local.class}
				{...(rest as object)}>
				{local.children}
			</div>
		</CheckboxContext.Provider>
	);
}

function Item(props: CheckboxItemProps) {
	const [local, rest] = splitProps(props, ['value', 'disabled', 'children', 'class', 'onClick']);
	const ctx = useCheckboxContext();

	const checked = () => ctx.isChecked(local.value);
	const disabled = () => !!local.disabled;
	const inputId = createId('checkbox');

	const state = createInteractiveState({
		get disabled() {
			return disabled();
		},
	});

	const itemCtxValue: CheckboxItemContextValue = {
		get value() {
			return local.value;
		},
		get disabled() {
			return disabled();
		},
		get checked() {
			return checked();
		},
		inputId,
	};

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!disabled()) ctx.toggle(local.value);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<CheckboxItemContext.Provider value={itemCtxValue}>
			<div
				class={local.class}
				data-checked={checked() ? '' : undefined}
				{...state.dataAttributes}
				onMouseEnter={state.handlers.onMouseEnter}
				onMouseLeave={state.handlers.onMouseLeave}
				onPointerDown={state.handlers.onPointerDown}
				onPointerUp={state.handlers.onPointerUp}
				onClick={handleClick}
				{...(rest as object)}>
				<input
					id={inputId}
					type='checkbox'
					name={ctx.name}
					value={String(local.value)}
					checked={checked()}
					disabled={disabled()}
					onChange={() => ctx.toggle(local.value)}
					onFocus={state.handlers.onFocus}
					onBlur={state.handlers.onBlur}
					onKeyDown={state.handlers.onKeyDown}
					onKeyUp={state.handlers.onKeyUp}
					style={{
						position: 'absolute',
						opacity: 0,
						'pointer-events': 'none',
						width: 0,
						height: 0,
					}}
				/>
				{local.children}
			</div>
		</CheckboxItemContext.Provider>
	);
}

function Indicator(props: CheckboxIndicatorProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useCheckboxItemContext();

	return (
		<Show when={ctx.checked}>
			<span
				class={local.class}
				data-checked=''
				{...(rest as object)}>
				{local.children}
			</span>
		</Show>
	);
}

function Label(props: CheckboxLabelProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useCheckboxItemContext();

	return (
		<label
			for={ctx.inputId}
			class={local.class}
			data-disabled={ctx.disabled ? '' : undefined}
			{...(rest as object)}>
			{local.children}
		</label>
	);
}

export const Checkbox = {
	Root,
	Item,
	Indicator,
	Label,
};

// Named exports expose the sub-components to Storybook's docgen (public API stays `Checkbox.*`).
export { Root, Item, Indicator, Label };