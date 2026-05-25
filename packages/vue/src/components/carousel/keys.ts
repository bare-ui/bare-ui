import { inject, type InjectionKey } from 'vue';
import type { CarouselContextValue } from './Carousel.types';

export const CarouselKey: InjectionKey<CarouselContextValue> = Symbol('CarouselContext');

export function useCarouselContext() {
	const ctx = inject(CarouselKey);
	if (!ctx) throw new Error('Carousel sub-components must be used within Carousel.Root');
	return ctx;
}
