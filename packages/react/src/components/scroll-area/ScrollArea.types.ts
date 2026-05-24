import React from 'react';

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
	viewportRef: React.RefObject<HTMLDivElement | null>;
	metrics: ScrollAreaMetrics;
	updateMetrics: () => void;
	setScroll: (offset: number, orientation: ScrollAreaOrientation) => void;
}

export interface ScrollbarContextValue {
	orientation: ScrollAreaOrientation;
	trackRef: React.RefObject<HTMLDivElement | null>;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type ScrollAreaRootProps = React.HTMLAttributes<HTMLDivElement>;

export type ScrollAreaViewportProps = React.HTMLAttributes<HTMLDivElement>;

export interface ScrollAreaScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Which axis this scrollbar controls. Default `'vertical'`. */
	orientation?: ScrollAreaOrientation;
	/** Render even when the content doesn't overflow. */
	forceMount?: boolean;
}

export type ScrollAreaThumbProps = React.HTMLAttributes<HTMLDivElement>;
