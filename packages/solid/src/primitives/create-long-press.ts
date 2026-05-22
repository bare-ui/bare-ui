import { onCleanup, type JSX } from 'solid-js';

export interface CreateLongPressOptions {
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
	onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>;
	onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent>;
	onPointerLeave: JSX.EventHandler<HTMLElement, PointerEvent>;
	onPointerMove: JSX.EventHandler<HTMLElement, PointerEvent>;
	onPointerCancel: JSX.EventHandler<HTMLElement, PointerEvent>;
}

/**
 * Returns pointer handlers that fire `callback` after the user has held the
 * pointer down for `threshold` ms without moving more than `moveThreshold` px.
 *
 * Spread the returned object onto an element. Touch + mouse + pen unified via
 * Pointer Events.
 *
 * @example
 * const longPress = createLongPress(() => openContextMenu(), { threshold: 500 })
 * <div {...longPress} />
 */
export function createLongPress(
	callback: (event: PointerEvent) => void,
	options: CreateLongPressOptions = {},
): LongPressHandlers {
	const { threshold = 400, moveThreshold = 10, onStart, onCancel, onFinish, disabled = false } = options;

	let timerId: ReturnType<typeof setTimeout> | null = null;
	let triggered = false;
	let start: { x: number; y: number } | null = null;

	const clear = () => {
		if (timerId !== null) {
			clearTimeout(timerId);
			timerId = null;
		}
	};

	onCleanup(clear);

	return {
		onPointerDown: (event) => {
			if (disabled) return;
			triggered = false;
			start = { x: event.clientX, y: event.clientY };
			onStart?.(event);
			timerId = setTimeout(() => {
				triggered = true;
				timerId = null;
				callback(event);
			}, threshold);
		},
		onPointerUp: (event) => {
			clear();
			if (triggered) onFinish?.(event);
			else if (start) onCancel?.(event);
			start = null;
		},
		onPointerLeave: (event) => {
			if (timerId !== null && !triggered) {
				clear();
				onCancel?.(event);
				start = null;
			}
		},
		onPointerCancel: (event) => {
			if (timerId !== null && !triggered) {
				clear();
				onCancel?.(event);
				start = null;
			}
		},
		onPointerMove: (event) => {
			if (timerId === null || triggered || !start) return;
			const dx = event.clientX - start.x;
			const dy = event.clientY - start.y;
			if (Math.hypot(dx, dy) > moveThreshold) {
				clear();
				onCancel?.(event);
				start = null;
			}
		},
	};
}
