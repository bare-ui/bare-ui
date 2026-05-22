import { onUnmounted } from 'vue';

export interface UseLongPressOptions {
	/** Milliseconds the pointer must be held before firing. Defaults to 400. */
	threshold?: number;
	/** Pixels the pointer can move before the press cancels. Defaults to 10. */
	moveThreshold?: number;
	/** Fired on every press start (before the threshold). */
	onStart?: (event: PointerEvent) => void;
	/** Fired when the pointer is released before `threshold`. */
	onCancel?: (event: PointerEvent) => void;
	/** Fired when the press completes successfully. */
	onFinish?: (event: PointerEvent) => void;
	/** Disable the handlers entirely. */
	disabled?: boolean;
}

export interface LongPressHandlers {
	onPointerdown: (event: PointerEvent) => void;
	onPointerup: (event: PointerEvent) => void;
	onPointerleave: (event: PointerEvent) => void;
	onPointermove: (event: PointerEvent) => void;
	onPointercancel: (event: PointerEvent) => void;
}

/**
 * Returns pointer handlers that fire `callback` after the user has held the
 * pointer down for `threshold` ms without moving more than `moveThreshold` px.
 *
 * Spread the returned object onto an element. Touch + mouse + pen unified via
 * Pointer Events.
 *
 * @example
 * const longPress = useLongPress(() => openContextMenu(), { threshold: 500 })
 * <div v-bind="longPress" />
 */
export function useLongPress(
	callback: (event: PointerEvent) => void,
	options: UseLongPressOptions = {},
): LongPressHandlers {
	const { threshold = 400, moveThreshold = 10, onStart, onCancel, onFinish, disabled = false } = options;
	let timer: ReturnType<typeof setTimeout> | null = null;
	let triggered = false;
	let start: { x: number; y: number } | null = null;

	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	function onPointerdown(event: PointerEvent) {
		if (disabled) return;
		triggered = false;
		start = { x: event.clientX, y: event.clientY };
		onStart?.(event);
		timer = setTimeout(() => {
			triggered = true;
			callback(event);
		}, threshold);
	}

	function onPointerup(event: PointerEvent) {
		clear();
		if (triggered) onFinish?.(event);
		else if (start) onCancel?.(event);
		start = null;
	}

	function onPointerleave(event: PointerEvent) {
		if (timer && !triggered) {
			clear();
			onCancel?.(event);
			start = null;
		}
	}

	function onPointercancel(event: PointerEvent) {
		if (timer && !triggered) {
			clear();
			onCancel?.(event);
			start = null;
		}
	}

	function onPointermove(event: PointerEvent) {
		if (!timer || triggered || !start) return;
		const dx = event.clientX - start.x;
		const dy = event.clientY - start.y;
		if (Math.hypot(dx, dy) > moveThreshold) {
			clear();
			onCancel?.(event);
			start = null;
		}
	}

	onUnmounted(clear);

	return { onPointerdown, onPointerup, onPointerleave, onPointermove, onPointercancel };
}
