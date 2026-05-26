import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface InfiniteScrollContextValue {
	hasMore: boolean;
	loading: boolean;
	disabled: boolean;
	rootMargin: string;
	loadMore: () => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface InfiniteScrollRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Called when the sentinel scrolls into view and more data can be loaded. */
	onLoadMore: () => void;
	/** Whether there are more items to load. Default `true`. */
	hasMore?: boolean;
	/** Whether a load is in flight (suppresses further triggers). Default `false`. */
	loading?: boolean;
	/** Margin around the root used to pre-fetch before the sentinel is fully visible. Default `'0px'`. */
	rootMargin?: string;
	/** Disable triggering entirely. */
	disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type InfiniteScrollSentinelProps = JSX.HTMLAttributes<HTMLDivElement>;

export type InfiniteScrollLoaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export type InfiniteScrollEndMessageProps = JSX.HTMLAttributes<HTMLDivElement>;
