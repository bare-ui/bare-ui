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

export interface InfiniteScrollRootProps {
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
	/** Optional CSS class. */
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface InfiniteScrollSentinelProps {
	class?: string;
}

export interface InfiniteScrollLoaderProps {
	class?: string;
}

export interface InfiniteScrollEndMessageProps {
	class?: string;
}
