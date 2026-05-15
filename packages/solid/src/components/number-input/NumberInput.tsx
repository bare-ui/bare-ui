import { createContext, createEffect, createSignal, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	NumberInputContextValue,
	NumberInputDecrementProps,
	NumberInputFieldProps,
	NumberInputIncrementProps,
	NumberInputRootProps,
} from './NumberInput.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max);
}

function decimalsOf(step: number) {
	const s = step.toString();
	const dot = s.indexOf('.');
	return dot === -1 ? 0 : s.length - dot - 1;
}

function round(value: number, decimals: number) {
	const factor = Math.pow(10, decimals);
	return Math.round(value * factor) / factor;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const NumberInputContext = createContext<NumberInputContextValue | null>(null);

function useNumberInputContext() {
	const ctx = useContext(NumberInputContext);
	if (!ctx) throw new Error('NumberInput compound components must be used within NumberInput.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: NumberInputRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'min',
		'max',
		'step',
		'precision',
		'disabled',
		'readOnly',
		'children',
		'class',
	]);

	const [value, setValueState] = createControllableState<number | null>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? null,
		onChange: local.onChange,
	});

	const min = () => local.min ?? Number.NEGATIVE_INFINITY;
	const max = () => local.max ?? Number.POSITIVE_INFINITY;
	const step = () => local.step ?? 1;
	const precision = () => local.precision ?? decimalsOf(step());

	const setValue = (next: number | null) => {
		const normalized = next === null || Number.isNaN(next) ? null : round(clamp(next, min(), max()), precision());
		setValueState(normalized);
	};

	const stepBy = (delta: number) => {
		if (local.disabled || local.readOnly) return;
		const base = value() ?? 0;
		setValue(base + delta);
	};

	const increment = () => stepBy(step());
	const decrement = () => stepBy(-step());

	const ctxValue: NumberInputContextValue = {
		get value() {
			return value();
		},
		get min() {
			return min();
		},
		get max() {
			return max();
		},
		get step() {
			return step();
		},
		get precision() {
			return precision();
		},
		get disabled() {
			return !!local.disabled;
		},
		get readOnly() {
			return !!local.readOnly;
		},
		setValue,
		increment,
		decrement,
		stepBy,
	};

	return (
		<NumberInputContext.Provider value={ctxValue}>
			<div
				class={local.class}
				data-disabled={local.disabled ? '' : undefined}
				data-readonly={local.readOnly ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</NumberInputContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

function Field(props: NumberInputFieldProps) {
	const [local, rest] = splitProps(props, ['class', 'onKeyDown', 'onBlur']);
	const ctx = useNumberInputContext();
	const [text, setText] = createSignal<string>(ctx.value === null ? '' : String(ctx.value));

	// Sync visible text whenever the committed value changes externally.
	createEffect(() => {
		setText(ctx.value === null ? '' : String(ctx.value));
	});

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
		if (e.defaultPrevented || ctx.disabled || ctx.readOnly) return;
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			ctx.stepBy(ctx.step);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			ctx.stepBy(-ctx.step);
		} else if (e.key === 'PageUp') {
			e.preventDefault();
			ctx.stepBy(ctx.step * 10);
		} else if (e.key === 'PageDown') {
			e.preventDefault();
			ctx.stepBy(-ctx.step * 10);
		} else if (e.key === 'Home' && Number.isFinite(ctx.min)) {
			e.preventDefault();
			ctx.setValue(ctx.min);
		} else if (e.key === 'End' && Number.isFinite(ctx.max)) {
			e.preventDefault();
			ctx.setValue(ctx.max);
		}
	};

	const commitText = (raw: string) => {
		const trimmed = raw.trim();
		if (trimmed === '' || trimmed === '-' || trimmed === '.') {
			ctx.setValue(null);
			setText('');
			return;
		}
		const parsed = Number(trimmed);
		if (Number.isNaN(parsed)) {
			// Revert to last good value
			setText(ctx.value === null ? '' : String(ctx.value));
			return;
		}
		ctx.setValue(parsed);
	};

	const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
		commitText(text());
		const userOnBlur = local.onBlur;
		if (typeof userOnBlur === 'function') {
			(userOnBlur as (event: typeof e) => void)(e);
		}
	};

	return (
		<input
			type='text'
			inputMode='decimal'
			role='spinbutton'
			aria-valuenow={ctx.value ?? undefined}
			aria-valuemin={Number.isFinite(ctx.min) ? ctx.min : undefined}
			aria-valuemax={Number.isFinite(ctx.max) ? ctx.max : undefined}
			disabled={ctx.disabled}
			readOnly={ctx.readOnly}
			value={text()}
			class={local.class}
			{...rest}
			onInput={(e) => setText(e.currentTarget.value)}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
		/>
	);
}

// ---------------------------------------------------------------------------
// Increment / Decrement
// ---------------------------------------------------------------------------

function makeStepButton(direction: 1 | -1) {
	return function StepButton(props: NumberInputIncrementProps | NumberInputDecrementProps) {
		const [local, rest] = splitProps(props, ['class', 'children', 'onClick']);
		const ctx = useNumberInputContext();
		const state = createInteractiveState({
			get disabled() {
				return ctx.disabled || ctx.readOnly;
			},
		});
		const merged = mergeProps(rest, state.handlers);

		const atBoundary = () =>
			ctx.value !== null &&
			((direction === 1 && ctx.value >= ctx.max) || (direction === -1 && ctx.value <= ctx.min));

		const isDisabled = () => ctx.disabled || ctx.readOnly || atBoundary();

		const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
			if (direction === 1) ctx.increment();
			else ctx.decrement();
			const userOnClick = local.onClick;
			if (typeof userOnClick === 'function') {
				(userOnClick as (event: typeof e) => void)(e);
			}
		};

		return (
			<button
				type='button'
				tabIndex={-1}
				disabled={isDisabled()}
				aria-label={direction === 1 ? 'Increment' : 'Decrement'}
				class={local.class}
				{...state.dataAttributes}
				{...merged}
				onClick={handleClick}>
				{local.children}
			</button>
		);
	};
}

const Increment = makeStepButton(1);
const Decrement = makeStepButton(-1);

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const NumberInput = { Root, Field, Increment, Decrement };
