import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useHotkeys } from '@/hooks/use-hotkeys';
import { useId } from '@/hooks/use-id';
import type {
	CommandContextValue,
	CommandEmptyProps,
	CommandFilter,
	CommandGroupContextValue,
	CommandGroupProps,
	CommandInputProps,
	CommandItemProps,
	CommandListProps,
	CommandRootProps,
	CommandSeparatorProps,
} from './Command.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CommandContext = createContext<CommandContextValue | null>(null);
const CommandGroupContext = createContext<CommandGroupContextValue | null>(null);

function useCommandContext() {
	const ctx = useContext(CommandContext);
	if (!ctx) throw new globalThis.Error('Command sub-components must be used within Command.Root');
	return ctx;
}

const defaultFilter: CommandFilter = (value, search, keywords) => {
	if (!search) return true;
	const haystack = `${value} ${keywords.join(' ')}`.toLowerCase();
	return haystack.includes(search.trim().toLowerCase());
};

interface RegistryEntry {
	keywords: string[];
	disabled: boolean;
	groupId?: string;
	onSelectRef: React.MutableRefObject<((value: string) => void) | undefined>;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, CommandRootProps>(
	(
		{
			searchValue,
			defaultSearchValue = '',
			onSearchChange,
			filter = defaultFilter,
			onSelect,
			loop = true,
			open,
			defaultOpen,
			onOpenChange,
			shortcut,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const [query, setQueryState] = useControllableState<string>({
			value: searchValue,
			defaultValue: defaultSearchValue,
			onChange: onSearchChange,
		});

		const managed = open !== undefined || defaultOpen !== undefined || !!shortcut;
		const [isOpen, setOpen] = useControllableState<boolean>({
			value: open,
			defaultValue: defaultOpen ?? !shortcut,
			onChange: onOpenChange,
		});

		useHotkeys(shortcut ? { [shortcut]: () => setOpen(!isOpen) } : {}, {
			enabled: !!shortcut,
			enableInInputs: true,
		});

		const registryRef = useRef<Map<string, RegistryEntry>>(new Map());
		const [version, bump] = useReducer((x: number) => x + 1, 0);
		const [activeRaw, setActiveRaw] = React.useState<string | null>(null);

		const registerItem = useCallback((value: string, item: RegistryEntry) => {
			registryRef.current.set(value, item);
			bump();
			return () => {
				registryRef.current.delete(value);
				bump();
			};
		}, []);

		const visible = useMemo(() => {
			const result: string[] = [];
			for (const [value, entry] of registryRef.current) {
				if (filter(value, query, entry.keywords)) result.push(value);
			}
			return result;
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [query, filter, version]);

		// Derive the effective active item so a filtered-out item never stays active.
		const activeValue = activeRaw && visible.includes(activeRaw) ? activeRaw : visible[0] ?? null;

		const setActiveValue = useCallback((value: string) => setActiveRaw(value), []);

		const moveActive = useCallback(
			(delta: number) => {
				if (visible.length === 0) return;
				const currentIndex = activeValue ? visible.indexOf(activeValue) : -1;
				let nextIndex = currentIndex + delta;
				if (nextIndex < 0) nextIndex = loop ? visible.length - 1 : 0;
				else if (nextIndex >= visible.length) nextIndex = loop ? 0 : visible.length - 1;
				setActiveRaw(visible[nextIndex]);
			},
			[visible, activeValue, loop],
		);

		const close = useCallback(() => {
			if (managed) setOpen(false);
		}, [managed, setOpen]);

		const onSelectRef = useRef(onSelect);
		useEffect(() => {
			onSelectRef.current = onSelect;
		});

		const selectItem = useCallback(
			(value: string) => {
				const entry = registryRef.current.get(value);
				if (!entry || entry.disabled) return;
				entry.onSelectRef.current?.(value);
				onSelectRef.current?.(value);
				if (managed) setOpen(false);
			},
			[managed, setOpen],
		);

		const baseId = useId('command');
		const listboxId = `${baseId}-list`;
		const getItemId = useCallback((value: string) => `${baseId}-item-${encodeURIComponent(value)}`, [baseId]);

		const groupHasVisible = useCallback(
			(groupId: string) => visible.some((v) => registryRef.current.get(v)?.groupId === groupId),
			[visible],
		);

		const ctx = useMemo<CommandContextValue>(
			() => ({
				query,
				setQuery: setQueryState,
				searching: query.trim().length > 0,
				visible,
				activeValue,
				setActiveValue,
				moveActive,
				registerItem,
				selectItem,
				isVisible: (value) => visible.includes(value),
				isActive: (value) => value === activeValue,
				groupHasVisible,
				listboxId,
				getItemId,
				close,
			}),
			[
				query,
				setQueryState,
				visible,
				activeValue,
				setActiveValue,
				moveActive,
				registerItem,
				selectItem,
				groupHasVisible,
				listboxId,
				getItemId,
				close,
			],
		);

		if (managed && !isOpen) return null;

		return (
			<CommandContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-command-root=''
					{...rest}>
					{children}
				</div>
			</CommandContext.Provider>
		);
	},
);

Root.displayName = 'Command.Root';

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, CommandInputProps>(({ className, onKeyDown, ...rest }, ref) => {
	const ctx = useCommandContext();
	const activeId = ctx.activeValue ? ctx.getItemId(ctx.activeValue) : undefined;

	return (
		<input
			ref={ref}
			type='text'
			role='combobox'
			autoComplete='off'
			autoCorrect='off'
			spellCheck={false}
			aria-expanded
			aria-controls={ctx.listboxId}
			aria-activedescendant={activeId}
			value={ctx.query}
			className={className}
			{...rest}
			onChange={(e) => ctx.setQuery(e.target.value)}
			onKeyDown={(e) => {
				onKeyDown?.(e);
				if (e.defaultPrevented) return;
				if (e.key === 'ArrowDown') {
					e.preventDefault();
					ctx.moveActive(1);
				} else if (e.key === 'ArrowUp') {
					e.preventDefault();
					ctx.moveActive(-1);
				} else if (e.key === 'Enter' && ctx.activeValue) {
					e.preventDefault();
					ctx.selectItem(ctx.activeValue);
				} else if (e.key === 'Escape') {
					e.preventDefault();
					ctx.close();
				}
			}}
		/>
	);
});

Input.displayName = 'Command.Input';

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

const List = React.forwardRef<HTMLDivElement, CommandListProps>(({ className, children, ...rest }, ref) => {
	const ctx = useCommandContext();
	return (
		<div
			ref={ref}
			role='listbox'
			id={ctx.listboxId}
			className={className}
			{...rest}>
			{children}
		</div>
	);
});

List.displayName = 'Command.List';

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------

const Group = React.forwardRef<HTMLDivElement, CommandGroupProps>(
	({ heading, className, children, ...rest }, ref) => {
		const ctx = useCommandContext();
		const groupId = useId('command-group');
		const hasVisible = ctx.groupHasVisible(groupId);
		const headingId = `${groupId}-heading`;

		return (
			<CommandGroupContext.Provider value={{ groupId }}>
				<div
					ref={ref}
					role='group'
					aria-labelledby={heading ? headingId : undefined}
					hidden={!hasVisible ? true : undefined}
					className={className}
					{...rest}>
					{heading != null && (
						<div
							id={headingId}
							data-command-group-heading=''
							aria-hidden='true'>
							{heading}
						</div>
					)}
					{children}
				</div>
			</CommandGroupContext.Provider>
		);
	},
);

Group.displayName = 'Command.Group';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLDivElement, CommandItemProps>(
	({ value, keywords, disabled = false, onSelect, className, children, onClick, onPointerMove, ...rest }, ref) => {
		const ctx = useCommandContext();
		const group = useContext(CommandGroupContext);
		const onSelectRef = useRef(onSelect);
		useEffect(() => {
			onSelectRef.current = onSelect;
		});

		const keywordsKey = (keywords ?? []).join('');
		const { registerItem } = ctx;
		const groupId = group?.groupId;
		useEffect(() => {
			return registerItem(value, { keywords: keywords ?? [], disabled, groupId, onSelectRef });
			// keywordsKey captures the array contents; onSelectRef is stable.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [registerItem, value, keywordsKey, disabled, groupId]);

		if (!ctx.isVisible(value)) return null;
		const active = ctx.isActive(value);

		return (
			<div
				ref={ref}
				role='option'
				id={ctx.getItemId(value)}
				aria-selected={active}
				aria-disabled={disabled || undefined}
				data-active={active ? '' : undefined}
				data-disabled={disabled ? '' : undefined}
				className={className}
				{...rest}
				onPointerMove={(e) => {
					if (!disabled) ctx.setActiveValue(value);
					onPointerMove?.(e);
				}}
				onClick={(e) => {
					if (!disabled) ctx.selectItem(value);
					onClick?.(e);
				}}>
				{children}
			</div>
		);
	},
);

Item.displayName = 'Command.Item';

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(({ className, ...rest }, ref) => {
	const ctx = useCommandContext();
	// Separators are noise while filtering.
	if (ctx.searching) return null;
	// `role="separator"` is not an allowed child of `role="listbox"` (per the ARIA
	// listbox spec, which permits only `option` and `group`). The divider is purely
	// a visual cue between groups, so it is presentational and carries no semantics.
	return (
		<div
			ref={ref}
			role='none'
			className={className}
			{...rest}
		/>
	);
});

Separator.displayName = 'Command.Separator';

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

const Empty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(({ className, children, ...rest }, ref) => {
	const ctx = useCommandContext();
	if (ctx.visible.length > 0) return null;
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

Empty.displayName = 'Command.Empty';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Command = {
	Root,
	Input,
	List,
	Group,
	Item,
	Separator,
	Empty,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Command.*`).
export { Root, Input, List, Group, Item, Separator, Empty };
