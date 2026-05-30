import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Carousel } from '.';

const meta = {
	title: 'Layout/Carousel',
	component: Carousel.Root,
	subcomponents: {
		'Carousel.Viewport': Carousel.Viewport,
		'Carousel.Content': Carousel.Content,
		'Carousel.Slide': Carousel.Slide,
		'Carousel.Previous': Carousel.Previous,
		'Carousel.Next': Carousel.Next,
		'Carousel.Indicators': Carousel.Indicators,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A headless, scroll-snap carousel (Embla-style). Tracks the active slide from scroll position, supports Prev/Next, indicators, keyboard arrows and optional looping.',
			},
		},
	},
} satisfies Meta<typeof Carousel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const slides = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
const btnCls =
	'flex size-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-black shadow-sm disabled:opacity-30';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Carousel.Root, { class: 'relative w-full max-w-md' }, () => [
				h(
					Carousel.Viewport,
					{
						tabindex: 0,
						class: 'rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-black',
					},
					() =>
						h(Carousel.Content, null, () =>
							slides.map((color, i) =>
								h(Carousel.Slide, { key: color, class: 'w-full' }, () =>
									h(
										'div',
										{
											class: 'flex h-56 items-center justify-center text-3xl font-bold text-white',
											style: { backgroundColor: color },
										},
										String(i + 1),
									),
								),
							),
						),
				),
				h('div', { class: 'absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between' }, [
					h(Carousel.Previous, { class: btnCls }, () => '‹'),
					h(Carousel.Next, { class: btnCls }, () => '›'),
				]),
				h('div', { class: 'mt-3 flex justify-center gap-2' }, [
					h(Carousel.Indicators, null, {
						default: ({ index, selected, scrollTo }: { index: number; selected: boolean; scrollTo: () => void }) =>
							h('button', {
								key: index,
								'aria-label': `Go to slide ${index + 1}`,
								onClick: scrollTo,
								class: `size-2 rounded-full transition-colors ${selected ? 'bg-black' : 'bg-[#d1d5db]'}`,
							}),
					}),
				]),
			]),
	}),
};

export const MultiItem: Story = {
	render: () => ({
		setup: () => () =>
			h(Carousel.Root, { loop: true, class: 'relative w-full max-w-2xl' }, () => [
				h(Carousel.Viewport, { class: 'rounded-2xl' }, () =>
					h(Carousel.Content, { class: 'gap-4 px-1' }, () =>
						Array.from({ length: 8 }, (_, i) =>
							h(Carousel.Slide, { key: i, class: 'w-[40%]' }, () =>
								h(
									'div',
									{ class: 'flex h-40 items-center justify-center rounded-xl bg-[#f3f4f6] text-xl font-semibold text-black' },
									`Card ${i + 1}`,
								),
							),
						),
					),
				),
				h('div', { class: 'mt-3 flex justify-end gap-2' }, [
					h(Carousel.Previous, { class: btnCls }, () => '‹'),
					h(Carousel.Next, { class: btnCls }, () => '›'),
				]),
			]),
	}),
};
