import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
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
	if (!ctx) throw new globalThis.Error('NumberInput compound components must be used within NumberInput.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, NumberInputRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = null,
			onChange,
			min = Number.NEGATIVE_INFINITY,
			max = Number.POSITIVE_INFINITY,
			step = 1,
			precision: precisionProp,
			disabled = false,
			readOnly = false,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [value, setValueState] = useControllableState<number | null>({
			value: controlledValue,
			defaultValue,
			onChange,
		});
		const precision = precisionProp ?? decimalsOf(step);

		const setValue = useCallback(
			(next: number | null) => {
				const normalized = next === null || Number.isNaN(next) ? null : round(clamp(next, min, max), precision);
				setValueState(normalized);
			},
			[setValueState, min, max, precision],
		);

		const stepBy = useCallback(
			(delta: number) => {
				if (disabled || readOnly) return;
				const base = value ?? 0;
				setValue(base + delta);
			},
			[value, setValue, disabled, readOnly],
		);

		const increment = useCallback(() => stepBy(step), [stepBy, step]);
		const decrement = useCallback(() => stepBy(-step), [stepBy, step]);

		const ctx = useMemo<NumberInputContextValue>(
			() => ({ value, min, max, step, precision, disabled, readOnly, setValue, increment, decrement, stepBy }),
			[value, min, max, step, precision, disabled, readOnly, setValue, increment, decrement, stepBy],
		);

		return (
			<NumberInputContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-disabled={disabled ? '' : undefined}
					data-readonly={readOnly ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</NumberInputContext.Provider>
		);
	},
);
Root.displayName = 'NumberInput.Root';

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

const Field = React.forwardRef<HTMLInputElement, NumberInputFieldProps>(
	({ className, onKeyDown, onBlur, ...rest }, ref) => {
		const ctx = useNumberInputContext();
		const [text, setText] = useState<string>(() => (ctx.value === null ? '' : String(ctx.value)));

		// Sync visible text whenever the committed value changes, adjusting state
		// during render rather than in an effect. (Typing alone doesn't change
		// ctx.value — the field commits on blur — so this won't stomp on in-progress
		// user input.) See https://react.dev/reference/react/useState#storing-information-from-previous-renders
		const [prevValue, setPrevValue] = useState(ctx.value);
		if (ctx.value !== prevValue) {
			setPrevValue(ctx.value);
			setText(ctx.value === null ? '' : String(ctx.value));
		}

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(e);
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

		return (
			<input
				ref={ref}
				type='text'
				inputMode='decimal'
				role='spinbutton'
				aria-valuenow={ctx.value ?? undefined}
				aria-valuemin={Number.isFinite(ctx.min) ? ctx.min : undefined}
				aria-valuemax={Number.isFinite(ctx.max) ? ctx.max : undefined}
				disabled={ctx.disabled}
				readOnly={ctx.readOnly}
				value={text}
				className={className}
				{...rest}
				onChange={(e) => setText(e.currentTarget.value)}
				onBlur={(e) => {
					commitText(text);
					onBlur?.(e);
				}}
				onKeyDown={handleKeyDown}
			/>
		);
	},
);
Field.displayName = 'NumberInput.Field';

// ---------------------------------------------------------------------------
// Increment / Decrement
// ---------------------------------------------------------------------------

function makeStepButton(direction: 1 | -1, displayName: string) {
	const Component = React.forwardRef<HTMLButtonElement, NumberInputIncrementProps>(
		({ className, children, onClick, ...rest }, ref) => {
			const ctx = useNumberInputContext();
			const { handlers, dataAttributes } = useInteractiveState({ disabled: ctx.disabled || ctx.readOnly });
			const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

			const atBoundary =
				ctx.value !== null &&
				((direction === 1 && ctx.value >= ctx.max) || (direction === -1 && ctx.value <= ctx.min));

			const isDisabled = ctx.disabled || ctx.readOnly || atBoundary;

			return (
				<button
					ref={ref}
					type='button'
					tabIndex={-1}
					disabled={isDisabled}
					aria-label={direction === 1 ? 'Increment' : 'Decrement'}
					className={className}
					{...dataAttributes}
					{...merged}
					onClick={(e) => {
						if (direction === 1) ctx.increment();
						else ctx.decrement();
						onClick?.(e);
					}}>
					{children}
				</button>
			);
		},
	);
	Component.displayName = displayName;
	return Component;
}

const Increment = makeStepButton(1, 'NumberInput.Increment') as React.ForwardRefExoticComponent<
	NumberInputIncrementProps & React.RefAttributes<HTMLButtonElement>
>;

const Decrement = makeStepButton(-1, 'NumberInput.Decrement') as React.ForwardRefExoticComponent<
	NumberInputDecrementProps & React.RefAttributes<HTMLButtonElement>
>;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const NumberInput = { Root, Field, Increment, Decrement };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `NumberInput.*`).
export { Root, Field, Increment, Decrement };
