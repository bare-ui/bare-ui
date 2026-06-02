import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useId } from '@/hooks/use-id';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import { Calendar } from '../calendar/Calendar';
import type { CalendarRootProps } from '../calendar/Calendar.types';
import type {
	DatePickerContentProps,
	DatePickerContextValue,
	DatePickerRootProps,
	DatePickerTriggerProps,
	DatePickerValueProps,
} from './DatePicker.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DatePickerContext = createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
	const ctx = useContext(DatePickerContext);
	if (!ctx) throw new globalThis.Error('DatePicker compound components must be used within DatePicker.Root');
	return ctx;
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, DatePickerRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = null,
			onChange,
			open: controlledOpen,
			defaultOpen = false,
			onOpenChange,
			disabled = false,
			closeOnSelect = true,
			locale = 'en-US',
			formatOptions = DEFAULT_FORMAT,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [value, setValueState] = useControllableState<Date | null>({
			value: controlledValue,
			defaultValue,
			onChange,
		});

		const [open, setOpenState] = useControllableState({
			value: controlledOpen,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		});

		const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);
		const setValue = useCallback((next: Date | null) => setValueState(next), [setValueState]);

		const internalRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(internalRef, ref);

		useClickOutside(internalRef, () => {
			if (open) setOpen(false);
		});

		useKeyboard(
			{
				Escape: () => {
					if (open) setOpen(false);
				},
			},
			{ event: 'keyup' },
		);

		const triggerId = useId('date-picker-trigger');
		const contentId = useId('date-picker-content');

		const ctx = useMemo<DatePickerContextValue>(
			() => ({
				value: value ?? null,
				open,
				disabled,
				closeOnSelect,
				locale,
				formatOptions,
				setOpen,
				setValue,
				triggerId,
				contentId,
			}),
			[value, open, disabled, closeOnSelect, locale, formatOptions, setOpen, setValue, triggerId, contentId],
		);

		return (
			<DatePickerContext.Provider value={ctx}>
				<div
					ref={mergedRef}
					className={className}
					data-state={open ? 'open' : 'closed'}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</DatePickerContext.Provider>
		);
	},
);
Root.displayName = 'DatePicker.Root';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const ctx = useDatePickerContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled: ctx.disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				id={ctx.triggerId}
				type='button'
				disabled={ctx.disabled}
				aria-haspopup='dialog'
				aria-expanded={ctx.open}
				aria-controls={ctx.contentId}
				className={className}
				data-state={ctx.open ? 'open' : 'closed'}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					ctx.setOpen(!ctx.open);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);
Trigger.displayName = 'DatePicker.Trigger';

// ---------------------------------------------------------------------------
// Value (formatted display of the selected date)
// ---------------------------------------------------------------------------

const Value = React.forwardRef<HTMLSpanElement, DatePickerValueProps>(
	({ placeholder, children, className, ...rest }, ref) => {
		const ctx = useDatePickerContext();
		const formatted = useMemo(() => {
			if (!ctx.value) return '';
			return new Intl.DateTimeFormat(ctx.locale, ctx.formatOptions).format(ctx.value);
		}, [ctx.value, ctx.locale, ctx.formatOptions]);

		const content = children
			? children(ctx.value, formatted)
			: ctx.value
				? formatted
				: placeholder;

		return (
			<span
				ref={ref}
				className={className}
				data-placeholder={!ctx.value ? '' : undefined}
				{...rest}>
				{content}
			</span>
		);
	},
);
Value.displayName = 'DatePicker.Value';

// ---------------------------------------------------------------------------
// Content (popover with the calendar)
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, DatePickerContentProps>(
	({ children, className, ...rest }, ref) => {
		const ctx = useDatePickerContext();
		const contentRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(contentRef, ref);

		// Prefer landing focus on the calendar's active day (the roving-tabindex
		// cell) rather than the first nav button, per the date-picker dialog pattern.
		const initialFocusRef = useRef<HTMLElement | null>(null);
		useIsomorphicLayoutEffect(() => {
			if (!ctx.open) return;
			initialFocusRef.current =
				contentRef.current?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]') ?? null;
		}, [ctx.open]);

		// Trap focus inside the popover while open and restore it to the trigger on
		// close (Escape, outside click, or selection).
		useFocusTrap(contentRef, { active: ctx.open, initialFocus: initialFocusRef });

		if (!ctx.open) return null;

		return (
			<div
				ref={mergedRef}
				id={ctx.contentId}
				role='dialog'
				aria-labelledby={ctx.triggerId}
				className={className}
				data-state='open'
				{...rest}>
				{children}
			</div>
		);
	},
);
Content.displayName = 'DatePicker.Content';

// ---------------------------------------------------------------------------
// CalendarBridge — pre-wires Calendar.Root to the DatePicker context.
// Children render Calendar subcomponents (Nav, PrevButton, etc).
// ---------------------------------------------------------------------------

interface DatePickerCalendarProps extends Omit<CalendarRootProps, 'value' | 'onChange'> {
	children?: React.ReactNode;
}

const CalendarBridge: React.FC<DatePickerCalendarProps> = ({ children, ...rest }) => {
	const ctx = useDatePickerContext();
	return (
		<Calendar.Root
			{...rest}
			value={ctx.value}
			onChange={(next) => {
				ctx.setValue(next);
				if (ctx.closeOnSelect && next) ctx.setOpen(false);
			}}>
			{children}
		</Calendar.Root>
	);
};
CalendarBridge.displayName = 'DatePicker.Calendar';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const DatePicker = { Root, Trigger, Value, Content, Calendar: CalendarBridge };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `DatePicker.*`).
export { Root, Trigger, Value, Content, CalendarBridge };
