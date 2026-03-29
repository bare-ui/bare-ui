import React, { createContext, useCallback, useContext, useState } from 'react';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	AccordionContextValue,
	AccordionContentProps,
	AccordionItemContextValue,
	AccordionItemProps,
	AccordionRootProps,
	AccordionTriggerProps,
} from './Accordion.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
	const ctx = useContext(AccordionContext);
	if (!ctx) throw new globalThis.Error('Accordion sub-components must be used within Accordion.Root');
	return ctx;
}

function useAccordionItemContext() {
	const ctx = useContext(AccordionItemContext);
	if (!ctx) throw new globalThis.Error('Accordion.Trigger/Content must be used within Accordion.Item');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, AccordionRootProps>(
	({ disabled = false, className, children, ...rest }, ref) => {
		// ── Single ──────────────────────────────────────────────────────────────
		if (rest.type === 'single') {
			const {
				type: _type,
				value: controlledValue,
				defaultValue,
				onChange,
				collapsible = false,
				...divRest
			} = rest;

			// eslint-disable-next-line react-hooks/rules-of-hooks
			const [uncontrolledValue, setUncontrolledValue] = useState<string>(defaultValue ?? '');
			const isControlled = controlledValue !== undefined;
			const openValue = isControlled ? controlledValue : uncontrolledValue;

			// eslint-disable-next-line react-hooks/rules-of-hooks
			const isOpen = useCallback((v: string) => openValue === v, [openValue]);

			// eslint-disable-next-line react-hooks/rules-of-hooks
			const toggle = useCallback(
				(v: string) => {
					const next =
						openValue === v ?
							collapsible ? ''
							:	openValue
						:	v;
					if (!isControlled) setUncontrolledValue(next);
					onChange?.(next);
				},
				[openValue, collapsible, isControlled, onChange],
			);

			return (
				<AccordionContext.Provider value={{ isOpen, toggle, disabled }}>
					<div
						ref={ref}
						className={className}
						{...divRest}>
						{children}
					</div>
				</AccordionContext.Provider>
			);
		}

		// ── Multiple ─────────────────────────────────────────────────────────────
		const { type: _type, value: controlledValue, defaultValue, onChange, ...divRest } = rest;

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [uncontrolledValues, setUncontrolledValues] = useState<string[]>(defaultValue ?? []);
		const isControlled = controlledValue !== undefined;
		const openValues = isControlled ? controlledValue : uncontrolledValues;

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const isOpen = useCallback((v: string) => openValues.includes(v), [openValues]);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const toggle = useCallback(
			(v: string) => {
				const next = openValues.includes(v) ? openValues.filter((x) => x !== v) : [...openValues, v];
				if (!isControlled) setUncontrolledValues(next);
				onChange?.(next);
			},
			[openValues, isControlled, onChange],
		);

		return (
			<AccordionContext.Provider value={{ isOpen, toggle, disabled }}>
				<div
					ref={ref}
					className={className}
					{...divRest}>
					{children}
				</div>
			</AccordionContext.Provider>
		);
	},
);

Root.displayName = 'Accordion.Root';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLDivElement, AccordionItemProps>(
	({ value, disabled = false, className, children, ...rest }, ref) => {
		const ctx = useAccordionContext();
		const isDisabled = disabled || ctx.disabled;
		const isOpen = ctx.isOpen(value);

		return (
			<AccordionItemContext.Provider value={{ value, isOpen, disabled: isDisabled }}>
				<div
					ref={ref}
					className={className}
					data-state={isOpen ? 'open' : 'closed'}
					data-disabled={isDisabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</AccordionItemContext.Provider>
		);
	},
);

Item.displayName = 'Accordion.Item';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const { isOpen, disabled, value } = useAccordionItemContext();
		const { toggle } = useAccordionContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });

		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				aria-expanded={isOpen}
				data-state={isOpen ? 'open' : 'closed'}
				data-disabled={disabled ? '' : undefined}
				className={className}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					toggle(value);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Trigger.displayName = 'Accordion.Trigger';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, AccordionContentProps>(
	({ forceMount = false, children, className, ...rest }, ref) => {
		const { isOpen } = useAccordionItemContext();

		if (!forceMount && !isOpen) return null;

		return (
			<div
				ref={ref}
				role='region'
				hidden={forceMount && !isOpen ? true : undefined}
				className={className}
				data-state={isOpen ? 'open' : 'closed'}
				{...rest}>
				{children}
			</div>
		);
	},
);

Content.displayName = 'Accordion.Content';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Accordion = {
	Root,
	Item,
	Trigger,
	Content,
};
