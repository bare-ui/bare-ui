import type { JSX } from 'solid-js';

export type CarouselOrientation = 'horizontal' | 'vertical';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface CarouselContextValue {
	orientation: CarouselOrientation;
	loop: boolean;
	count: number;
	current: number;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	viewportRef: (el: HTMLDivElement) => void;
	registerSlide: (el: HTMLElement) => () => void;
	updateCurrent: () => void;
	scrollTo: (index: number, behavior?: ScrollBehavior) => void;
	scrollNext: () => void;
	scrollPrev: () => void;
}

export interface CarouselIndicatorRenderProps {
	index: number;
	selected: boolean;
	scrollTo: () => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface CarouselRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Scroll axis. Default `'horizontal'`. */
	orientation?: CarouselOrientation;
	/** Wrap from last → first slide. Default `false`. */
	loop?: boolean;
	/** Initial slide index. Default `0`. */
	defaultIndex?: number;
	/** Called when the selected slide changes. */
	onIndexChange?: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type CarouselViewportProps = JSX.HTMLAttributes<HTMLDivElement>;

export type CarouselContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export type CarouselSlideProps = JSX.HTMLAttributes<HTMLDivElement>;

export type CarouselPreviousProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type CarouselNextProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface CarouselIndicatorsProps {
	children: (props: CarouselIndicatorRenderProps) => JSX.Element;
}
