import { createSignal, createEffect, createRenderEffect, mergeProps, onCleanup, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlign = 'start' | 'center' | 'end';
export type FloatingStrategy = 'absolute' | 'fixed';

export interface CreateFloatingOptions {
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

export interface CreateFloatingResult {
	x: Accessor<number>;
	y: Accessor<number>;
	side: Accessor<FloatingSide>;
	align: Accessor<FloatingAlign>;
	strategy: FloatingStrategy;
	floatingStyles: () => JSX.CSSProperties;
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
 * Lightweight, zero-dependency positioning for tooltips, popovers, dropdowns, and similar UI.
 * Recomputes on scroll and resize while open. Pass element accessors so Solid can track
 * ref changes reactively.
 *
 * @example
 * let referenceEl: HTMLButtonElement | undefined;
 * let floatingEl: HTMLDivElement | undefined;
 * const { floatingStyles, side } = createFloating(() => referenceEl, () => floatingEl, { get open() { return isOpen() }, side: 'bottom' })
 * return <div ref={floatingEl} style={floatingStyles()} data-side={side()}>...</div>
 */
export function createFloating<R extends HTMLElement, F extends HTMLElement>(
	referenceRef: Accessor<R | null | undefined>,
	floatingRef: Accessor<F | null | undefined>,
	options: CreateFloatingOptions = {},
): CreateFloatingResult {
	const merged = mergeProps(
		{
			open: true,
			side: 'bottom' as FloatingSide,
			align: 'center' as FloatingAlign,
			offset: 8,
			strategy: 'absolute' as FloatingStrategy,
			flip: true,
			shift: true,
		},
		options,
	);

	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);
	const [side, setSide] = createSignal<FloatingSide>(merged.side);
	const [align, setAlign] = createSignal<FloatingAlign>(merged.align);

	const update = () => {
		const reference = referenceRef();
		const floating = floatingRef();
		if (!reference || !floating) return;

		const referenceRect = reference.getBoundingClientRect();
		const floatingRect = { width: floating.offsetWidth, height: floating.offsetHeight };
		const viewport = { width: window.innerWidth, height: window.innerHeight };

		let currentSide = merged.side;
		let pos = computePosition(referenceRect, floatingRect, currentSide, merged.align, merged.offset);

		if (merged.flip && !fitsInViewport(pos.x, pos.y, floatingRect, viewport)) {
			const flippedSide = OPPOSITE[currentSide];
			const flippedPos = computePosition(referenceRect, floatingRect, flippedSide, merged.align, merged.offset);
			if (fitsInViewport(flippedPos.x, flippedPos.y, floatingRect, viewport)) {
				currentSide = flippedSide;
				pos = flippedPos;
			}
		}

		if (merged.shift) {
			if (currentSide === 'top' || currentSide === 'bottom') {
				pos.x = Math.max(0, Math.min(pos.x, viewport.width - floatingRect.width));
			} else {
				pos.y = Math.max(0, Math.min(pos.y, viewport.height - floatingRect.height));
			}
		}

		const nextX = merged.strategy === 'absolute' ? pos.x + window.scrollX : pos.x;
		const nextY = merged.strategy === 'absolute' ? pos.y + window.scrollY : pos.y;

		setX(nextX);
		setY(nextY);
		setSide(currentSide);
		setAlign(merged.align);
	};

	// Recompute position synchronously when open or options change (useLayoutEffect equivalent)
	createRenderEffect(() => {
		if (merged.open) update();
	});

	// Register scroll/resize listeners while open
	createEffect(() => {
		if (!merged.open) return;
		window.addEventListener('scroll', update, true);
		window.addEventListener('resize', update);
		onCleanup(() => {
			window.removeEventListener('scroll', update, true);
			window.removeEventListener('resize', update);
		});
	});

	const floatingStyles = (): JSX.CSSProperties => ({
		position: merged.strategy,
		top: '0',
		left: '0',
		transform: `translate3d(${Math.round(x())}px, ${Math.round(y())}px, 0)`,
	});

	return { x, y, side, align, strategy: merged.strategy, floatingStyles, update };
}
