'use client';

import {
	createContext,
	createSignal,
	onCleanup,
	splitProps,
	useContext,
	For,
	type JSX,
} from 'solid-js';
import { getDirection } from '@/primitives/create-direction';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { useWireUI } from '@/context/wire-ui-context';
import type {
	CarouselContentProps,
	CarouselContextValue,
	CarouselIndicatorsProps,
	CarouselNextProps,
	CarouselPreviousProps,
	CarouselRootProps,
	CarouselSlideProps,
	CarouselViewportProps,
} from './Carousel.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
	const ctx = useContext(CarouselContext);
	if (!ctx) throw new Error('Carousel sub-components must be used within Carousel.Root');
	return ctx;
}

function domOrder(a: HTMLElement, b: HTMLElement) {
	return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: CarouselRootProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'orientation',
		'loop',
		'defaultIndex',
		'onIndexChange',
		'class',
		'children',
		'ref',
	]);

	const orientation = () => local.orientation ?? 'horizontal';
	const loop = () => local.loop ?? false;
	const vertical = () => orientation() === 'vertical';

	let viewportEl: HTMLDivElement | undefined;
	const slides: HTMLElement[] = [];

	const [count, setCount] = createSignal(0);
	const [current, setCurrent] = createSignal(local.defaultIndex ?? 0);

	const setCurrentIndex = (index: number) => {
		if (current() === index) return;
		setCurrent(index);
		local.onIndexChange?.(index);
	};

	const registerSlide = (el: HTMLElement) => {
		slides.push(el);
		slides.sort(domOrder);
		setCount(slides.length);
		return () => {
			const idx = slides.indexOf(el);
			if (idx !== -1) slides.splice(idx, 1);
			setCount(slides.length);
		};
	};

	const offsetOf = (el: HTMLElement) => {
		const vp = viewportEl;
		if (!vp) return 0;
		const vpRect = vp.getBoundingClientRect();
		const rect = el.getBoundingClientRect();
		return vertical() ? rect.top - vpRect.top + vp.scrollTop : rect.left - vpRect.left + vp.scrollLeft;
	};

	const updateCurrent = () => {
		const vp = viewportEl;
		if (!vp || slides.length === 0) return;
		const scroll = vertical() ? vp.scrollTop : vp.scrollLeft;
		let best = 0;
		let bestDist = Infinity;
		slides.forEach((el, i) => {
			const dist = Math.abs(offsetOf(el) - scroll);
			if (dist < bestDist) {
				bestDist = dist;
				best = i;
			}
		});
		setCurrentIndex(best);
	};

	const scrollTo = (index: number, behavior: ScrollBehavior = 'smooth') => {
		const clamped = Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0));
		setCurrentIndex(clamped);
		const vp = viewportEl;
		const el = slides[clamped];
		if (!vp || !el) return;
		const target = offsetOf(el);
		if (typeof vp.scrollTo === 'function') {
			vp.scrollTo(vertical() ? { top: target, behavior } : { left: target, behavior });
		} else if (vertical()) {
			vp.scrollTop = target;
		} else {
			vp.scrollLeft = target;
		}
	};

	const scrollNext = () => {
		const next = current() + 1;
		if (next < count()) scrollTo(next);
		else if (loop()) scrollTo(0);
	};

	const scrollPrev = () => {
		const prev = current() - 1;
		if (prev >= 0) scrollTo(prev);
		else if (loop()) scrollTo(count() - 1);
	};

	const ctx: CarouselContextValue = {
		get orientation() {
			return orientation();
		},
		get loop() {
			return loop();
		},
		get count() {
			return count();
		},
		get current() {
			return current();
		},
		get canScrollPrev() {
			return loop() ? count() > 1 : current() > 0;
		},
		get canScrollNext() {
			return loop() ? count() > 1 : current() < count() - 1;
		},
		viewportRef: (el) => (viewportEl = el),
		registerSlide,
		updateCurrent,
		scrollTo,
		scrollNext,
		scrollPrev,
	};

	return (
		<CarouselContext.Provider value={ctx}>
			<div
				ref={local.ref}
				role='region'
				aria-roledescription='carousel'
				class={local.class}
				data-orientation={orientation()}
				{...rest}>
				{local.children}
			</div>
		</CarouselContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

function Viewport(props: CarouselViewportProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'class',
		'children',
		'style',
		'tabindex',
		'onScroll',
		'onKeyDown',
		'ref',
	]);
	const ctx = useCarouselContext();
	const mergedRef = createMergedRefs<HTMLDivElement>(ctx.viewportRef, (el) => local.ref?.(el));
	const vertical = () => ctx.orientation === 'vertical';

	const viewportStyle = (): JSX.CSSProperties => {
		const ours: JSX.CSSProperties = {
			'overflow-x': vertical() ? 'hidden' : 'auto',
			'overflow-y': vertical() ? 'auto' : 'hidden',
			'scroll-snap-type': `${vertical() ? 'y' : 'x'} mandatory`,
			'scrollbar-width': 'none',
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
		ctx.updateCurrent();
		const userOnScroll = local.onScroll;
		if (typeof userOnScroll === 'function') {
			(userOnScroll as (event: typeof e) => void)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
		if (e.defaultPrevented) return;
		// RTL mirrors the horizontal axis: ArrowLeft advances, ArrowRight retreats.
		const rtl = !vertical() && getDirection(e.currentTarget) === 'rtl';
		const nextKey = vertical() ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
		const prevKey = vertical() ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
		if (e.key === nextKey) {
			e.preventDefault();
			ctx.scrollNext();
		} else if (e.key === prevKey) {
			e.preventDefault();
			ctx.scrollPrev();
		}
	};

	return (
		<div
			ref={mergedRef}
			data-carousel-viewport=''
			// The viewport is a scrollable region; make it keyboard-focusable so
			// arrow-key navigation works and axe `scrollable-region-focusable` passes.
			tabindex={local.tabindex ?? 0}
			class={local.class}
			style={viewportStyle()}
			{...rest}
			onScroll={handleScroll}
			onKeyDown={handleKeyDown}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Content (track)
// ---------------------------------------------------------------------------

function Content(props: CarouselContentProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'style']);
	const ctx = useCarouselContext();

	const contentStyle = (): JSX.CSSProperties => {
		const ours: JSX.CSSProperties = {
			display: 'flex',
			'flex-direction': ctx.orientation === 'vertical' ? 'column' : 'row',
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<div
			data-carousel-content=''
			class={local.class}
			style={contentStyle()}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Slide
// ---------------------------------------------------------------------------

function Slide(props: CarouselSlideProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, ['class', 'children', 'style', 'ref']);
	const ctx = useCarouselContext();

	let cleanup: (() => void) | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => {
			if (el) cleanup = ctx.registerSlide(el);
		},
		(el) => local.ref?.(el),
	);

	onCleanup(() => cleanup?.());

	const slideStyle = (): JSX.CSSProperties => {
		const ours: JSX.CSSProperties = {
			'scroll-snap-align': 'start',
			'flex-shrink': 0,
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<div
			ref={mergedRef}
			role='group'
			aria-roledescription='slide'
			data-carousel-slide=''
			class={local.class}
			style={slideStyle()}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Previous / Next
// ---------------------------------------------------------------------------

function Previous(props: CarouselPreviousProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'disabled']);
	const ctx = useCarouselContext();
	const wire = useWireUI();

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.scrollPrev();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			aria-label={wire.messages.carousel.previous}
			disabled={local.disabled ?? !ctx.canScrollPrev}
			class={local.class}
			{...rest}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

function Next(props: CarouselNextProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'disabled']);
	const ctx = useCarouselContext();
	const wire = useWireUI();

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.scrollNext();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			aria-label={wire.messages.carousel.next}
			disabled={local.disabled ?? !ctx.canScrollNext}
			class={local.class}
			{...rest}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Indicators
// ---------------------------------------------------------------------------

function Indicators(props: CarouselIndicatorsProps) {
	const ctx = useCarouselContext();
	const indices = () => Array.from({ length: ctx.count }, (_, index) => index);

	return (
		<For each={indices()}>
			{(index) => {
				// Re-run the render-prop whenever the selected slide changes so
				// consumers that destructure `selected` still see updates (a plain
				// getter would lose reactivity once destructured). Passing a thunk
				// child makes Solid track `ctx.current` and re-evaluate on change.
				const scrollTo = () => ctx.scrollTo(index);
				return <>{() => props.children({ index, selected: index === ctx.current, scrollTo })}</>;
			}}
		</For>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Carousel = {
	Root,
	Viewport,
	Content,
	Slide,
	Previous,
	Next,
	Indicators,
};

// Named exports expose the sub-components to Storybook's docgen (public API stays `Carousel.*`).
export { Root, Viewport, Content, Slide, Previous, Next, Indicators };