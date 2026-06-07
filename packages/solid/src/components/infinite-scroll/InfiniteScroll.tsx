import { createContext, createEffect, mergeProps, splitProps, useContext, Show } from 'solid-js';
import { createIntersectionObserver } from '@/primitives/create-intersection-observer';
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
	if (!ctx) throw new Error('InfiniteScroll sub-components must be used within InfiniteScroll.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: InfiniteScrollRootProps) {
	const merged = mergeProps({ hasMore: true, loading: false, rootMargin: '0px', disabled: false }, props);
	const [local, rest] = splitProps(merged, [
		'onLoadMore',
		'hasMore',
		'loading',
		'rootMargin',
		'disabled',
		'class',
		'children',
	]);

	const loadMore = () => local.onLoadMore();

	const ctxValue: InfiniteScrollContextValue = {
		get hasMore() {
			return local.hasMore;
		},
		get loading() {
			return local.loading;
		},
		get disabled() {
			return local.disabled;
		},
		get rootMargin() {
			return local.rootMargin;
		},
		loadMore,
	};

	return (
		<InfiniteScrollContext.Provider value={ctxValue}>
			<div
				// Root owns the scroll viewport (consumers apply `overflow`), so it must be
				// keyboard-focusable for users who scroll without a pointer (scrollable-region-focusable).
				tabindex={0}
				class={local.class}
				data-loading={local.loading ? '' : undefined}
				data-has-more={local.hasMore ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</InfiniteScrollContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Sentinel
// ---------------------------------------------------------------------------

function Sentinel(props: InfiniteScrollSentinelProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useInfiniteScrollContext();
	let el: HTMLDivElement | undefined;

	const entry = createIntersectionObserver(() => el, {
		get rootMargin() {
			return ctx.rootMargin;
		},
		get enabled() {
			return ctx.hasMore && !ctx.disabled;
		},
	});

	const isIntersecting = () => entry()?.isIntersecting ?? false;

	createEffect(() => {
		if (isIntersecting() && ctx.hasMore && !ctx.loading && !ctx.disabled) {
			ctx.loadMore();
		}
	});

	return (
		<div
			ref={el}
			data-infinite-scroll-sentinel=''
			aria-hidden='true'
			class={local.class}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

function Loader(props: InfiniteScrollLoaderProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useInfiniteScrollContext();

	return (
		<Show when={ctx.loading}>
			<div
				role='status'
				aria-live='polite'
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// EndMessage
// ---------------------------------------------------------------------------

function EndMessage(props: InfiniteScrollEndMessageProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useInfiniteScrollContext();

	return (
		<Show when={!ctx.hasMore}>
			<div
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const InfiniteScroll = {
	Root,
	Sentinel,
	Loader,
	EndMessage,
};

export { Root, Sentinel, Loader, EndMessage };
