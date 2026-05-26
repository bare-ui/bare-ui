import type { JSX } from 'solid-js';

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
	readonly viewport: HTMLDivElement | undefined;
	setViewport: (el: HTMLDivElement | undefined) => void;
	readonly metrics: ScrollAreaMetrics;
	updateMetrics: () => void;
	setScroll: (offset: number, orientation: ScrollAreaOrientation) => void;
}

export interface ScrollbarContextValue {
	readonly orientation: ScrollAreaOrientation;
	readonly track: HTMLDivElement | undefined;
	setTrack: (el: HTMLDivElement | undefined) => void;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type ScrollAreaRootProps = JSX.HTMLAttributes<HTMLDivElement>;

export type ScrollAreaViewportProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface ScrollAreaScrollbarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Which axis this scrollbar controls. Default `'vertical'`. */
	orientation?: ScrollAreaOrientation;
	/** Render even when the content doesn't overflow. */
	forceMount?: boolean;
}

export type ScrollAreaThumbProps = JSX.HTMLAttributes<HTMLDivElement>;
