import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useId } from '@/hooks/use-id';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	TabsContentProps,
	TabsContextValue,
	TabsListProps,
	TabsRootProps,
	TabsTriggerProps,
} from './Tabs.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new globalThis.Error('Tabs compound components must be used within Tabs.Root');
	}
	return context;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, TabsRootProps>(
	(
		{
			value: controlledValue,
			defaultValue,
			onChange,
			orientation = 'horizontal',
			activationMode = 'automatic',
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [value, setValueState] = useControllableState<string>({
			value: controlledValue,
			defaultValue: defaultValue ?? '',
			onChange,
		});

		const triggersRef = useRef<Map<string, HTMLButtonElement | null>>(new Map());
		const orderRef = useRef<string[]>([]);
		const baseId = useId('tabs');

		const setValue = useCallback((next: string) => setValueState(next), [setValueState]);

		const registerTrigger = useCallback((triggerValue: string, el: HTMLButtonElement | null) => {
			if (el) {
				triggersRef.current.set(triggerValue, el);
				if (!orderRef.current.includes(triggerValue)) orderRef.current.push(triggerValue);
			} else {
				triggersRef.current.delete(triggerValue);
				orderRef.current = orderRef.current.filter((v) => v !== triggerValue);
			}
		}, []);

		const getTriggerOrder = useCallback(() => orderRef.current.slice(), []);

		const ctx = useMemo<TabsContextValue>(
			() => ({ value, setValue, orientation, activationMode, registerTrigger, getTriggerOrder, baseId }),
			[value, setValue, orientation, activationMode, registerTrigger, getTriggerOrder, baseId],
		);

		return (
			<TabsContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-orientation={orientation}
					{...rest}>
					{children}
				</div>
			</TabsContext.Provider>
		);
	},
);
Root.displayName = 'Tabs.Root';

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

const List = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, children, ...rest }, ref) => {
	const { orientation } = useTabsContext();

	return (
		<div
			ref={ref}
			role='tablist'
			aria-orientation={orientation}
			data-orientation={orientation}
			className={className}
			{...rest}>
			{children}
		</div>
	);
});
List.displayName = 'Tabs.List';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
	({ value, disabled = false, className, children, onClick, onKeyDown, onFocus, ...rest }, ref) => {
		const ctx = useTabsContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);
		const localRef = useRef<HTMLButtonElement | null>(null);

		const setRef = (el: HTMLButtonElement | null) => {
			localRef.current = el;
			ctx.registerTrigger(value, el);
			if (typeof ref === 'function') ref(el);
			else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
		};

		const isSelected = ctx.value === value;

		const focusByOffset = (offset: number) => {
			const order = ctx.getTriggerOrder();
			if (order.length === 0) return;
			const currentIndex = order.indexOf(value);
			let nextIndex = (currentIndex + offset + order.length) % order.length;
			// Skip disabled triggers
			let safety = order.length;
			while (safety-- > 0) {
				const candidate = order[nextIndex];
				const el = document.getElementById(`${ctx.baseId}-trigger-${candidate}`);
				if (el && !(el as HTMLButtonElement).disabled) {
					(el as HTMLButtonElement).focus();
					if (ctx.activationMode === 'automatic') ctx.setValue(candidate);
					return;
				}
				nextIndex = (nextIndex + offset + order.length) % order.length;
			}
		};

		const focusEdge = (edge: 'start' | 'end') => {
			const order = ctx.getTriggerOrder();
			const ordered = edge === 'start' ? order : order.slice().reverse();
			for (const candidate of ordered) {
				const el = document.getElementById(`${ctx.baseId}-trigger-${candidate}`);
				if (el && !(el as HTMLButtonElement).disabled) {
					(el as HTMLButtonElement).focus();
					if (ctx.activationMode === 'automatic') ctx.setValue(candidate);
					return;
				}
			}
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
			onKeyDown?.(e);
			if (e.defaultPrevented) return;

			const horizontal = ctx.orientation === 'horizontal';
			const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
			const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

			if (e.key === nextKey) {
				e.preventDefault();
				focusByOffset(1);
			} else if (e.key === prevKey) {
				e.preventDefault();
				focusByOffset(-1);
			} else if (e.key === 'Home') {
				e.preventDefault();
				focusEdge('start');
			} else if (e.key === 'End') {
				e.preventDefault();
				focusEdge('end');
			} else if (ctx.activationMode === 'manual' && (e.key === 'Enter' || e.key === ' ')) {
				e.preventDefault();
				ctx.setValue(value);
			}
		};

		const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
			onFocus?.(e);
			if (ctx.activationMode === 'automatic' && !disabled) ctx.setValue(value);
		};

		return (
			<button
				ref={setRef}
				id={`${ctx.baseId}-trigger-${value}`}
				type='button'
				role='tab'
				aria-selected={isSelected}
				aria-controls={`${ctx.baseId}-content-${value}`}
				tabIndex={isSelected ? 0 : -1}
				disabled={disabled}
				className={className}
				data-state={isSelected ? 'active' : 'inactive'}
				data-disabled={disabled ? '' : undefined}
				data-orientation={ctx.orientation}
				{...dataAttributes}
				{...merged}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onClick={(e) => {
					if (!disabled) ctx.setValue(value);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);
Trigger.displayName = 'Tabs.Trigger';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, TabsContentProps>(
	({ value, forceMount = false, className, children, ...rest }, ref) => {
		const ctx = useTabsContext();
		const isActive = ctx.value === value;

		if (!isActive && !forceMount) return null;

		return (
			<div
				ref={ref}
				id={`${ctx.baseId}-content-${value}`}
				role='tabpanel'
				aria-labelledby={`${ctx.baseId}-trigger-${value}`}
				tabIndex={0}
				hidden={!isActive && forceMount ? true : undefined}
				className={className}
				data-state={isActive ? 'active' : 'inactive'}
				data-orientation={ctx.orientation}
				{...rest}>
				{children}
			</div>
		);
	},
);
Content.displayName = 'Tabs.Content';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Tabs = { Root, List, Trigger, Content };
