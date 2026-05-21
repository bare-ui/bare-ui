import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

export interface UseLongPressOptions {
	/** Milliseconds the pointer must be held before firing. Defaults to 400. */
	threshold?: number;
	/** Pixels the pointer can move before the press cancels. Defaults to 10. */
	moveThreshold?: number;
	/** Fired on every press start (before the threshold). */
	onStart?: (event: ReactPointerEvent) => void;
	/** Fired when the pointer is released before `threshold`. */
	onCancel?: (event: ReactPointerEvent) => void;
	/** Fired when the press completes successfully. */
	onFinish?: (event: ReactPointerEvent) => void;
	/** Disable the handlers entirely. */
	disabled?: boolean;
}

export interface LongPressHandlers {
	onPointerDown: (event: ReactPointerEvent) => void;
	onPointerUp: (event: ReactPointerEvent) => void;
	onPointerLeave: (event: ReactPointerEvent) => void;
	onPointerMove: (event: ReactPointerEvent) => void;
	onPointerCancel: (event: ReactPointerEvent) => void;
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
 * <div {...longPress} />
 */
export function useLongPress(
	callback: (event: ReactPointerEvent) => void,
	options: UseLongPressOptions = {},
): LongPressHandlers {
	const { threshold = 400, moveThreshold = 10, onStart, onCancel, onFinish, disabled = false } = options;
	const callbackRef = useRef(callback);
	const onStartRef = useRef(onStart);
	const onCancelRef = useRef(onCancel);
	const onFinishRef = useRef(onFinish);
	useEffect(() => {
		callbackRef.current = callback;
		onStartRef.current = onStart;
		onCancelRef.current = onCancel;
		onFinishRef.current = onFinish;
	}, [callback, onStart, onCancel, onFinish]);

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const triggeredRef = useRef(false);
	const startRef = useRef<{ x: number; y: number } | null>(null);

	const clear = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	useEffect(() => () => clear(), [clear]);

	const onPointerDown = useCallback(
		(event: ReactPointerEvent) => {
			if (disabled) return;
			triggeredRef.current = false;
			startRef.current = { x: event.clientX, y: event.clientY };
			onStartRef.current?.(event);
			// Capture the event for the closure — React pools synthetic events in <17 only,
			// but persisting the relevant fields keeps this safe across versions.
			const persisted = event;
			timerRef.current = setTimeout(() => {
				triggeredRef.current = true;
				callbackRef.current(persisted);
			}, threshold);
		},
		[disabled, threshold],
	);

	const onPointerUp = useCallback(
		(event: ReactPointerEvent) => {
			clear();
			if (triggeredRef.current) onFinishRef.current?.(event);
			else if (startRef.current) onCancelRef.current?.(event);
			startRef.current = null;
		},
		[clear],
	);

	const onPointerLeave = useCallback(
		(event: ReactPointerEvent) => {
			if (timerRef.current && !triggeredRef.current) {
				clear();
				onCancelRef.current?.(event);
				startRef.current = null;
			}
		},
		[clear],
	);

	const onPointerCancel = useCallback(
		(event: ReactPointerEvent) => {
			if (timerRef.current && !triggeredRef.current) {
				clear();
				onCancelRef.current?.(event);
				startRef.current = null;
			}
		},
		[clear],
	);

	const onPointerMove = useCallback(
		(event: ReactPointerEvent) => {
			if (!timerRef.current || triggeredRef.current || !startRef.current) return;
			const dx = event.clientX - startRef.current.x;
			const dy = event.clientY - startRef.current.y;
			if (Math.hypot(dx, dy) > moveThreshold) {
				clear();
				onCancelRef.current?.(event);
				startRef.current = null;
			}
		},
		[clear, moveThreshold],
	);

	return { onPointerDown, onPointerUp, onPointerLeave, onPointerMove, onPointerCancel };
}
