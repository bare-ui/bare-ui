import { useEffect, useRef, type RefObject } from 'react';

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

type Target = Window | Document | HTMLElement | EventTarget | null | undefined;
type TargetRef = RefObject<Target | null>;

function resolveTarget(target: Target | TargetRef): EventTarget | null {
	if (!target) return null;
	if ('current' in target) return target.current ?? null;
	return target;
}

// Window events: typed
export function useEventListener<K extends keyof WindowEventMap>(
	eventName: K,
	handler: (event: WindowEventMap[K]) => void,
	target?: Window | null | TargetRef,
	options?: boolean | AddEventListenerOptions,
): void;
// Document events: typed
export function useEventListener<K extends keyof DocumentEventMap>(
	eventName: K,
	handler: (event: DocumentEventMap[K]) => void,
	target: Document | null | TargetRef,
	options?: boolean | AddEventListenerOptions,
): void;
// HTMLElement events: typed
export function useEventListener<K extends keyof HTMLElementEventMap>(
	eventName: K,
	handler: (event: HTMLElementEventMap[K]) => void,
	target: HTMLElement | null | TargetRef,
	options?: boolean | AddEventListenerOptions,
): void;
// Fallback
export function useEventListener(
	eventName: string,
	handler: (event: Event) => void,
	target?: Target | TargetRef,
	options?: boolean | AddEventListenerOptions,
): void;

/**
 * Subscribes to an event on `target` (defaults to `window`).
 *
 * Always calls the latest `handler` reference without resubscribing, so you can
 * pass inline functions safely. Typed overloads cover window / document / element.
 *
 * @example
 * useEventListener('scroll', () => setY(window.scrollY))
 * useEventListener('click', onClick, buttonRef)
 */
export function useEventListener(
	eventName: string,
	handler: (event: Event) => void,
	target?: Target | TargetRef,
	options?: boolean | AddEventListenerOptions,
): void {
	const handlerRef = useRef(handler);

	useIsomorphicLayoutEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		const node = target === undefined
			? (typeof window !== 'undefined' ? window : null)
			: resolveTarget(target);
		if (!node || !node.addEventListener) return;

		const listener: EventListener = (event) => handlerRef.current(event);
		node.addEventListener(eventName, listener, options);
		return () => node.removeEventListener(eventName, listener, options);
	}, [eventName, target, options]);
}
