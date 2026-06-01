/**
 * Screen-reader semantics for Carousel. SR users navigate a carousel by its
 * region (named + role-described "carousel"), step through slides (each a group
 * role-described "slide"), and drive it with Prev/Next buttons whose names and
 * disabled state must be exposed. The scrollable viewport must be reachable.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Carousel } from './Carousel';

function renderCarousel(props: Partial<React.ComponentProps<typeof Carousel.Root>> = {}, slideCount = 4) {
	return render(
		<Carousel.Root
			aria-label='Featured colors'
			{...props}>
			<Carousel.Viewport aria-label='Gallery'>
				<Carousel.Content>
					{Array.from({ length: slideCount }, (_, i) => (
						<Carousel.Slide key={i}>{`Slide ${i + 1}`}</Carousel.Slide>
					))}
				</Carousel.Content>
			</Carousel.Viewport>
			<Carousel.Previous>Prev</Carousel.Previous>
			<Carousel.Next>Next</Carousel.Next>
		</Carousel.Root>,
	);
}

describe('Carousel — screen reader semantics', () => {
	it('exposes the root as a named region role-described as a carousel', () => {
		renderCarousel();
		// A screen reader announces "Featured colors, carousel".
		const region = expectExposedAs('region', 'Featured colors');
		expect(region).toHaveAttribute('aria-roledescription', 'carousel');
	});

	it('exposes each slide as a group role-described as a slide', () => {
		renderCarousel({}, 3);
		const slides = screen.getAllByRole('group');
		expect(slides).toHaveLength(3);
		slides.forEach((slide) => expect(slide).toHaveAttribute('aria-roledescription', 'slide'));
	});

	it('exposes Previous and Next as named buttons', () => {
		renderCarousel();
		// The visible "Prev"/"Next" text is overridden by the aria-label for SR.
		expectExposedAs('button', 'Previous slide');
		expectExposedAs('button', 'Next slide');
	});

	it('announces the disabled boundary state on the navigation buttons', () => {
		renderCarousel();
		// At the start, "Previous slide, dimmed/unavailable"; Next is operable.
		expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled();
	});

	it('exposes the last-slide boundary by disabling Next', () => {
		renderCarousel({ defaultIndex: 3 });
		expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled();
	});

	it('keeps both navigation buttons operable when looping', () => {
		renderCarousel({ defaultIndex: 3, loop: true });
		expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled();
		expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled();
	});

	it('makes the scrollable viewport keyboard-reachable so SR users can scroll and arrow through slides', () => {
		renderCarousel();
		const viewport = screen.getByLabelText('Gallery');
		expect(viewport).toHaveAttribute('tabindex', '0');
		// Arrow keys on the focusable viewport advance the carousel.
		fireEvent.keyDown(viewport, { key: 'ArrowRight' });
		expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled();
	});
});
