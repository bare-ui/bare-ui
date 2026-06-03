'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useId } from '@/hooks/use-id';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type { ToggleGroupContextValue, ToggleGroupRootProps, ToggleProps } from './Toggle.types';

// ---------------------------------------------------------------------------
// ToggleGroup context (optional — Toggle works standalone too)
// ---------------------------------------------------------------------------

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
	(
		{
			pressed: controlledPressed,
			defaultPressed = false,
			onPressedChange,
			value,
			disabled: ownDisabled = false,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const group = useContext(ToggleGroupContext);
		const inGroup = group !== null && value !== undefined;

		const [standalonePressed, setStandalonePressed] = useControllableState({
			value: controlledPressed,
			defaultValue: defaultPressed,
			onChange: onPressedChange,
		});

		const id = useId('toggle');
		const innerRef = useRef<HTMLButtonElement | null>(null);
		const mergedRef = useMergedRefs(innerRef, ref);

		// Register with the group for roving focus (no-op when standalone).
		const register = group?.register;
		useEffect(() => {
			if (!inGroup || !register) return;
			const el = innerRef.current;
			if (!el) return;
			return register(id, el);
		}, [inGroup, register, id]);

		const pressed = inGroup ? group.isPressed(value) : standalonePressed;
		const disabled = inGroup ? group.disabled || ownDisabled : ownDisabled;

		const { handlers, dataAttributes } = useInteractiveState({ disabled });

		const ownHandlers = {
			onClick: () => {
				if (disabled) return;
				if (inGroup) group.toggle(value);
				else setStandalonePressed(!standalonePressed);
			},
			onFocus: () => {
				if (inGroup) group.onItemFocus(id);
			},
			onKeyDown: (e: React.KeyboardEvent) => {
				if (inGroup && !e.defaultPrevented) group.onItemKeyDown(e);
			},
		};

		const merged = mergeProps(
			mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>),
			ownHandlers as Record<string, unknown>,
		);

		const tabIndex = inGroup && group.rovingFocus ? (group.isTabbable(id) ? 0 : -1) : undefined;

		return (
			<button
				ref={mergedRef}
				type='button'
				aria-pressed={pressed}
				disabled={disabled}
				tabIndex={tabIndex}
				className={className}
				data-state={pressed ? 'on' : 'off'}
				data-disabled={disabled ? '' : undefined}
				{...dataAttributes}
				{...merged}>
				{children}
			</button>
		);
	},
);

Toggle.displayName = 'Toggle';

// ---------------------------------------------------------------------------
// ToggleGroup.Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ToggleGroupRootProps>((props, ref) => {
	const {
		type,
		disabled = false,
		orientation = 'horizontal',
		loop = true,
		rovingFocus = true,
		value: rawValue,
		defaultValue: rawDefault,
		onChange,
		className,
		children,
		...rest
	} = props;

	const isSingle = type === 'single';

	// Normalize value to a string[] internally for both modes.
	const controlled: string[] | undefined =
		rawValue === undefined ? undefined
		: isSingle ? (rawValue ? [rawValue as string] : [])
		: (rawValue as string[]);

	const [uncontrolled, setUncontrolled] = useState<string[]>(() => {
		if (isSingle) {
			const dv = rawDefault as string | null | undefined;
			return dv ? [dv] : [];
		}
		return ((rawDefault as string[] | undefined) ?? []).slice();
	});

	const isControlled = controlled !== undefined;
	const current = isControlled ? controlled : uncontrolled;

	const emit = useCallback(
		(next: string[]) => {
			if (!isControlled) setUncontrolled(next);
			if (isSingle) (onChange as ((v: string | null) => void) | undefined)?.(next[0] ?? null);
			else (onChange as ((v: string[]) => void) | undefined)?.(next);
		},
		[isControlled, isSingle, onChange],
	);

	const isPressed = useCallback((v: string) => current.includes(v), [current]);

	const toggle = useCallback(
		(v: string) => {
			if (isSingle) {
				emit(current.includes(v) ? [] : [v]);
			} else {
				emit(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
			}
		},
		[isSingle, current, emit],
	);

	// --- Roving focus (same model as Toolbar) ---
	const itemsRef = useRef<Array<{ id: string; el: HTMLElement }>>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const activeIdRef = useRef<string | null>(null);
	useEffect(() => {
		activeIdRef.current = activeId;
	}, [activeId]);

	const register = useCallback((id: string, el: HTMLElement) => {
		itemsRef.current.push({ id, el });
		if (activeIdRef.current === null) {
			activeIdRef.current = id;
			setActiveId(id);
		}
		return () => {
			itemsRef.current = itemsRef.current.filter((it) => it.id !== id);
			if (activeIdRef.current === id) {
				const fallback = itemsRef.current[0]?.id ?? null;
				activeIdRef.current = fallback;
				setActiveId(fallback);
			}
		};
	}, []);

	const isTabbable = useCallback((id: string) => activeId === id, [activeId]);
	const onItemFocus = useCallback((id: string) => {
		activeIdRef.current = id;
		setActiveId(id);
	}, []);

	const onItemKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!rovingFocus) return;
			const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
			const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
			if (!['Home', 'End', nextKey, prevKey].includes(e.key)) return;

			const items = [...itemsRef.current]
				.filter((it) => !(it.el as HTMLButtonElement).disabled)
				.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
			if (items.length === 0) return;
			const currentIndex = items.findIndex((it) => it.el === document.activeElement);

			let nextIndex = currentIndex;
			if (e.key === nextKey) {
				nextIndex = currentIndex + 1;
				if (nextIndex >= items.length) nextIndex = loop ? 0 : items.length - 1;
			} else if (e.key === prevKey) {
				nextIndex = currentIndex - 1;
				if (nextIndex < 0) nextIndex = loop ? items.length - 1 : 0;
			} else if (e.key === 'Home') {
				nextIndex = 0;
			} else if (e.key === 'End') {
				nextIndex = items.length - 1;
			}

			const target = items[nextIndex];
			if (target) {
				e.preventDefault();
				target.el.focus();
				onItemFocus(target.id);
			}
		},
		[rovingFocus, orientation, loop, onItemFocus],
	);

	const ctx = useMemo<ToggleGroupContextValue>(
		() => ({ isPressed, toggle, disabled, orientation, rovingFocus, isTabbable, register, onItemFocus, onItemKeyDown }),
		[isPressed, toggle, disabled, orientation, rovingFocus, isTabbable, register, onItemFocus, onItemKeyDown],
	);

	return (
		<ToggleGroupContext.Provider value={ctx}>
			<div
				ref={ref}
				role='toolbar'
				aria-orientation={orientation}
				className={className}
				data-orientation={orientation}
				data-disabled={disabled ? '' : undefined}
				{...rest}>
				{children}
			</div>
		</ToggleGroupContext.Provider>
	);
});

Root.displayName = 'ToggleGroup.Root';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export { Toggle };

export const ToggleGroup = {
	Root,
};
