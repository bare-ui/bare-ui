'use client';

import {
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	splitProps,
	useContext,
	Show,
	type JSX,
} from 'solid-js';
import { createMergedRefs } from '@/primitives/create-merged-refs';
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
	if (!ctx) throw new Error('ScrollArea sub-components must be used within ScrollArea.Root');
	return ctx;
}

function useScrollbarContext() {
	const ctx = useContext(ScrollbarContext);
	if (!ctx) throw new Error('ScrollArea.Thumb must be used within ScrollArea.Scrollbar');
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

function Root(props: ScrollAreaRootProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'style']);

	const [viewport, setViewport] = createSignal<HTMLDivElement | undefined>(undefined);
	const [metrics, setMetrics] = createSignal<ScrollAreaMetrics>(ZERO);

	const updateMetrics = () => {
		const el = viewport();
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
	};

	const setScroll = (offset: number, orientation: 'vertical' | 'horizontal') => {
		const el = viewport();
		if (!el) return;
		if (orientation === 'vertical') el.scrollTop = offset;
		else el.scrollLeft = offset;
	};

	const ctxValue: ScrollAreaContextValue = {
		get viewport() {
			return viewport();
		},
		setViewport,
		get metrics() {
			return metrics();
		},
		updateMetrics,
		setScroll,
	};

	const rootStyle = (): JSX.CSSProperties => {
		const ours: JSX.CSSProperties = { position: 'relative' };
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<ScrollAreaContext.Provider value={ctxValue}>
			<div
				class={local.class}
				style={rootStyle()}
				{...rest}>
				{local.children}
			</div>
		</ScrollAreaContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

function Viewport(props: ScrollAreaViewportProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, ['class', 'children', 'style', 'onScroll', 'ref']);
	const ctx = useScrollAreaContext();

	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => ctx.setViewport(el),
		(el) => local.ref?.(el),
	);

	// Stable subscription — re-runs only when the viewport element changes,
	// never on metric updates.
	createEffect(() => {
		const el = ctx.viewport;
		if (!el) return;
		ctx.updateMetrics();
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(() => ctx.updateMetrics());
		ro.observe(el);
		if (el.firstElementChild) ro.observe(el.firstElementChild);
		onCleanup(() => ro.disconnect());
	});

	const viewportStyle = (): JSX.CSSProperties => {
		const ours: JSX.CSSProperties = { overflow: 'auto', 'scrollbar-width': 'none' };
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
		ctx.updateMetrics();
		const userOnScroll = local.onScroll;
		if (typeof userOnScroll === 'function') {
			(userOnScroll as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			ref={mergedRef}
			data-scroll-area-viewport=''
			// Scrollable region must be keyboard-operable so keyboard-only users can scroll it.
			tabindex={0}
			class={local.class}
			style={viewportStyle()}
			{...rest}
			onScroll={handleScroll}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Scrollbar
// ---------------------------------------------------------------------------

function Scrollbar(props: ScrollAreaScrollbarProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'orientation',
		'forceMount',
		'class',
		'children',
		'style',
		'ref',
	]);
	const ctx = useScrollAreaContext();

	const orientation = () => local.orientation ?? 'vertical';
	const forceMount = () => local.forceMount ?? false;

	const hasOverflow = () =>
		orientation() === 'vertical'
			? ctx.metrics.scrollHeight > ctx.metrics.clientHeight
			: ctx.metrics.scrollWidth > ctx.metrics.clientWidth;

	const [track, setTrack] = createSignal<HTMLDivElement | undefined>(undefined);
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => setTrack(el),
		(el) => local.ref?.(el),
	);

	const sbCtx: ScrollbarContextValue = {
		get orientation() {
			return orientation();
		},
		get track() {
			return track();
		},
		setTrack,
	};

	const scrollbarStyle = (): JSX.CSSProperties => {
		const edge: JSX.CSSProperties =
			orientation() === 'vertical'
				? { top: 0, right: 0, bottom: 0 }
				: { left: 0, right: 0, bottom: 0 };
		const ours: JSX.CSSProperties = { position: 'absolute', ...edge };
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<Show when={forceMount() || hasOverflow()}>
			<ScrollbarContext.Provider value={sbCtx}>
				<div
					ref={mergedRef}
					data-scroll-area-scrollbar=''
					data-orientation={orientation()}
					data-state={hasOverflow() ? 'visible' : 'hidden'}
					class={local.class}
					style={scrollbarStyle()}
					{...rest}>
					{local.children}
				</div>
			</ScrollbarContext.Provider>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Thumb
// ---------------------------------------------------------------------------

function Thumb(props: ScrollAreaThumbProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'class',
		'style',
		'onPointerDown',
		'onPointerMove',
		'onPointerUp',
	]);
	const ctx = useScrollAreaContext();
	const sb = useScrollbarContext();

	const vertical = () => sb.orientation === 'vertical';

	const clientLen = () => (vertical() ? ctx.metrics.clientHeight : ctx.metrics.clientWidth);
	const scrollLen = () => (vertical() ? ctx.metrics.scrollHeight : ctx.metrics.scrollWidth);
	const scrollOffset = () => (vertical() ? ctx.metrics.scrollTop : ctx.metrics.scrollLeft);
	const maxScroll = () => Math.max(scrollLen() - clientLen(), 0);
	const sizePct = () => (scrollLen() > 0 ? Math.min(100, (clientLen() / scrollLen()) * 100) : 100);
	const offsetPct = () => (maxScroll() > 0 ? (scrollOffset() / maxScroll()) * (100 - sizePct()) : 0);

	let drag: { start: number; startScroll: number } | null = null;

	const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		const userHandler = local.onPointerDown;
		if (typeof userHandler === 'function') {
			(userHandler as (event: typeof e) => void)(e);
		}
		if (e.defaultPrevented) return;
		e.preventDefault();
		drag = { start: vertical() ? e.clientY : e.clientX, startScroll: scrollOffset() };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	};

	const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		const userHandler = local.onPointerMove;
		if (typeof userHandler === 'function') {
			(userHandler as (event: typeof e) => void)(e);
		}
		if (!drag) return;
		const track = sb.track;
		if (!track) return;
		const rect = track.getBoundingClientRect();
		const trackPx = vertical() ? rect.height : rect.width;
		const thumbPx = (sizePct() / 100) * trackPx;
		const scrollableTrack = trackPx - thumbPx;
		if (scrollableTrack <= 0) return;
		const delta = (vertical() ? e.clientY : e.clientX) - drag.start;
		const next = drag.startScroll + (delta / scrollableTrack) * maxScroll();
		ctx.setScroll(next, sb.orientation);
	};

	const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		const userHandler = local.onPointerUp;
		if (typeof userHandler === 'function') {
			(userHandler as (event: typeof e) => void)(e);
		}
		if (!drag) return;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		drag = null;
	};

	const thumbStyle = (): JSX.CSSProperties => {
		const sizeStyle: JSX.CSSProperties = vertical()
			? { right: 0, left: 0, height: `${sizePct()}%`, top: `${offsetPct()}%` }
			: { top: 0, bottom: 0, width: `${sizePct()}%`, left: `${offsetPct()}%` };
		const ours: JSX.CSSProperties = { position: 'absolute', ...sizeStyle };
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<div
			data-scroll-area-thumb=''
			data-orientation={sb.orientation}
			class={local.class}
			style={thumbStyle()}
			{...rest}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
		/>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const ScrollArea = {
	Root,
	Viewport,
	Scrollbar,
	Thumb,
};

export { Root, Viewport, Scrollbar, Thumb };