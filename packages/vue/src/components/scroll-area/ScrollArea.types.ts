import type { Ref } from 'vue';

export type ScrollAreaOrientation = 'vertical' | 'horizontal';

export interface ScrollAreaMetrics {
	scrollTop: number;
	scrollLeft: number;
	scrollHeight: number;
	scrollWidth: number;
	clientHeight: number;
	clientWidth: number;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ScrollAreaContextValue {
	viewportRef: Ref<HTMLDivElement | null>;
	metrics: ScrollAreaMetrics;
	updateMetrics: () => void;
	setScroll: (offset: number, orientation: ScrollAreaOrientation) => void;
}

export interface ScrollbarContextValue {
	orientation: ScrollAreaOrientation;
	trackRef: Ref<HTMLDivElement | null>;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ScrollAreaRootProps {
	class?: string;
}

export interface ScrollAreaViewportProps {
	class?: string;
}

export interface ScrollAreaScrollbarProps {
	/** Which axis this scrollbar controls. Default `'vertical'`. */
	orientation?: ScrollAreaOrientation;
	/** Render even when the content doesn't overflow. */
	forceMount?: boolean;
	class?: string;
}

export interface ScrollAreaThumbProps {
	class?: string;
}
