import { createContext, createMemo, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import type {
	RadioContextValue,
	RadioIndicatorProps,
	RadioItemContextValue,
	RadioItemProps,
	RadioLabelProps,
	RadioRootProps,
} from './Radio.types';

const RadioContext = createContext<RadioContextValue | null>(null);
const RadioItemContext = createContext<RadioItemContextValue | null>(null);

function useRadioContext() {
	const context = useContext(RadioContext);
	if (!context) {
		throw new Error('Radio compound components must be used within Radio.Root');
	}
	return context;
}

function useRadioItemContext() {
	const context = useContext(RadioItemContext);
	if (!context) {
		throw new Error('Radio.Indicator/Label must be used within Radio.Item');
	}
	return context;
}

function Root(props: RadioRootProps) {
	const [local, rest] = splitProps(props, ['value', 'defaultValue', 'onChange', 'name', 'children', 'class']);

	const [selectedValue, setSelectedValue] = createControllableState<string | number | undefined>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue,
		get onChange() {
			return local.onChange as ((v: string | number | undefined) => void) | undefined;
		},
	});

	const groupName = createMemo(() => local.name || createId('radio-group'));

	const isSelected = (itemValue: string | number) => {
		const sv = selectedValue();
		if (sv === undefined || sv === null) return false;
		return String(sv) === String(itemValue);
	};

	const select = (itemValue: string | number) => {
		setSelectedValue(itemValue);
	};

	const ctxValue: RadioContextValue = {
		get selectedValue() {
			return selectedValue();
		},
		get name() {
			return groupName();
		},
		select,
		isSelected,
	};

	return (
		<RadioContext.Provider value={ctxValue}>
			<div
				role='radiogroup'
				class={local.class}
				{...(rest as object)}>
				{local.children}
			</div>
		</RadioContext.Provider>
	);
}

function Item(props: RadioItemProps) {
	const [local, rest] = splitProps(props, ['value', 'disabled', 'children', 'class', 'onClick', 'id']);
	const ctx = useRadioContext();

	const checked = () => ctx.isSelected(local.value);
	const disabled = () => !!local.disabled;
	const generatedId = createId('radio');
	const inputId = () => local.id || generatedId;

	const state = createInteractiveState({
		get disabled() {
			return disabled();
		},
	});

	const itemCtxValue: RadioItemContextValue = {
		get value() {
			return local.value;
		},
		get disabled() {
			return disabled();
		},
		get checked() {
			return checked();
		},
		get inputId() {
			return inputId();
		},
	};

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!disabled()) ctx.select(local.value);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<RadioItemContext.Provider value={itemCtxValue}>
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
					id={inputId()}
					type='radio'
					name={ctx.name}
					value={String(local.value)}
					checked={checked()}
					disabled={disabled()}
					onChange={() => ctx.select(local.value)}
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
		</RadioItemContext.Provider>
	);
}

function Indicator(props: RadioIndicatorProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useRadioItemContext();

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

function Label(props: RadioLabelProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'for']);
	const ctx = useRadioItemContext();

	return (
		<label
			for={local.for ?? ctx.inputId}
			class={local.class}
			data-disabled={ctx.disabled ? '' : undefined}
			{...(rest as object)}>
			{local.children}
		</label>
	);
}

export const Radio = {
	Root,
	Item,
	Indicator,
	Label,
};

export { Root, Item, Indicator, Label };
