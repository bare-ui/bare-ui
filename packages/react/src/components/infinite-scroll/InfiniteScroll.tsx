import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import type {
	InfiniteScrollContextValue,
	InfiniteScrollEndMessageProps,
	InfiniteScrollLoaderProps,
	InfiniteScrollRootProps,
	InfiniteScrollSentinelProps,
} from './InfiniteScroll.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const InfiniteScrollContext = createContext<InfiniteScrollContextValue | null>(null);

function useInfiniteScrollContext() {
	const ctx = useContext(InfiniteScrollContext);
	if (!ctx) throw new globalThis.Error('InfiniteScroll sub-components must be used within InfiniteScroll.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, InfiniteScrollRootProps>(
	(
		{ onLoadMore, hasMore = true, loading = false, rootMargin = '0px', disabled = false, className, children, ...rest },
		ref,
	) => {
		const onLoadMoreRef = useRef(onLoadMore);
		useEffect(() => {
			onLoadMoreRef.current = onLoadMore;
		});

		const loadMore = useCallback(() => onLoadMoreRef.current(), []);

		const ctx = useMemo<InfiniteScrollContextValue>(
			() => ({ hasMore, loading, disabled, rootMargin, loadMore }),
			[hasMore, loading, disabled, rootMargin, loadMore],
		);

		return (
			<InfiniteScrollContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-loading={loading ? '' : undefined}
					data-has-more={hasMore ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</InfiniteScrollContext.Provider>
		);
	},
);

Root.displayName = 'InfiniteScroll.Root';

// ---------------------------------------------------------------------------
// Sentinel
// ---------------------------------------------------------------------------

const Sentinel = React.forwardRef<HTMLDivElement, InfiniteScrollSentinelProps>(({ className, ...rest }, ref) => {
	const { hasMore, loading, disabled, rootMargin, loadMore } = useInfiniteScrollContext();
	const innerRef = useRef<HTMLDivElement | null>(null);

	const entry = useIntersectionObserver(innerRef, {
		rootMargin,
		enabled: hasMore && !disabled,
	});
	const isIntersecting = entry?.isIntersecting ?? false;

	useEffect(() => {
		if (isIntersecting && hasMore && !loading && !disabled) {
			loadMore();
		}
	}, [isIntersecting, hasMore, loading, disabled, loadMore]);

	const setRef = (node: HTMLDivElement | null) => {
		innerRef.current = node;
		if (typeof ref === 'function') ref(node);
		else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
	};

	return (
		<div
			ref={setRef}
			data-infinite-scroll-sentinel=''
			aria-hidden='true'
			className={className}
			{...rest}
		/>
	);
});

Sentinel.displayName = 'InfiniteScroll.Sentinel';

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

const Loader = React.forwardRef<HTMLDivElement, InfiniteScrollLoaderProps>(({ className, children, ...rest }, ref) => {
	const ctx = useInfiniteScrollContext();
	if (!ctx.loading) return null;
	return (
		<div
			ref={ref}
			role='status'
			aria-live='polite'
			className={className}
			{...rest}>
			{children}
		</div>
	);
});

Loader.displayName = 'InfiniteScroll.Loader';

// ---------------------------------------------------------------------------
// EndMessage
// ---------------------------------------------------------------------------

const EndMessage = React.forwardRef<HTMLDivElement, InfiniteScrollEndMessageProps>(
	({ className, children, ...rest }, ref) => {
		const ctx = useInfiniteScrollContext();
		if (ctx.hasMore) return null;
		return (
			<div
				ref={ref}
				className={className}
				{...rest}>
				{children}
			</div>
		);
	},
);

EndMessage.displayName = 'InfiniteScroll.EndMessage';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const InfiniteScroll = {
	Root,
	Sentinel,
	Loader,
	EndMessage,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `InfiniteScroll.*`).
export { Root, Sentinel, Loader, EndMessage };
