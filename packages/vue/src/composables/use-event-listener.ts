import { onMounted, onUnmounted, watch, type Ref } from 'vue';

type Target = Window | Document | HTMLElement | EventTarget | null | undefined;
type TargetRef = Ref<Target | null>;

function isRef(value: unknown): value is TargetRef {
	return typeof value === 'object' && value !== null && 'value' in value;
}

function resolveTarget(target: Target | TargetRef): EventTarget | null {
	if (!target) return null;
	if (isRef(target)) return target.value ?? null;
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
 * Typed overloads cover window / document / element. When `target` is a ref,
 * the listener re-attaches whenever the ref's value changes.
 *
 * @example
 * useEventListener('scroll', () => (y.value = window.scrollY))
 * useEventListener('click', onClick, buttonRef)
 */
export function useEventListener(
	eventName: string,
	handler: (event: Event) => void,
	target?: Target | TargetRef,
	options?: boolean | AddEventListenerOptions,
): void {
	let attachedTo: EventTarget | null = null;

	function attach(node: EventTarget | null) {
		if (!node || !node.addEventListener) return;
		node.addEventListener(eventName, handler, options);
		attachedTo = node;
	}

	function detach() {
		if (!attachedTo) return;
		attachedTo.removeEventListener(eventName, handler, options);
		attachedTo = null;
	}

	function resolveDefault(): EventTarget | null {
		if (target === undefined) return typeof window !== 'undefined' ? window : null;
		return resolveTarget(target);
	}

	onMounted(() => attach(resolveDefault()));
	onUnmounted(detach);

	if (isRef(target)) {
		watch(target as TargetRef, (next) => {
			detach();
			attach(next ?? null);
		});
	}
}
