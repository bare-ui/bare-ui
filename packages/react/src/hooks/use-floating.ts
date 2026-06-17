import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlign = 'start' | 'center' | 'end';
export type FloatingStrategy = 'absolute' | 'fixed';

export interface UseFloatingOptions {
	/** Whether the floating element is open (positioning only runs when open) */
	open?: boolean;
	/** Preferred side relative to the reference element */
	side?: FloatingSide;
	/** Alignment along the chosen side */
	align?: FloatingAlign;
	/** Gap in pixels between reference and floating element */
	offset?: number;
	/** Positioning strategy — `fixed` is safer inside transformed/clipping ancestors */
	strategy?: FloatingStrategy;
	/** Flip to the opposite side when there isn't enough room */
	flip?: boolean;
	/** Shift the floating element along its main axis to stay in the viewport */
	shift?: boolean;
}

export interface UseFloatingResult {
	x: number;
	y: number;
	side: FloatingSide;
	align: FloatingAlign;
	strategy: FloatingStrategy;
	floatingStyles: CSSProperties;
	update: () => void;
}

const OPPOSITE: Record<FloatingSide, FloatingSide> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

function computePosition(
	reference: DOMRect,
	floating: { width: number; height: number },
	side: FloatingSide,
	align: FloatingAlign,
	offset: number,
): { x: number; y: number } {
	let x = 0;
	let y = 0;

	if (side === 'top' || side === 'bottom') {
		y = side === 'top' ? reference.top - floating.height - offset : reference.bottom + offset;
		if (align === 'start') x = reference.left;
		else if (align === 'end') x = reference.right - floating.width;
		else x = reference.left + (reference.width - floating.width) / 2;
	} else {
		x = side === 'left' ? reference.left - floating.width - offset : reference.right + offset;
		if (align === 'start') y = reference.top;
		else if (align === 'end') y = reference.bottom - floating.height;
		else y = reference.top + (reference.height - floating.height) / 2;
	}

	return { x, y };
}

function fitsInViewport(
	x: number,
	y: number,
	floating: { width: number; height: number },
	viewport: { width: number; height: number },
): boolean {
	return x >= 0 && y >= 0 && x + floating.width <= viewport.width && y + floating.height <= viewport.height;
}

/**
 * Positions a floating element relative to a reference element.
 *
 * Lightweight, zero-dependency positioning for tooltips, popovers, dropdowns, and similar
 * UI. Recomputes on scroll and resize while open. For more advanced needs (auto-update on
 * any layout shift, virtual elements, middleware composition), pair with `@floating-ui/dom`.
 *
 * @example
 * const referenceRef = useRef<HTMLButtonElement>(null)
 * const floatingRef = useRef<HTMLDivElement>(null)
 * const { floatingStyles, side } = useFloating(referenceRef, floatingRef, { open, side: 'bottom' })
 * return <div ref={floatingRef} style={floatingStyles} data-side={side}>...</div>
 */
export function useFloating<R extends HTMLElement, F extends HTMLElement>(
	referenceRef: RefObject<R | null>,
	floatingRef: RefObject<F | null>,
	options: UseFloatingOptions = {},
): UseFloatingResult {
	const {
		open = true,
		side: preferredSide = 'bottom',
		align: preferredAlign = 'center',
		offset = 8,
		strategy = 'absolute',
		flip = true,
		shift = true,
	} = options;

	const [state, setState] = useState<{
		x: number;
		y: number;
		side: FloatingSide;
		align: FloatingAlign;
	}>({ x: 0, y: 0, side: preferredSide, align: preferredAlign });

	const update = useCallback(() => {
		const reference = referenceRef.current;
		const floating = floatingRef.current;
		if (!reference || !floating) return;

		const referenceRect = reference.getBoundingClientRect();
		const floatingRect = { width: floating.offsetWidth, height: floating.offsetHeight };
		const viewport = { width: window.innerWidth, height: window.innerHeight };

		let side = preferredSide;
		let pos = computePosition(referenceRect, floatingRect, side, preferredAlign, offset);

		if (flip && !fitsInViewport(pos.x, pos.y, floatingRect, viewport)) {
			const flippedSide = OPPOSITE[side];
			const flippedPos = computePosition(referenceRect, floatingRect, flippedSide, preferredAlign, offset);
			if (fitsInViewport(flippedPos.x, flippedPos.y, floatingRect, viewport)) {
				side = flippedSide;
				pos = flippedPos;
			}
		}

		if (shift) {
			if (side === 'top' || side === 'bottom') {
				pos.x = Math.max(0, Math.min(pos.x, viewport.width - floatingRect.width));
			} else {
				pos.y = Math.max(0, Math.min(pos.y, viewport.height - floatingRect.height));
			}
		}

		const x = strategy === 'absolute' ? pos.x + window.scrollX : pos.x;
		const y = strategy === 'absolute' ? pos.y + window.scrollY : pos.y;

		setState((prev) =>
			prev.x === x && prev.y === y && prev.side === side && prev.align === preferredAlign
				? prev
				: { x, y, side, align: preferredAlign },
		);
	}, [referenceRef, floatingRef, preferredSide, preferredAlign, offset, strategy, flip, shift]);

	useLayoutEffect(() => {
		// DOM measurement pattern — position is derived from getBoundingClientRect, which
		// is only available after layout. See https://react.dev/reference/react/useLayoutEffect#measuring-layout-before-the-browser-repaints-the-screen
		 
		if (open) update();
	}, [open, update]);

	useEffect(() => {
		if (!open) return;
		window.addEventListener('scroll', update, true);
		window.addEventListener('resize', update);
		return () => {
			window.removeEventListener('scroll', update, true);
			window.removeEventListener('resize', update);
		};
	}, [open, update]);

	const floatingStyles: CSSProperties = {
		position: strategy,
		top: 0,
		left: 0,
		transform: `translate3d(${Math.round(state.x)}px, ${Math.round(state.y)}px, 0)`,
	};

	return { x: state.x, y: state.y, side: state.side, align: state.align, strategy, floatingStyles, update };
}
