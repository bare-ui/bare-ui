import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import type {
	ScrollAreaContextValue,
	ScrollAreaMetrics,
	ScrollAreaRootProps,
	ScrollAreaScrollbarProps,
	ScrollAreaThumbProps,
	ScrollAreaViewportProps,
	ScrollbarContextValue,
} from './ScrollArea.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);
const ScrollbarContext = createContext<ScrollbarContextValue | null>(null);

function useScrollAreaContext() {
	const ctx = useContext(ScrollAreaContext);
	if (!ctx) throw new globalThis.Error('ScrollArea sub-components must be used within ScrollArea.Root');
	return ctx;
}

function useScrollbarContext() {
	const ctx = useContext(ScrollbarContext);
	if (!ctx) throw new globalThis.Error('ScrollArea.Thumb must be used within ScrollArea.Scrollbar');
	return ctx;
}

const ZERO: ScrollAreaMetrics = {
	scrollTop: 0,
	scrollLeft: 0,
	scrollHeight: 0,
	scrollWidth: 0,
	clientHeight: 0,
	clientWidth: 0,
};

function sameMetrics(a: ScrollAreaMetrics, b: ScrollAreaMetrics) {
	return (
		a.scrollTop === b.scrollTop &&
		a.scrollLeft === b.scrollLeft &&
		a.scrollHeight === b.scrollHeight &&
		a.scrollWidth === b.scrollWidth &&
		a.clientHeight === b.clientHeight &&
		a.clientWidth === b.clientWidth
	);
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ScrollAreaRootProps>(({ className, children, style, ...rest }, ref) => {
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const [metrics, setMetrics] = useState<ScrollAreaMetrics>(ZERO);

	const updateMetrics = useCallback(() => {
		const el = viewportRef.current;
		if (!el) return;
		const next: ScrollAreaMetrics = {
			scrollTop: el.scrollTop,
			scrollLeft: el.scrollLeft,
			scrollHeight: el.scrollHeight,
			scrollWidth: el.scrollWidth,
			clientHeight: el.clientHeight,
			clientWidth: el.clientWidth,
		};
		setMetrics((prev) => (sameMetrics(prev, next) ? prev : next));
	}, []);

	const setScroll = useCallback((offset: number, orientation: 'vertical' | 'horizontal') => {
		const el = viewportRef.current;
		if (!el) return;
		if (orientation === 'vertical') el.scrollTop = offset;
		else el.scrollLeft = offset;
	}, []);

	const ctx = useMemo<ScrollAreaContextValue>(
		() => ({ viewportRef, metrics, updateMetrics, setScroll }),
		[metrics, updateMetrics, setScroll],
	);

	return (
		<ScrollAreaContext.Provider value={ctx}>
			<div
				ref={ref}
				className={className}
				style={{ position: 'relative', ...style }}
				{...rest}>
				{children}
			</div>
		</ScrollAreaContext.Provider>
	);
});

Root.displayName = 'ScrollArea.Root';

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

const Viewport = React.forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
	({ className, children, style, onScroll, ...rest }, ref) => {
		const { viewportRef, updateMetrics } = useScrollAreaContext();
		const mergedRef = useMergedRefs(viewportRef, ref);

		// Stable deps only — never re-subscribe on metric changes.
		useIsomorphicLayoutEffect(() => {
			const el = viewportRef.current;
			if (!el) return;
			updateMetrics();
			if (typeof ResizeObserver === 'undefined') return;
			const ro = new ResizeObserver(() => updateMetrics());
			ro.observe(el);
			if (el.firstElementChild) ro.observe(el.firstElementChild);
			return () => ro.disconnect();
		}, [viewportRef, updateMetrics]);

		return (
			<div
				ref={mergedRef}
				data-scroll-area-viewport=''
				className={className}
				style={{ overflow: 'auto', scrollbarWidth: 'none', ...style }}
				{...rest}
				onScroll={(e) => {
					updateMetrics();
					onScroll?.(e);
				}}>
				{children}
			</div>
		);
	},
);

Viewport.displayName = 'ScrollArea.Viewport';

// ---------------------------------------------------------------------------
// Scrollbar
// ---------------------------------------------------------------------------

const Scrollbar = React.forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>(
	({ orientation = 'vertical', forceMount = false, className, children, style, ...rest }, ref) => {
		const { metrics } = useScrollAreaContext();
		const trackRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs(trackRef, ref);

		const hasOverflow =
			orientation === 'vertical' ?
				metrics.scrollHeight > metrics.clientHeight
			:	metrics.scrollWidth > metrics.clientWidth;

		if (!forceMount && !hasOverflow) return null;

		const edge: React.CSSProperties =
			orientation === 'vertical' ? { top: 0, right: 0, bottom: 0 } : { left: 0, right: 0, bottom: 0 };

		const sbCtx: ScrollbarContextValue = { orientation, trackRef };

		return (
			<ScrollbarContext.Provider value={sbCtx}>
				<div
					ref={mergedRef}
					data-scroll-area-scrollbar=''
					data-orientation={orientation}
					data-state={hasOverflow ? 'visible' : 'hidden'}
					className={className}
					style={{ position: 'absolute', ...edge, ...style }}
					{...rest}>
					{children}
				</div>
			</ScrollbarContext.Provider>
		);
	},
);

Scrollbar.displayName = 'ScrollArea.Scrollbar';

// ---------------------------------------------------------------------------
// Thumb
// ---------------------------------------------------------------------------

const Thumb = React.forwardRef<HTMLDivElement, ScrollAreaThumbProps>(
	({ className, style, onPointerDown, onPointerMove, onPointerUp, ...rest }, ref) => {
		const ctx = useScrollAreaContext();
		const sb = useScrollbarContext();
		const vertical = sb.orientation === 'vertical';
		const m = ctx.metrics;

		const clientLen = vertical ? m.clientHeight : m.clientWidth;
		const scrollLen = vertical ? m.scrollHeight : m.scrollWidth;
		const scrollOffset = vertical ? m.scrollTop : m.scrollLeft;
		const maxScroll = Math.max(scrollLen - clientLen, 0);
		const sizePct = scrollLen > 0 ? Math.min(100, (clientLen / scrollLen) * 100) : 100;
		const offsetPct = maxScroll > 0 ? (scrollOffset / maxScroll) * (100 - sizePct) : 0;

		const dragRef = useRef<{ start: number; startScroll: number } | null>(null);

		const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
			onPointerMove?.(e);
			if (!dragRef.current) return;
			const track = sb.trackRef.current;
			if (!track) return;
			const rect = track.getBoundingClientRect();
			const trackPx = vertical ? rect.height : rect.width;
			const thumbPx = (sizePct / 100) * trackPx;
			const scrollableTrack = trackPx - thumbPx;
			if (scrollableTrack <= 0) return;
			const delta = (vertical ? e.clientY : e.clientX) - dragRef.current.start;
			const next = dragRef.current.startScroll + (delta / scrollableTrack) * maxScroll;
			ctx.setScroll(next, sb.orientation);
		};

		const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
			onPointerUp?.(e);
			if (!dragRef.current) return;
			(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
			dragRef.current = null;
		};

		const sizeStyle: React.CSSProperties =
			vertical ?
				{ right: 0, left: 0, height: `${sizePct}%`, top: `${offsetPct}%` }
			:	{ top: 0, bottom: 0, width: `${sizePct}%`, left: `${offsetPct}%` };

		return (
			<div
				ref={ref}
				data-scroll-area-thumb=''
				data-orientation={sb.orientation}
				className={className}
				style={{ position: 'absolute', ...sizeStyle, ...style }}
				{...rest}
				onPointerDown={(e) => {
					onPointerDown?.(e);
					if (e.defaultPrevented) return;
					e.preventDefault();
					dragRef.current = { start: vertical ? e.clientY : e.clientX, startScroll: scrollOffset };
					(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
				}}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
			/>
		);
	},
);

Thumb.displayName = 'ScrollArea.Thumb';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const ScrollArea = {
	Root,
	Viewport,
	Scrollbar,
	Thumb,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `ScrollArea.*`).
export { Root, Viewport, Scrollbar, Thumb };
