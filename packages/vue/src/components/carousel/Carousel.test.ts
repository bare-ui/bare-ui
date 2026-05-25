import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, defineComponent, nextTick } from 'vue';
import { Carousel } from '.';

function makeCarousel(props: Record<string, unknown> = {}, slideCount = 4) {
	return defineComponent({
		setup() {
			return () =>
				h(Carousel.Root, props, () => [
					h(Carousel.Viewport, { 'aria-label': 'Gallery' }, () =>
						h(Carousel.Content, null, () =>
							Array.from({ length: slideCount }, (_, i) =>
								h(Carousel.Slide, { key: i }, () => `Slide ${i + 1}`),
							),
						),
					),
					h(Carousel.Previous, null, () => 'Prev'),
					h(Carousel.Next, null, () => 'Next'),
					h('div', { 'data-testid': 'dots' }, [
						h(Carousel.Indicators, null, {
							default: ({ index, selected, scrollTo }: { index: number; selected: boolean; scrollTo: () => void }) =>
								h('button', {
									'data-testid': `dot-${index}`,
									'data-selected': selected ? '' : undefined,
									onClick: scrollTo,
								}, String(index)),
						}),
					]),
				]);
		},
	});
}

describe('Carousel', () => {
	it('renders an indicator per registered slide', async () => {
		render(makeCarousel());
		// nextTick lets Vue flush the reactive update from onMounted (slides registered)
		await nextTick();
		await nextTick();
		expect(screen.getByTestId('dots').querySelectorAll('button')).toHaveLength(4);
	});

	it('marks the carousel and slide roles for a11y', async () => {
		render(makeCarousel());
		await nextTick();
		expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
		expect(screen.getAllByRole('group')).toHaveLength(4);
	});

	it('disables Previous at the start', async () => {
		render(makeCarousel());
		await nextTick();
		expect(screen.getByText('Prev')).toBeDisabled();
		expect(screen.getByText('Next')).toBeEnabled();
	});

	it('advances and selects the next slide on Next', async () => {
		const user = userEvent.setup();
		render(makeCarousel());
		await nextTick();
		await nextTick();
		expect(screen.getByTestId('dot-0')).toHaveAttribute('data-selected', '');
		await user.click(screen.getByText('Next'));
		expect(screen.getByTestId('dot-1')).toHaveAttribute('data-selected', '');
		expect(screen.getByText('Prev')).toBeEnabled();
	});

	it('goes back on Previous', async () => {
		const user = userEvent.setup();
		render(makeCarousel({ defaultIndex: 2 }));
		await nextTick();
		await nextTick();
		expect(screen.getByTestId('dot-2')).toHaveAttribute('data-selected', '');
		await user.click(screen.getByText('Prev'));
		expect(screen.getByTestId('dot-1')).toHaveAttribute('data-selected', '');
	});

	it('disables Next on the last slide without loop', async () => {
		render(makeCarousel({ defaultIndex: 3 }));
		await nextTick();
		expect(screen.getByText('Next')).toBeDisabled();
	});

	it('wraps to the first slide on Next when loop is enabled', async () => {
		const user = userEvent.setup();
		render(makeCarousel({ defaultIndex: 3, loop: true }));
		await nextTick();
		await nextTick();
		expect(screen.getByText('Next')).toBeEnabled();
		await user.click(screen.getByText('Next'));
		expect(screen.getByTestId('dot-0')).toHaveAttribute('data-selected', '');
	});

	it('jumps to a slide when its indicator is clicked', async () => {
		const user = userEvent.setup();
		const onIndexChange = vi.fn();
		render(makeCarousel({ onIndexChange }));
		await nextTick();
		await nextTick();
		await user.click(screen.getByTestId('dot-2'));
		expect(screen.getByTestId('dot-2')).toHaveAttribute('data-selected', '');
		expect(onIndexChange).toHaveBeenCalledWith(2);
	});

	it('navigates with arrow keys on the viewport', async () => {
		render(makeCarousel());
		await nextTick();
		await nextTick();
		const viewport = screen.getByLabelText('Gallery');
		fireEvent.keyDown(viewport, { key: 'ArrowRight' });
		await nextTick();
		expect(screen.getByTestId('dot-1')).toHaveAttribute('data-selected', '');
		fireEvent.keyDown(viewport, { key: 'ArrowLeft' });
		await nextTick();
		expect(screen.getByTestId('dot-0')).toHaveAttribute('data-selected', '');
	});

	it('throws when Slide is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render(defineComponent({ setup: () => () => h(Carousel.Slide, null, () => 'x') })),
		).toThrow(/Carousel.Root/);
		spy.mockRestore();
	});
});
