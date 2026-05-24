import React from 'react';

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
	viewportRef: React.RefObject<HTMLDivElement | null>;
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

export interface CarouselRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export type CarouselViewportProps = React.HTMLAttributes<HTMLDivElement>;

export type CarouselContentProps = React.HTMLAttributes<HTMLDivElement>;

export type CarouselSlideProps = React.HTMLAttributes<HTMLDivElement>;

export type CarouselPreviousProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type CarouselNextProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface CarouselIndicatorsProps {
	children: (props: CarouselIndicatorRenderProps) => React.ReactNode;
}
