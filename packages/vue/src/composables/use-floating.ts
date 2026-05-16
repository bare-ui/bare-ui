import {
	computed,
	onMounted,
	onUnmounted,
	reactive,
	watch,
	type CSSProperties,
	type MaybeRefOrGetter,
	type Ref,
	toValue,
} from 'vue';

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlign = 'start' | 'center' | 'end';
export type FloatingStrategy = 'absolute' | 'fixed';

export interface UseFloatingOptions {
	/** Whether the floating element is open (positioning only runs when open) */
	open?: MaybeRefOrGetter<boolean>;
	/** Preferred side relative to the reference element */
	side?: MaybeRefOrGetter<FloatingSide>;
	/** Alignment along the chosen side */
	align?: MaybeRefOrGetter<FloatingAlign>;
	/** Gap in pixels between reference and floating element */
	offset?: MaybeRefOrGetter<number>;
	/** Positioning strategy — `fixed` is safer inside transformed/clipping ancestors */
	strategy?: MaybeRefOrGetter<FloatingStrategy>;
	/** Flip to the opposite side when there isn't enough room */
	flip?: MaybeRefOrGetter<boolean>;
	/** Shift the floating element along its main axis to stay in the viewport */
	shift?: MaybeRefOrGetter<boolean>;
}

export interface UseFloatingResult {
	x: Ref<number>;
	y: Ref<number>;
	side: Ref<FloatingSide>;
	align: Ref<FloatingAlign>;
	strategy: Ref<FloatingStrategy>;
	floatingStyles: Ref<CSSProperties>;
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
 * const referenceRef = ref<HTMLButtonElement | null>(null)
 * const floatingRef = ref<HTMLDivElement | null>(null)
 * const { floatingStyles, side } = useFloating(referenceRef, floatingRef, { open, side: 'bottom' })
 */
export function useFloating<R extends HTMLElement, F extends HTMLElement>(
	referenceRef: Ref<R | null>,
	floatingRef: Ref<F | null>,
	options: UseFloatingOptions = {},
): UseFloatingResult {
	const state = reactive({
		x: 0,
		y: 0,
		side: toValue(options.side) ?? ('bottom' as FloatingSide),
		align: toValue(options.align) ?? ('center' as FloatingAlign),
	});

	function update() {
		const reference = referenceRef.value;
		const floating = floatingRef.value;
		if (!reference || !floating) return;

		const preferredSide = toValue(options.side) ?? 'bottom';
		const preferredAlign = toValue(options.align) ?? 'center';
		const offset = toValue(options.offset) ?? 8;
		const strategy = toValue(options.strategy) ?? 'absolute';
		const flip = toValue(options.flip) ?? true;
		const shift = toValue(options.shift) ?? true;

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

		if (state.x !== x || state.y !== y || state.side !== side || state.align !== preferredAlign) {
			state.x = x;
			state.y = y;
			state.side = side;
			state.align = preferredAlign;
		}
	}

	function handleScrollResize() {
		if (toValue(options.open) ?? true) update();
	}

	onMounted(() => {
		window.addEventListener('scroll', handleScrollResize, true);
		window.addEventListener('resize', handleScrollResize);
		if (toValue(options.open) ?? true) update();
	});

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScrollResize, true);
		window.removeEventListener('resize', handleScrollResize);
	});

	watch(
		[
			referenceRef,
			floatingRef,
			() => toValue(options.open),
			() => toValue(options.side),
			() => toValue(options.align),
			() => toValue(options.offset),
			() => toValue(options.strategy),
			() => toValue(options.flip),
			() => toValue(options.shift),
		],
		() => {
			if (toValue(options.open) ?? true) update();
		},
		{ flush: 'post' },
	);

	const floatingStyles = computed<CSSProperties>(() => ({
		position: toValue(options.strategy) ?? 'absolute',
		top: '0',
		left: '0',
		transform: `translate3d(${Math.round(state.x)}px, ${Math.round(state.y)}px, 0)`,
	}));

	return {
		x: computed(() => state.x),
		y: computed(() => state.y),
		side: computed(() => state.side),
		align: computed(() => state.align),
		strategy: computed(() => toValue(options.strategy) ?? 'absolute'),
		floatingStyles,
		update,
	};
}
