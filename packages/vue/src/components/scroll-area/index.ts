import ScrollAreaRoot from './ScrollAreaRoot.vue';
import ScrollAreaViewport from './ScrollAreaViewport.vue';
import ScrollAreaScrollbar from './ScrollAreaScrollbar.vue';
import ScrollAreaThumb from './ScrollAreaThumb.vue';

export const ScrollArea = {
	Root: ScrollAreaRoot,
	Viewport: ScrollAreaViewport,
	Scrollbar: ScrollAreaScrollbar,
	Thumb: ScrollAreaThumb,
};

export type {
	ScrollAreaRootProps,
	ScrollAreaViewportProps,
	ScrollAreaScrollbarProps,
	ScrollAreaThumbProps,
	ScrollAreaOrientation,
	ScrollAreaMetrics,
} from './ScrollArea.types';
