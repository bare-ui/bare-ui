import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useId } from '@/hooks/use-id';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';

interface RegisteredItem {
	value: string;
	label: string;
	disabled: boolean;
}

const TYPEAHEAD_RESET_MS = 800;
import type {
	SelectContentProps,
	SelectContextValue,
	SelectGroupLabelProps,
	SelectGroupProps,
	SelectItemProps,
	SelectRootProps,
	SelectSeparatorProps,
	SelectTriggerProps,
	SelectValueProps,
} from './Select.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
	const ctx = useContext(SelectContext);
	if (!ctx) throw new globalThis.Error('Select sub-components must be used within Select.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, SelectRootProps>(
	(
		{ value: controlledValue, defaultValue = '', onChange, disabled = false, className, children, ...rest },
		externalRef,
	) => {
		const [selectedValue, setSelectedState] = useControllableState({
			value: controlledValue,
			defaultValue,
			onChange,
		});

		const [open, setOpen] = useState(false);
		const [labelMap, setLabelMap] = useState<Record<string, string>>({});
		const [persistedLabel, setPersistedLabel] = useState('');
		// Ordered registry of currently mounted options — drives arrow navigation,
		// typeahead, and aria-activedescendant. Cleared as Content unmounts.
		const [items, setItems] = useState<RegisteredItem[]>([]);
		const [activeValue, setActiveValue] = useState<string | null>(null);
		const typeaheadRef = useRef<{ buffer: string; time: number }>({ buffer: '', time: 0 });

		const internalRef = useRef<HTMLDivElement>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(internalRef, externalRef);
		useClickOutside(internalRef, () => setOpen(false));

		const baseId = useId('select');
		const listboxId = `${baseId}-listbox`;
		const getOptionId = useCallback((value: string) => `${baseId}-opt-${value}`, [baseId]);

		const select = useCallback(
			(value: string, label: string) => {
				setSelectedState(value);
				setPersistedLabel(label);
				setOpen(false);
			},
			[setSelectedState],
		);

		const registerItem = useCallback((value: string, label: string, itemDisabled: boolean) => {
			// Persistent label map so Select.Value can render the chosen label even
			// while Content (and the ordered registry) is unmounted.
			setLabelMap((prev) => (prev[value] === label ? prev : { ...prev, [value]: label }));
			setItems((prev) => {
				const idx = prev.findIndex((i) => i.value === value);
				if (idx === -1) return [...prev, { value, label, disabled: itemDisabled }];
				const existing = prev[idx];
				if (existing.label === label && existing.disabled === itemDisabled) return prev;
				const copy = prev.slice();
				copy[idx] = { value, label, disabled: itemDisabled };
				return copy;
			});
		}, []);

		// Items persist in the registry after Content unmounts (like the label map)
		// so closed-state typeahead and instant re-open keep working. A genuinely
		// removed option is re-registered with fresh data on next mount.
		const unregisterItem = useCallback((_value: string) => {}, []);

		const moveActive = useCallback(
			(delta: number) => {
				const enabled = items.filter((i) => !i.disabled);
				if (enabled.length === 0) return;
				setActiveValue((curr) => {
					const idx = enabled.findIndex((i) => i.value === curr);
					let next = idx < 0 ? (delta > 0 ? 0 : enabled.length - 1) : idx + delta;
					if (next < 0) next = enabled.length - 1;
					if (next >= enabled.length) next = 0;
					return enabled[next].value;
				});
			},
			[items],
		);

		const setActiveEdge = useCallback(
			(edge: 'first' | 'last') => {
				const enabled = items.filter((i) => !i.disabled);
				if (enabled.length === 0) return;
				setActiveValue(edge === 'first' ? enabled[0].value : enabled[enabled.length - 1].value);
			},
			[items],
		);

		const selectActive = useCallback(() => {
			const item = items.find((i) => i.value === activeValue && !i.disabled);
			if (item) select(item.value, item.label);
		}, [items, activeValue, select]);

		// Select-only typeahead: typing letters jumps to (and, when closed, selects)
		// the next option whose label starts with the buffered string.
		const typeahead = useCallback(
			(char: string) => {
				const now = Date.now();
				const prev = typeaheadRef.current;
				const buffer = now - prev.time > TYPEAHEAD_RESET_MS ? char : prev.buffer + char;
				typeaheadRef.current = { buffer, time: now };

				const enabled = items.filter((i) => !i.disabled);
				if (enabled.length === 0) return;
				const needle = buffer.toLowerCase();
				const anchor = enabled.findIndex((i) => i.value === (activeValue ?? selectedValue));
				// Search from just after the anchor, wrapping around.
				const ordered = [...enabled.slice(anchor + 1), ...enabled.slice(0, anchor + 1)];
				const match =
					ordered.find((i) => i.label.toLowerCase().startsWith(needle)) ??
					// Single repeated char cycles through same-initial options.
					(buffer.length === 1 ? undefined : ordered.find((i) => i.label.toLowerCase().startsWith(char.toLowerCase())));
				if (!match) return;
				if (open) setActiveValue(match.value);
				else select(match.value, match.label);
			},
			[items, activeValue, selectedValue, open, select],
		);

		// On open, seat the active option on the current selection (or first enabled);
		// on close, clear it. Syncing this derived focus state to the open/items props
		// is intentional — the functional updater reads the latest active value.
		useEffect(() => {
			if (!open) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setActiveValue(null);
				return;
			}
			const enabled = items.filter((i) => !i.disabled);
			if (enabled.length === 0) return;
			setActiveValue((curr) => {
				if (curr && enabled.some((i) => i.value === curr)) return curr;
				const sel = enabled.find((i) => i.value === selectedValue);
				return sel ? sel.value : enabled[0].value;
			});
		}, [open, items, selectedValue]);

		// Prefer the persisted label (set on explicit selection), fall back to the
		// label map (covers defaultValue / controlled value on first render).
		const selectedLabel = persistedLabel || labelMap[selectedValue] || '';

		const ctx = useMemo<SelectContextValue>(
			() => ({
				open,
				selectedValue,
				selectedLabel,
				disabled,
				activeValue,
				listboxId,
				getOptionId,
				setOpen,
				select,
				setActiveValue,
				moveActive,
				setActiveEdge,
				selectActive,
				typeahead,
				registerItem,
				unregisterItem,
			}),
			[
				open,
				selectedValue,
				selectedLabel,
				disabled,
				activeValue,
				listboxId,
				getOptionId,
				select,
				moveActive,
				setActiveEdge,
				selectActive,
				typeahead,
				registerItem,
				unregisterItem,
			],
		);

		return (
			<SelectContext.Provider value={ctx}>
				<div
					ref={mergedRef}
					className={className}
					data-open={open ? '' : undefined}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</SelectContext.Provider>
		);
	},
);

Root.displayName = 'Select.Root';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const {
			open,
			disabled,
			setOpen,
			activeValue,
			listboxId,
			getOptionId,
			moveActive,
			setActiveEdge,
			selectActive,
			typeahead,
		} = useSelectContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				aria-haspopup='listbox'
				aria-expanded={open}
				aria-controls={open ? listboxId : undefined}
				aria-activedescendant={open && activeValue ? getOptionId(activeValue) : undefined}
				disabled={disabled}
				className={className}
				data-state={open ? 'open' : 'closed'}
				data-disabled={disabled ? '' : undefined}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					if (!disabled) setOpen(!open);
					onClick?.(e);
				}}
				onKeyDown={(e) => {
					if (!disabled) {
						switch (e.key) {
							case 'ArrowDown':
								e.preventDefault();
								if (!open) setOpen(true);
								else moveActive(1);
								break;
							case 'ArrowUp':
								e.preventDefault();
								if (!open) setOpen(true);
								else moveActive(-1);
								break;
							case 'Home':
								if (open) {
									e.preventDefault();
									setActiveEdge('first');
								}
								break;
							case 'End':
								if (open) {
									e.preventDefault();
									setActiveEdge('last');
								}
								break;
							case 'Enter':
							case ' ':
								e.preventDefault();
								if (!open) setOpen(true);
								else selectActive();
								break;
							case 'Escape':
								if (open) {
									e.preventDefault();
									setOpen(false);
								}
								break;
							default:
								// Printable single characters drive select-only typeahead.
								if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
									typeahead(e.key);
								}
						}
					}
					(handlers as { onKeyDown?: (e: React.KeyboardEvent) => void }).onKeyDown?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Trigger.displayName = 'Select.Trigger';

// ---------------------------------------------------------------------------
// Value
// ---------------------------------------------------------------------------

const Value = React.forwardRef<HTMLSpanElement, SelectValueProps>(
	({ placeholder = 'Select an option', className, ...rest }, ref) => {
		const { selectedLabel } = useSelectContext();

		return (
			<span
				ref={ref}
				className={className}
				data-placeholder={!selectedLabel ? '' : undefined}
				{...rest}>
				{selectedLabel || placeholder}
			</span>
		);
	},
);

Value.displayName = 'Select.Value';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, SelectContentProps>(({ className, children, ...rest }, ref) => {
	const { open, listboxId } = useSelectContext();

	if (!open) return null;

	return (
		<div
			ref={ref}
			id={listboxId}
			role='listbox'
			className={className}
			data-state='open'
			{...rest}>
			{children}
		</div>
	);
});

Content.displayName = 'Select.Content';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ value, textValue, disabled = false, className, children, onClick, onMouseEnter, ...rest }, ref) => {
		const { selectedValue, activeValue, select, setActiveValue, registerItem, unregisterItem, getOptionId } =
			useSelectContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		const isSelected = selectedValue === value;
		const isActive = activeValue === value;

		// Derive label: textValue > string children > value
		const label = textValue ?? (typeof children === 'string' ? children : value);

		useEffect(() => {
			registerItem(value, label, disabled);
			return () => unregisterItem(value);
		}, [value, label, disabled, registerItem, unregisterItem]);

		return (
			<div
				ref={ref}
				id={getOptionId(value)}
				role='option'
				aria-selected={isSelected}
				aria-disabled={disabled || undefined}
				className={className}
				data-selected={isSelected ? '' : undefined}
				data-disabled={disabled ? '' : undefined}
				{...dataAttributes}
				{...merged}
				// `data-highlighted` marks the aria-activedescendant option. Set after the
				// spreads so it never collides with useInteractiveState's `data-active`
				// (pressed state).
				data-highlighted={isActive ? '' : undefined}
				onMouseEnter={(e) => {
					if (!disabled) setActiveValue(value);
					(handlers as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(e);
					onMouseEnter?.(e);
				}}
				onClick={(e) => {
					if (!disabled) select(value, label);
					onClick?.(e);
				}}>
				{children}
			</div>
		);
	},
);

Item.displayName = 'Select.Item';

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<HTMLHRElement, SelectSeparatorProps>(({ className, ...rest }, ref) => (
	<hr
		ref={ref}
		className={className}
		aria-hidden='true'
		{...rest}
	/>
));

Separator.displayName = 'Select.Separator';

// ---------------------------------------------------------------------------
// Group + GroupLabel
// ---------------------------------------------------------------------------

const Group = React.forwardRef<HTMLDivElement, SelectGroupProps>(({ className, children, ...rest }, ref) => (
	<div
		ref={ref}
		role='group'
		className={className}
		{...rest}>
		{children}
	</div>
));

Group.displayName = 'Select.Group';

const GroupLabel = React.forwardRef<HTMLSpanElement, SelectGroupLabelProps>(({ className, children, ...rest }, ref) => (
	<span
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</span>
));

GroupLabel.displayName = 'Select.GroupLabel';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Select = { Root, Trigger, Value, Content, Item, Separator, Group, GroupLabel };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Select.*`).
export { Root, Trigger, Value, Content, Item, Separator, Group, GroupLabel };
