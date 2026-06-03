'use client';

import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useId } from '@/hooks/use-id';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	ComboboxContentProps,
	ComboboxContextValue,
	ComboboxEmptyProps,
	ComboboxInputProps,
	ComboboxItemRenderProps,
	ComboboxItemsProps,
	ComboboxOption,
	ComboboxRootProps,
	ComboboxTriggerProps,
} from './Combobox.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function defaultFilter(option: ComboboxOption, input: string) {
	return option.label.toLowerCase().includes(input.trim().toLowerCase());
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext() {
	const ctx = useContext(ComboboxContext);
	if (!ctx) throw new globalThis.Error('Combobox compound components must be used within Combobox.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ComboboxRootProps>(
	(
		{
			options,
			value: controlledValue,
			defaultValue = null,
			onChange,
			inputValue: controlledInputValue,
			defaultInputValue,
			onInputChange,
			filter = defaultFilter,
			disabled = false,
			open: controlledOpen,
			defaultOpen = false,
			onOpenChange,
			children,
			className,
			...rest
		},
		ref,
	) => {
		// --- selected (onChange has a 2-arg signature, so kept manual) ---
		const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue);
		const isValueControlled = controlledValue !== undefined;
		const selected = isValueControlled ? (controlledValue as string | null) : uncontrolledValue;

		// --- input text ---
		const initialInput =
			defaultInputValue ?? (selected ? options.find((o) => o.value === selected)?.label ?? '' : '');
		const [inputValue, setInputValueState] = useControllableState<string>({
			value: controlledInputValue,
			defaultValue: initialInput,
			onChange: onInputChange,
		});

		// --- open ---
		const [open, setOpenState] = useControllableState({
			value: controlledOpen,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		});

		const isInputControlled = controlledInputValue !== undefined;

		const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);
		const setInputValue = useCallback((text: string) => setInputValueState(text), [setInputValueState]);

		// --- filtered options ---
		const filtered = useMemo(() => {
			if (!inputValue) return options;
			return options.filter((o) => filter(o, inputValue));
		}, [options, inputValue, filter]);

		// --- highlight ---
		const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

		// Reset highlight when listbox opens/filters change. Intentionally syncs
		// state to props — moveHighlight reads the functional-setter `curr`, so a
		// derived-during-render version would break arrow-key navigation.
		useEffect(() => {
			if (!open) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setHighlightedIndex(-1);
				return;
			}
			if (highlightedIndex >= filtered.length) {
				setHighlightedIndex(filtered.length === 0 ? -1 : 0);
			} else if (highlightedIndex === -1 && filtered.length > 0) {
				// Highlight selected if present, otherwise first
				const selectedIdx = filtered.findIndex((o) => o.value === selected);
				setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
			}
		}, [open, filtered, highlightedIndex, selected]);

		const moveHighlight = useCallback(
			(delta: number) => {
				if (filtered.length === 0) return;
				setHighlightedIndex((curr) => {
					let i = curr;
					const len = filtered.length;
					for (let attempt = 0; attempt < len; attempt++) {
						i = (i + delta + len) % len;
						if (!filtered[i].disabled) return i;
					}
					return curr;
				});
			},
			[filtered],
		);

		const commitOption = useCallback(
			(option: ComboboxOption) => {
				if (option.disabled) return;
				if (!isValueControlled) setUncontrolledValue(option.value);
				setInputValueState(option.label);
				onChange?.(option.value, option);
				setOpen(false);
			},
			[isValueControlled, setInputValueState, onChange, setOpen],
		);

		const internalRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(internalRef, ref);

		useClickOutside(internalRef, () => {
			if (open) setOpen(false);
		});

		// Sync input text with selected option label when selection changes externally and input not focused.
		const inputFocusedRef = useRef(false);
		useEffect(() => {
			if (isInputControlled || inputFocusedRef.current) return;
			const opt = options.find((o) => o.value === selected) ?? null;
			setInputValueState(opt ? opt.label : '');
		}, [selected, options, isInputControlled, setInputValueState]);

		const baseId = useId('combobox');
		const listboxId = `${baseId}-listbox`;
		const getOptionId = useCallback((v: string) => `${baseId}-opt-${v}`, [baseId]);

		const ctx = useMemo<ComboboxContextValue>(
			() => ({
				options,
				filtered,
				selected,
				inputValue,
				open,
				highlightedIndex,
				disabled,
				listboxId,
				getOptionId,
				setOpen,
				setInputValue,
				commitOption,
				setHighlightedIndex,
				moveHighlight,
			}),
			[
				options,
				filtered,
				selected,
				inputValue,
				open,
				highlightedIndex,
				disabled,
				listboxId,
				getOptionId,
				setOpen,
				setInputValue,
				commitOption,
				moveHighlight,
			],
		);

		return (
			<ComboboxContext.Provider value={ctx}>
				<div
					ref={mergedRef}
					className={className}
					data-state={open ? 'open' : 'closed'}
					data-disabled={disabled ? '' : undefined}
					{...rest}
					onFocusCapture={(e) => {
						const target = e.target as HTMLElement | null;
						if (target?.tagName === 'INPUT') inputFocusedRef.current = true;
					}}
					onBlurCapture={(e) => {
						const target = e.target as HTMLElement | null;
						if (target?.tagName === 'INPUT') inputFocusedRef.current = false;
					}}>
					{children}
				</div>
			</ComboboxContext.Provider>
		);
	},
);
Root.displayName = 'Combobox.Root';

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
	({ className, onKeyDown, onFocus, ...rest }, ref) => {
		const ctx = useComboboxContext();
		const activeId =
			ctx.highlightedIndex >= 0 && ctx.filtered[ctx.highlightedIndex]
				? ctx.getOptionId(ctx.filtered[ctx.highlightedIndex].value)
				: undefined;

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(e);
			if (e.defaultPrevented || ctx.disabled) return;

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (!ctx.open) ctx.setOpen(true);
				else ctx.moveHighlight(1);
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (!ctx.open) ctx.setOpen(true);
				else ctx.moveHighlight(-1);
			} else if (e.key === 'Home' && ctx.open) {
				e.preventDefault();
				if (ctx.filtered.length > 0) ctx.setHighlightedIndex(0);
			} else if (e.key === 'End' && ctx.open) {
				e.preventDefault();
				if (ctx.filtered.length > 0) ctx.setHighlightedIndex(ctx.filtered.length - 1);
			} else if (e.key === 'Enter' && ctx.open) {
				if (ctx.highlightedIndex >= 0 && ctx.filtered[ctx.highlightedIndex]) {
					e.preventDefault();
					ctx.commitOption(ctx.filtered[ctx.highlightedIndex]);
				}
			} else if (e.key === 'Escape' && ctx.open) {
				e.preventDefault();
				ctx.setOpen(false);
			}
		};

		return (
			<input
				ref={ref}
				type='text'
				role='combobox'
				autoComplete='off'
				aria-autocomplete='list'
				aria-expanded={ctx.open}
				aria-controls={ctx.listboxId}
				aria-activedescendant={activeId}
				disabled={ctx.disabled}
				value={ctx.inputValue}
				className={className}
				{...rest}
				onChange={(e) => {
					ctx.setInputValue(e.currentTarget.value);
					if (!ctx.open) ctx.setOpen(true);
				}}
				onFocus={(e) => {
					if (!ctx.open) ctx.setOpen(true);
					onFocus?.(e);
				}}
				onKeyDown={handleKeyDown}
			/>
		);
	},
);
Input.displayName = 'Combobox.Input';

// ---------------------------------------------------------------------------
// Trigger (chevron / clear)
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const ctx = useComboboxContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled: ctx.disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				tabIndex={-1}
				disabled={ctx.disabled}
				aria-label='Toggle options'
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
Trigger.displayName = 'Combobox.Trigger';

// ---------------------------------------------------------------------------
// Content (listbox)
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, ComboboxContentProps>(
	({ children, className, ...rest }, ref) => {
		const ctx = useComboboxContext();
		if (!ctx.open) return null;

		return (
			<div
				ref={ref}
				id={ctx.listboxId}
				role='listbox'
				className={className}
				data-state='open'
				{...rest}>
				{children}
			</div>
		);
	},
);
Content.displayName = 'Combobox.Content';

// ---------------------------------------------------------------------------
// Items render-prop
// ---------------------------------------------------------------------------

const Items: React.FC<ComboboxItemsProps> = ({ children }) => {
	const ctx = useComboboxContext();
	const { open, highlightedIndex, filtered, getOptionId } = ctx;

	// Keep the highlighted option visible inside its scroll container.
	useLayoutEffect(() => {
		if (!open || highlightedIndex < 0) return;
		const opt = filtered[highlightedIndex];
		if (!opt) return;
		const el = typeof document !== 'undefined' ? document.getElementById(getOptionId(opt.value)) : null;
		if (!el) return;

		// Find nearest scrollable ancestor (so the page never gets scrolled).
		let container: HTMLElement | null = el.parentElement;
		while (container) {
			const overflowY = getComputedStyle(container).overflowY;
			if (
				(overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
				container.scrollHeight > container.clientHeight
			) {
				break;
			}
			container = container.parentElement;
		}
		if (!container) return;

		const elRect = el.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const relativeTop = elRect.top - containerRect.top + container.scrollTop;
		const relativeBottom = relativeTop + el.offsetHeight;
		const viewTop = container.scrollTop;
		const viewBottom = viewTop + container.clientHeight;

		if (relativeTop < viewTop) {
			container.scrollTop = relativeTop;
		} else if (relativeBottom > viewBottom) {
			container.scrollTop = relativeBottom - container.clientHeight;
		}
	}, [open, highlightedIndex, filtered, getOptionId]);

	return (
		<>
			{ctx.filtered.map((option, index) => {
				const renderProps: ComboboxItemRenderProps = {
					option,
					highlighted: index === ctx.highlightedIndex,
					selected: option.value === ctx.selected,
				};
				return (
					<div
						key={option.value}
						id={ctx.getOptionId(option.value)}
						role='option'
						className='group'
						aria-selected={renderProps.selected}
						aria-disabled={option.disabled || undefined}
						data-highlighted={renderProps.highlighted ? '' : undefined}
						data-selected={renderProps.selected ? '' : undefined}
						data-disabled={option.disabled ? '' : undefined}
						onMouseEnter={() => ctx.setHighlightedIndex(index)}
						onClick={() => ctx.commitOption(option)}>
						{children(renderProps)}
					</div>
				);
			})}
		</>
	);
};
Items.displayName = 'Combobox.Items';

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

const Empty = React.forwardRef<HTMLDivElement, ComboboxEmptyProps>(({ children, className, ...rest }, ref) => {
	const ctx = useComboboxContext();
	if (ctx.filtered.length > 0) return null;
	return (
		<div
			ref={ref}
			role='presentation'
			className={className}
			{...rest}>
			{children}
		</div>
	);
});
Empty.displayName = 'Combobox.Empty';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Combobox = { Root, Input, Trigger, Content, Items, Empty };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Combobox.*`).
export { Root, Input, Trigger, Content, Items, Empty };
