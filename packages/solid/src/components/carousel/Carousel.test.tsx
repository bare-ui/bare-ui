import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { For } from 'solid-js';
import { Carousel } from './Carousel';
import type { CarouselRootProps } from './Carousel.types';

function renderCarousel(props: Partial<CarouselRootProps> = {}, slideCount = 4) {
	render(() => (
		<Carousel.Root {...props}>
			<Carousel.Viewport aria-label='Gallery'>
				<Carousel.Content>
					<For each={Array.from({ length: slideCount }, (_, i) => i)}>
						{(i) => <Carousel.Slide>{`Slide ${i + 1}`}</Carousel.Slide>}
					</For>
				</Carousel.Content>
			</Carousel.Viewport>
			<Carousel.Previous>Prev</Carousel.Previous>
			<Carousel.Next>Next</Carousel.Next>
			<div data-testid='dots'>
				<Carousel.Indicators>
					{({ index, selected, scrollTo }) => (
						<button
							data-testid={`dot-${index}`}
							data-selected={selected ? '' : undefined}
							onClick={scrollTo}>
							{index}
						</button>
					)}
				</Carousel.Indicators>
			</div>
		</Carousel.Root>
	));
}

describe('Carousel', () => {
	it('renders an indicator per registered slide', () => {
		renderCarousel();
		expect(screen.getByTestId('dots').querySelectorAll('button')).toHaveLength(4);
	});

	it('marks the carousel and slide roles for a11y', () => {
		renderCarousel();
		expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
		expect(screen.getAllByRole('group')).toHaveLength(4);
	});

	it('disables Previous at the start', () => {
		renderCarousel();
		expect(screen.getByText('Prev')).toBeDisabled();
		expect(screen.getByText('Next')).toBeEnabled();
	});

	it('advances and selects the next slide on Next', async () => {
		const user = userEvent.setup();
		renderCarousel();
		expect(screen.getByTestId('dot-0')).toHaveAttribute('data-selected', '');
		await user.click(screen.getByText('Next'));
		expect(screen.getByTestId('dot-1')).toHaveAttribute('data-selected', '');
		expect(screen.getByText('Prev')).toBeEnabled();
	});

	it('goes back on Previous', async () => {
		const user = userEvent.setup();
		renderCarousel({ defaultIndex: 2 });
		expect(screen.getByTestId('dot-2')).toHaveAttribute('data-selected', '');
		await user.click(screen.getByText('Prev'));
		expect(screen.getByTestId('dot-1')).toHaveAttribute('data-selected', '');
	});

	it('disables Next on the last slide without loop', () => {
		renderCarousel({ defaultIndex: 3 });
		expect(screen.getByText('Next')).toBeDisabled();
	});

	it('wraps to the first slide on Next when loop is enabled', async () => {
		const user = userEvent.setup();
		renderCarousel({ defaultIndex: 3, loop: true });
		expect(screen.getByText('Next')).toBeEnabled();
		await user.click(screen.getByText('Next'));
		expect(screen.getByTestId('dot-0')).toHaveAttribute('data-selected', '');
	});

	it('jumps to a slide when its indicator is clicked', async () => {
		const user = userEvent.setup();
		const onIndexChange = vi.fn();
		renderCarousel({ onIndexChange });
		await user.click(screen.getByTestId('dot-2'));
		expect(screen.getByTestId('dot-2')).toHaveAttribute('data-selected', '');
		expect(onIndexChange).toHaveBeenCalledWith(2);
	});

	it('navigates with arrow keys on the viewport', () => {
		renderCarousel();
		const viewport = screen.getByLabelText('Gallery');
		fireEvent.keyDown(viewport, { key: 'ArrowRight' });
		expect(screen.getByTestId('dot-1')).toHaveAttribute('data-selected', '');
		fireEvent.keyDown(viewport, { key: 'ArrowLeft' });
		expect(screen.getByTestId('dot-0')).toHaveAttribute('data-selected', '');
	});

	it('throws when Slide is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(() => <Carousel.Slide>x</Carousel.Slide>)).toThrow(/Carousel.Root/);
		spy.mockRestore();
	});
});
