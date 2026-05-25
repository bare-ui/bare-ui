import InfiniteScrollRoot from './InfiniteScrollRoot.vue';
import InfiniteScrollSentinel from './InfiniteScrollSentinel.vue';
import InfiniteScrollLoader from './InfiniteScrollLoader.vue';
import InfiniteScrollEndMessage from './InfiniteScrollEndMessage.vue';

export const InfiniteScroll = {
	Root: InfiniteScrollRoot,
	Sentinel: InfiniteScrollSentinel,
	Loader: InfiniteScrollLoader,
	EndMessage: InfiniteScrollEndMessage,
};

export type {
	InfiniteScrollRootProps,
	InfiniteScrollSentinelProps,
	InfiniteScrollLoaderProps,
	InfiniteScrollEndMessageProps,
} from './InfiniteScroll.types';
