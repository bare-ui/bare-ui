'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useMergedRefs } from '@/hooks/use-merged-refs';
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
	if (!ctx) throw new globalThis.Error('Carousel sub-components must be used within Carousel.Root');
	return ctx;
}

function domOrder(a: HTMLElement, b: HTMLElement) {
	return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, CarouselRootProps>(
	({ orientation = 'horizontal', loop = false, defaultIndex = 0, onIndexChange, className, children, ...rest }, ref) => {
		const vertical = orientation === 'vertical';
		const viewportRef = useRef<HTMLDivElement | null>(null);
		const slidesRef = useRef<HTMLElement[]>([]);
		const [count, setCount] = useState(0);
		const [current, setCurrent] = useState(defaultIndex);

		const onIndexChangeRef = useRef(onIndexChange);
		useIsomorphicLayoutEffect(() => {
			onIndexChangeRef.current = onIndexChange;
		});

		const setCurrentIndex = useCallback((index: number) => {
			setCurrent((prev) => {
				if (prev === index) return prev;
				onIndexChangeRef.current?.(index);
				return index;
			});
		}, []);

		const registerSlide = useCallback((el: HTMLElement) => {
			slidesRef.current.push(el);
			slidesRef.current.sort(domOrder);
			setCount(slidesRef.current.length);
			return () => {
				slidesRef.current = slidesRef.current.filter((e) => e !== el);
				setCount(slidesRef.current.length);
			};
		}, []);

		const offsetOf = useCallback(
			(el: HTMLElement) => {
				const vp = viewportRef.current;
				if (!vp) return 0;
				const vpRect = vp.getBoundingClientRect();
				const rect = el.getBoundingClientRect();
				return vertical ? rect.top - vpRect.top + vp.scrollTop : rect.left - vpRect.left + vp.scrollLeft;
			},
			[vertical],
		);

		const updateCurrent = useCallback(() => {
			const vp = viewportRef.current;
			if (!vp || slidesRef.current.length === 0) return;
			const scroll = vertical ? vp.scrollTop : vp.scrollLeft;
			let best = 0;
			let bestDist = Infinity;
			slidesRef.current.forEach((el, i) => {
				const dist = Math.abs(offsetOf(el) - scroll);
				if (dist < bestDist) {
					bestDist = dist;
					best = i;
				}
			});
			setCurrentIndex(best);
		}, [vertical, offsetOf, setCurrentIndex]);

		const scrollTo = useCallback(
			(index: number, behavior: ScrollBehavior = 'smooth') => {
				const clamped = Math.min(Math.max(index, 0), Math.max(slidesRef.current.length - 1, 0));
				setCurrentIndex(clamped);
				const vp = viewportRef.current;
				const el = slidesRef.current[clamped];
				if (!vp || !el) return;
				const target = offsetOf(el);
				if (typeof vp.scrollTo === 'function') {
					vp.scrollTo(vertical ? { top: target, behavior } : { left: target, behavior });
				} else if (vertical) {
					vp.scrollTop = target;
				} else {
					vp.scrollLeft = target;
				}
			},
			[vertical, offsetOf, setCurrentIndex],
		);

		const scrollNext = useCallback(() => {
			const next = current + 1;
			if (next < count) scrollTo(next);
			else if (loop) scrollTo(0);
		}, [current, count, loop, scrollTo]);

		const scrollPrev = useCallback(() => {
			const prev = current - 1;
			if (prev >= 0) scrollTo(prev);
			else if (loop) scrollTo(count - 1);
		}, [current, count, loop, scrollTo]);

		const ctx = useMemo<CarouselContextValue>(
			() => ({
				orientation,
				loop,
				count,
				current,
				canScrollPrev: loop ? count > 1 : current > 0,
				canScrollNext: loop ? count > 1 : current < count - 1,
				viewportRef,
				registerSlide,
				updateCurrent,
				scrollTo,
				scrollNext,
				scrollPrev,
			}),
			[orientation, loop, count, current, registerSlide, updateCurrent, scrollTo, scrollNext, scrollPrev],
		);

		return (
			<CarouselContext.Provider value={ctx}>
				<div
					ref={ref}
					role='region'
					aria-roledescription='carousel'
					className={className}
					data-orientation={orientation}
					{...rest}>
					{children}
					{/* Polite live region announcing the active slide to screen readers. */}
					<div
						aria-live='polite'
						aria-atomic='true'
						style={{
							position: 'absolute',
							width: 1,
							height: 1,
							margin: -1,
							padding: 0,
							border: 0,
							overflow: 'hidden',
							clip: 'rect(0 0 0 0)',
							clipPath: 'inset(50%)',
							whiteSpace: 'nowrap',
						}}>
						{count > 0 ? `Slide ${current + 1} of ${count}` : ''}
					</div>
				</div>
			</CarouselContext.Provider>
		);
	},
);

Root.displayName = 'Carousel.Root';

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

const Viewport = React.forwardRef<HTMLDivElement, CarouselViewportProps>(
	({ className, children, style, tabIndex, onScroll, onKeyDown, ...rest }, ref) => {
		const ctx = useCarouselContext();
		const mergedRef = useMergedRefs(ctx.viewportRef, ref);
		const vertical = ctx.orientation === 'vertical';

		return (
			<div
				ref={mergedRef}
				data-carousel-viewport=''
				// The viewport is a scrollable region; make it keyboard-focusable so
				// arrow-key navigation works and axe `scrollable-region-focusable` passes.
				tabIndex={tabIndex ?? 0}
				className={className}
				style={{
					overflowX: vertical ? 'hidden' : 'auto',
					overflowY: vertical ? 'auto' : 'hidden',
					scrollSnapType: `${vertical ? 'y' : 'x'} mandatory`,
					scrollbarWidth: 'none',
					...style,
				}}
				{...rest}
				onScroll={(e) => {
					ctx.updateCurrent();
					onScroll?.(e);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.defaultPrevented) return;
					const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
					const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
					if (e.key === nextKey) {
						e.preventDefault();
						ctx.scrollNext();
					} else if (e.key === prevKey) {
						e.preventDefault();
						ctx.scrollPrev();
					}
				}}>
				{children}
			</div>
		);
	},
);

Viewport.displayName = 'Carousel.Viewport';

// ---------------------------------------------------------------------------
// Content (track)
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, CarouselContentProps>(({ className, children, style, ...rest }, ref) => {
	const ctx = useCarouselContext();
	return (
		<div
			ref={ref}
			data-carousel-content=''
			className={className}
			style={{ display: 'flex', flexDirection: ctx.orientation === 'vertical' ? 'column' : 'row', ...style }}
			{...rest}>
			{children}
		</div>
	);
});

Content.displayName = 'Carousel.Content';

// ---------------------------------------------------------------------------
// Slide
// ---------------------------------------------------------------------------

const Slide = React.forwardRef<HTMLDivElement, CarouselSlideProps>(({ className, children, style, ...rest }, ref) => {
	const ctx = useCarouselContext();
	const innerRef = useRef<HTMLDivElement | null>(null);
	const mergedRef = useMergedRefs(innerRef, ref);

	const { registerSlide } = ctx;
	useIsomorphicLayoutEffect(() => {
		const el = innerRef.current;
		if (!el) return;
		return registerSlide(el);
	}, [registerSlide]);

	return (
		<div
			ref={mergedRef}
			role='group'
			aria-roledescription='slide'
			data-carousel-slide=''
			className={className}
			style={{ scrollSnapAlign: 'start', flexShrink: 0, ...style }}
			{...rest}>
			{children}
		</div>
	);
});

Slide.displayName = 'Carousel.Slide';

// ---------------------------------------------------------------------------
// Previous / Next
// ---------------------------------------------------------------------------

const Previous = React.forwardRef<HTMLButtonElement, CarouselPreviousProps>(
	({ className, children, onClick, disabled, ...rest }, ref) => {
		const ctx = useCarouselContext();
		return (
			<button
				ref={ref}
				type='button'
				aria-label='Previous slide'
				disabled={disabled ?? !ctx.canScrollPrev}
				className={className}
				{...rest}
				onClick={(e) => {
					ctx.scrollPrev();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Previous.displayName = 'Carousel.Previous';

const Next = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
	({ className, children, onClick, disabled, ...rest }, ref) => {
		const ctx = useCarouselContext();
		return (
			<button
				ref={ref}
				type='button'
				aria-label='Next slide'
				disabled={disabled ?? !ctx.canScrollNext}
				className={className}
				{...rest}
				onClick={(e) => {
					ctx.scrollNext();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Next.displayName = 'Carousel.Next';

// ---------------------------------------------------------------------------
// Indicators
// ---------------------------------------------------------------------------

const Indicators: React.FC<CarouselIndicatorsProps> = ({ children }) => {
	const ctx = useCarouselContext();
	return (
		<>
			{Array.from({ length: ctx.count }, (_, index) =>
				children({ index, selected: index === ctx.current, scrollTo: () => ctx.scrollTo(index) }),
			)}
		</>
	);
};

Indicators.displayName = 'Carousel.Indicators';

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

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Carousel.*`).
export { Root, Viewport, Content, Slide, Previous, Next, Indicators };
