'use client';

import { children, createEffect, onCleanup, splitProps, type JSX } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type { ButtonProps } from './Button.types';

function Button(props: ButtonProps) {
	const [local, rest] = splitProps(props, ['asChild', 'disabled', 'autofocus', 'type', 'class', 'children', 'onClick']);

	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});

	// `merged` composes consumer-provided handlers in `rest` with the
	// interactive-state handlers — both fire on overlapping events.
	const merged = mergeProps(rest, state.handlers);

	// asChild is read once at setup — toggling it post-mount isn't supported
	// (it determines the entire render tree shape). Silence the reactivity
	// warning for this branch decision.
	// eslint-disable-next-line solid/reactivity
	if (local.asChild) {
		// asChild: render the child element directly and apply state via DOM API.
		// Solid evaluates JSX children to DOM nodes, so we can't clone them like
		// React — instead we mutate attributes and attach listeners imperatively.
		const resolved = children(() => local.children);

		createEffect(() => {
			const el = resolved() as HTMLElement | null;
			if (!(el instanceof HTMLElement)) return;

			const setOrRemove = (key: string, on: boolean) => {
				if (on) el.setAttribute(key, '');
				else el.removeAttribute(key);
			};

			setOrRemove('data-disabled', !!local.disabled);
			setOrRemove('data-autofocus', !!local.autofocus);
			setOrRemove('data-hover', state.isHovered());
			setOrRemove('data-focus-visible', state.isFocusVisible());
			setOrRemove('data-active', state.isActive());
		});

		// Forward ALL remaining props (aria-*, attrs, etc.) onto the child so the
		// child carries the same contract as a real <button> — mirrors React's
		// asChild which merges every prop (including aria-pressed). Event handlers
		// (on*) are excluded here; interactive-state listeners are attached below,
		// and consumer handlers in `rest` keep their own wiring via the element.
		createEffect(() => {
			const el = resolved() as HTMLElement | null;
			if (!(el instanceof HTMLElement)) return;

			for (const key in rest) {
				if (key.startsWith('on')) continue;
				// Read reactively so updates (e.g. aria-pressed toggling) propagate.
				const value = (rest as Record<string, unknown>)[key];
				// aria-* (and aria-like) attrs are tri-state strings: `false` must
				// render as "false", not be dropped (mirrors React's aria handling).
				const isAria = key.startsWith('aria-');
				if (value === undefined || value === null || (value === false && !isAria)) {
					el.removeAttribute(key);
				} else if (typeof value === 'boolean') {
					// HTML boolean attrs use empty-string; aria-* are tri-state strings.
					el.setAttribute(key, isAria ? String(value) : '');
				} else if (typeof value !== 'function') {
					el.setAttribute(key, String(value));
				}
			}
		});

		// Attach event listeners once on mount, clean up on unmount.
		createEffect(() => {
			const el = resolved() as HTMLElement | null;
			if (!(el instanceof HTMLElement)) return;

			const onMouseEnter = () => state.handlers.onMouseEnter();
			const onMouseLeave = () => state.handlers.onMouseLeave();
			const onPointerDown = () => state.handlers.onPointerDown();
			const onPointerUp = () => state.handlers.onPointerUp();
			const onFocus = (e: FocusEvent) =>
				(state.handlers.onFocus as (e: FocusEvent) => void)(e);
			const onBlur = () => state.handlers.onBlur();
			const onKeyDown = (e: KeyboardEvent) =>
				(state.handlers.onKeyDown as (e: KeyboardEvent) => void)(e);
			const onKeyUp = (e: KeyboardEvent) =>
				(state.handlers.onKeyUp as (e: KeyboardEvent) => void)(e);

			el.addEventListener('mouseenter', onMouseEnter);
			el.addEventListener('mouseleave', onMouseLeave);
			el.addEventListener('pointerdown', onPointerDown);
			el.addEventListener('pointerup', onPointerUp);
			el.addEventListener('focus', onFocus);
			el.addEventListener('blur', onBlur);
			el.addEventListener('keydown', onKeyDown);
			el.addEventListener('keyup', onKeyUp);

			onCleanup(() => {
				el.removeEventListener('mouseenter', onMouseEnter);
				el.removeEventListener('mouseleave', onMouseLeave);
				el.removeEventListener('pointerdown', onPointerDown);
				el.removeEventListener('pointerup', onPointerUp);
				el.removeEventListener('focus', onFocus);
				el.removeEventListener('blur', onBlur);
				el.removeEventListener('keydown', onKeyDown);
				el.removeEventListener('keyup', onKeyUp);
			});
		});

		// eslint-disable-next-line solid/components-return-once
		return resolved() as unknown as JSX.Element;
	}

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type={local.type ?? 'button'}
			disabled={local.disabled}
			autofocus={local.autofocus}
			data-autofocus={local.autofocus ? '' : undefined}
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

export { Button };