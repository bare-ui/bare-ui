/**
 * Screen-reader semantics for Carousel. SR users navigate a carousel by its
 * region (named + role-described "carousel"), step through slides (each a group
 * role-described "slide"), and drive it with Prev/Next buttons whose names and
 * disabled state must be exposed. The scrollable viewport must be reachable.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { nextTick } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Carousel } from '.';

const {
	Root: CarouselRoot,
	Viewport: CarouselViewport,
	Content: CarouselContent,
	Slide: CarouselSlide,
	Previous: CarouselPrevious,
	Next: CarouselNext,
} = Carousel;

function renderCarousel(props: Record<string, unknown> = {}, slideCount = 4) {
	const slides = Array.from({ length: slideCount }, (_, i) => i);
	return render({
		template: `
			<CarouselRoot aria-label="Featured colors" v-bind="rootProps">
				<CarouselViewport aria-label="Gallery" tabindex="0">
					<CarouselContent>
						<CarouselSlide v-for="i in slides" :key="i">Slide {{ i + 1 }}</CarouselSlide>
					</CarouselContent>
				</CarouselViewport>
				<CarouselPrevious>Prev</CarouselPrevious>
				<CarouselNext>Next</CarouselNext>
			</CarouselRoot>
		`,
		components: {
			CarouselRoot,
			CarouselViewport,
			CarouselContent,
			CarouselSlide,
			CarouselPrevious,
			CarouselNext,
		},
		setup() {
			return { rootProps: props, slides };
		},
	});
}

describe('Carousel — screen reader semantics', () => {
	it('exposes the root as a named region role-described as a carousel', async () => {
		renderCarousel();
		await nextTick();
		const region = expectExposedAs('region', 'Featured colors');
		expect(region).toHaveAttribute('aria-roledescription', 'carousel');
	});

	it('exposes each slide as a group role-described as a slide', async () => {
		renderCarousel({}, 3);
		await nextTick();
		const slides = screen.getAllByRole('group');
		expect(slides).toHaveLength(3);
		slides.forEach((slide) => expect(slide).toHaveAttribute('aria-roledescription', 'slide'));
	});

	it('exposes Previous and Next as named buttons', async () => {
		renderCarousel();
		await nextTick();
		expectExposedAs('button', 'Previous slide');
		expectExposedAs('button', 'Next slide');
	});

	it('announces the disabled boundary state on the navigation buttons', async () => {
		renderCarousel();
		await nextTick();
		expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled();
	});

	it('exposes the last-slide boundary by disabling Next', async () => {
		renderCarousel({ defaultIndex: 3 });
		await nextTick();
		expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled();
	});

	it('keeps both navigation buttons operable when looping', async () => {
		renderCarousel({ defaultIndex: 3, loop: true });
		await nextTick();
		expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled();
		expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled();
	});

	it('makes the scrollable viewport keyboard-reachable so SR users can scroll and arrow through slides', async () => {
		renderCarousel();
		await nextTick();
		await nextTick();
		const viewport = screen.getByLabelText('Gallery');
		expect(viewport).toHaveAttribute('tabindex', '0');
		fireEvent.keyDown(viewport, { key: 'ArrowRight' });
		await nextTick();
		expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled();
	});
});
