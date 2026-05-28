import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import type {
	StepperContentProps,
	StepperContextValue,
	StepperItemContextValue,
	StepperItemProps,
	StepperListProps,
	StepperNextTriggerProps,
	StepperPrevTriggerProps,
	StepperRootProps,
	StepperSeparatorProps,
	StepperTriggerProps,
} from './Stepper.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const StepperContext = createContext<StepperContextValue | null>(null);
const StepperItemContext = createContext<StepperItemContextValue | null>(null);

function useStepperContext() {
	const ctx = useContext(StepperContext);
	if (!ctx) throw new globalThis.Error('Stepper sub-components must be used within Stepper.Root');
	return ctx;
}

function useStepperItemContext() {
	const ctx = useContext(StepperItemContext);
	if (!ctx) throw new globalThis.Error('Stepper.Trigger must be used within Stepper.Item');
	return ctx;
}

function stepState(index: number, current: number): 'active' | 'completed' | 'inactive' {
	if (index === current) return 'active';
	if (index < current) return 'completed';
	return 'inactive';
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, StepperRootProps>(
	(
		{ count, value, defaultValue = 0, onChange, orientation = 'horizontal', linear = false, className, children, ...rest },
		ref,
	) => {
		const [current, setCurrent] = useControllableState<number>({
			value,
			defaultValue,
			onChange,
		});

		const goTo = useCallback(
			(index: number) => {
				const clamped = Math.min(Math.max(index, 0), count - 1);
				if (linear && clamped > current) return;
				setCurrent(clamped);
			},
			[count, linear, current, setCurrent],
		);

		const next = useCallback(() => setCurrent(Math.min(current + 1, count - 1)), [current, count, setCurrent]);
		const prev = useCallback(() => setCurrent(Math.max(current - 1, 0)), [current, setCurrent]);

		const ctx = useMemo<StepperContextValue>(
			() => ({
				current,
				count,
				orientation,
				linear,
				goTo,
				next,
				prev,
				isActive: (i) => i === current,
				isCompleted: (i) => i < current,
			}),
			[current, count, orientation, linear, goTo, next, prev],
		);

		return (
			<StepperContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-orientation={orientation}
					{...rest}>
					{children}
				</div>
			</StepperContext.Provider>
		);
	},
);

Root.displayName = 'Stepper.Root';

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

const List = React.forwardRef<HTMLDivElement, StepperListProps>(({ className, children, ...rest }, ref) => {
	const ctx = useStepperContext();
	return (
		<div
			ref={ref}
			role='list'
			aria-orientation={ctx.orientation}
			className={className}
			data-orientation={ctx.orientation}
			{...rest}>
			{children}
		</div>
	);
});

List.displayName = 'Stepper.List';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLDivElement, StepperItemProps>(({ index, className, children, ...rest }, ref) => {
	const ctx = useStepperContext();
	const state = stepState(index, ctx.current);

	return (
		<StepperItemContext.Provider value={{ index }}>
			<div
				ref={ref}
				role='listitem'
				className={className}
				data-state={state}
				data-index={index}
				{...rest}>
				{children}
			</div>
		</StepperItemContext.Provider>
	);
});

Item.displayName = 'Stepper.Item';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
	({ className, children, onClick, disabled, ...rest }, ref) => {
		const ctx = useStepperContext();
		const { index } = useStepperItemContext();
		const state = stepState(index, ctx.current);
		const isDisabled = disabled ?? (ctx.linear && index > ctx.current);

		return (
			<button
				ref={ref}
				type='button'
				disabled={isDisabled}
				aria-current={state === 'active' ? 'step' : undefined}
				className={className}
				data-state={state}
				{...rest}
				onClick={(e) => {
					ctx.goTo(index);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Trigger.displayName = 'Stepper.Trigger';

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(({ className, ...rest }, ref) => {
	const ctx = useStepperContext();
	const item = useContext(StepperItemContext);
	// When inside an Item, the separator is "complete" once that step is done.
	const completed = item ? item.index < ctx.current : undefined;
	return (
		<div
			ref={ref}
			role='separator'
			aria-hidden='true'
			className={className}
			data-orientation={ctx.orientation}
			data-state={completed === undefined ? undefined : completed ? 'completed' : 'inactive'}
			{...rest}
		/>
	);
});

Separator.displayName = 'Stepper.Separator';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, StepperContentProps>(
	({ index, forceMount = false, className, children, ...rest }, ref) => {
		const ctx = useStepperContext();
		const active = ctx.current === index;
		if (!forceMount && !active) return null;

		return (
			<div
				ref={ref}
				role='tabpanel'
				hidden={forceMount && !active ? true : undefined}
				className={className}
				data-state={active ? 'active' : 'inactive'}
				data-index={index}
				{...rest}>
				{children}
			</div>
		);
	},
);

Content.displayName = 'Stepper.Content';

// ---------------------------------------------------------------------------
// Prev / Next triggers
// ---------------------------------------------------------------------------

const PrevTrigger = React.forwardRef<HTMLButtonElement, StepperPrevTriggerProps>(
	({ className, children, onClick, disabled, ...rest }, ref) => {
		const ctx = useStepperContext();
		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled ?? ctx.current === 0}
				className={className}
				{...rest}
				onClick={(e) => {
					ctx.prev();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

PrevTrigger.displayName = 'Stepper.PrevTrigger';

const NextTrigger = React.forwardRef<HTMLButtonElement, StepperNextTriggerProps>(
	({ className, children, onClick, disabled, ...rest }, ref) => {
		const ctx = useStepperContext();
		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled ?? ctx.current >= ctx.count - 1}
				className={className}
				{...rest}
				onClick={(e) => {
					ctx.next();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

NextTrigger.displayName = 'Stepper.NextTrigger';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Stepper = {
	Root,
	List,
	Item,
	Trigger,
	Separator,
	Content,
	PrevTrigger,
	NextTrigger,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Stepper.*`).
export { Root, List, Item, Trigger, Separator, Content, PrevTrigger, NextTrigger };
