import { createContext, createSignal, splitProps, useContext, type JSX } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type { SwitchContextValue, SwitchRootProps, SwitchThumbProps } from './Switch.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SwitchContext = createContext<SwitchContextValue>({ checked: false, disabled: false });

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: SwitchRootProps) {
	const [local, rest] = splitProps(props, [
		'checked',
		'defaultChecked',
		'onChange',
		'disabled',
		'class',
		'children',
		'onClick',
	]);

	const [uncontrolledChecked, setUncontrolledChecked] = createSignal(local.defaultChecked ?? false);
	const isControlled = () => local.checked !== undefined;
	const checked = () => (isControlled() ? !!local.checked : uncontrolledChecked());
	const disabled = () => !!local.disabled;

	const state = createInteractiveState({
		get disabled() {
			return disabled();
		},
	});

	const merged = mergeProps(rest, state.handlers);

	const toggle = () => {
		if (disabled()) return;
		const next = !checked();
		if (!isControlled()) setUncontrolledChecked(next);
		local.onChange?.(next);
	};

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		toggle();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const ctxValue: SwitchContextValue = {
		get checked() {
			return checked();
		},
		get disabled() {
			return disabled();
		},
	};

	return (
		<SwitchContext.Provider value={ctxValue}>
			<button
				type='button'
				role='switch'
				aria-checked={checked()}
				disabled={disabled()}
				class={local.class}
				data-checked={checked() ? '' : undefined}
				{...state.dataAttributes}
				{...merged}
				onClick={handleClick}>
				{local.children}
			</button>
		</SwitchContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Thumb
// ---------------------------------------------------------------------------

function Thumb(props: SwitchThumbProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useContext(SwitchContext);

	return (
		<span
			class={local.class}
			data-checked={ctx.checked ? '' : undefined}
			data-disabled={ctx.disabled ? '' : undefined}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Switch = { Root, Thumb };
