import CarouselRoot from './CarouselRoot.vue';
import CarouselViewport from './CarouselViewport.vue';
import CarouselContent from './CarouselContent.vue';
import CarouselSlide from './CarouselSlide.vue';
import CarouselPrevious from './CarouselPrevious.vue';
import CarouselNext from './CarouselNext.vue';
import CarouselIndicators from './CarouselIndicators.vue';

export const Carousel = {
	Root: CarouselRoot,
	Viewport: CarouselViewport,
	Content: CarouselContent,
	Slide: CarouselSlide,
	Previous: CarouselPrevious,
	Next: CarouselNext,
	Indicators: CarouselIndicators,
};

export type {
	CarouselRootProps,
	CarouselViewportProps,
	CarouselContentProps,
	CarouselSlideProps,
	CarouselPreviousProps,
	CarouselNextProps,
	CarouselIndicatorsProps,
	CarouselIndicatorRenderProps,
	CarouselOrientation,
} from './Carousel.types';
