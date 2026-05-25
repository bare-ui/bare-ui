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
	/** Read-only snapshot; use setViewportEl to update. */
	viewportEl: HTMLDivElement | null;
	/** Called by Viewport on mount/unmount to wire up the scroll container. */
	setViewportEl: (el: HTMLDivElement | null) => void;
	registerSlide: (el: HTMLElement) => () => void;
	updateCurrent: () => void;
	scrollTo: (index: number, behavior?: 'auto' | 'smooth' | 'instant') => void;
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

export interface CarouselRootProps {
	/** Scroll axis. Default `'horizontal'`. */
	orientation?: CarouselOrientation;
	/** Wrap from last → first slide. Default `false`. */
	loop?: boolean;
	/** Initial slide index. Default `0`. */
	defaultIndex?: number;
	/** Called when the selected slide changes. */
	onIndexChange?: (index: number) => void;
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface CarouselViewportProps {
	class?: string;
	style?: string | Record<string, string>;
}

export interface CarouselContentProps {
	class?: string;
	style?: string | Record<string, string>;
}

export interface CarouselSlideProps {
	class?: string;
	style?: string | Record<string, string>;
}

export interface CarouselPreviousProps {
	class?: string;
	disabled?: boolean;
}

export interface CarouselNextProps {
	class?: string;
	disabled?: boolean;
}

export interface CarouselIndicatorsProps {
	// uses scoped slot: { index, selected, scrollTo }
	class?: string;
}
