import { createEffect, onCleanup, type Accessor } from 'solid-js';

type EventTargetLike = Window | Document | HTMLElement | EventTarget | null | undefined;
type TargetAccessor = Accessor<EventTargetLike>;
type ResolvableTarget = EventTargetLike | TargetAccessor;

function resolveTarget(target: ResolvableTarget): EventTarget | null {
	if (target === undefined || target === null) return null;
	if (typeof target === 'function') return (target as TargetAccessor)() ?? null;
	return target;
}

// Window events: typed
export function createEventListener<K extends keyof WindowEventMap>(
	eventName: K,
	handler: (event: WindowEventMap[K]) => void,
	target?: Window | null | TargetAccessor,
	options?: boolean | AddEventListenerOptions,
): void;
// Document events: typed
export function createEventListener<K extends keyof DocumentEventMap>(
	eventName: K,
	handler: (event: DocumentEventMap[K]) => void,
	target: Document | null | TargetAccessor,
	options?: boolean | AddEventListenerOptions,
): void;
// HTMLElement events: typed
export function createEventListener<K extends keyof HTMLElementEventMap>(
	eventName: K,
	handler: (event: HTMLElementEventMap[K]) => void,
	target: HTMLElement | null | TargetAccessor,
	options?: boolean | AddEventListenerOptions,
): void;
// Fallback
export function createEventListener(
	eventName: string,
	handler: (event: Event) => void,
	target?: ResolvableTarget,
	options?: boolean | AddEventListenerOptions,
): void;

/**
 * Subscribes to an event on `target` (defaults to `window`).
 *
 * Pass `target` as an accessor to re-attach when it changes. Typed overloads
 * cover window / document / element.
 *
 * @example
 * createEventListener('scroll', () => setY(window.scrollY))
 * createEventListener('click', onClick, () => buttonEl)
 */
export function createEventListener(
	eventName: string,
	handler: (event: Event) => void,
	target?: ResolvableTarget,
	options?: boolean | AddEventListenerOptions,
): void {
	createEffect(() => {
		const node =
			target === undefined ? (typeof window !== 'undefined' ? window : null) : resolveTarget(target);
		if (!node || typeof node.addEventListener !== 'function') return;

		const listener: EventListener = (event) => handler(event);
		node.addEventListener(eventName, listener, options);
		onCleanup(() => node.removeEventListener(eventName, listener, options));
	});
}
