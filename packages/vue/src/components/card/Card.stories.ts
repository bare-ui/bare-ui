import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Card } from '.';

const meta = {
	title: 'Layout/Card',
	component: Card,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Unstyled container with optional data-color and data-size attributes.',
			},
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const WireframePlaceholder = (props: { height?: number }) => {
	const height = props.height ?? 160;
	return h(
		'div',
		{
			class: 'relative overflow-hidden bg-[#f5f5f5] text-black',
			style: { width: '100%', height: `${height}px` },
		},
		[
			h(
				'svg',
				{
					viewBox: '0 0 100 100',
					preserveAspectRatio: 'none',
					style: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
				},
				[
					h('line', {
						x1: '0',
						y1: '0',
						x2: '100',
						y2: '100',
						stroke: 'currentColor',
						'stroke-width': '1',
						'vector-effect': 'non-scaling-stroke',
					}),
					h('line', {
						x1: '100',
						y1: '0',
						x2: '0',
						y2: '100',
						stroke: 'currentColor',
						'stroke-width': '1',
						'vector-effect': 'non-scaling-stroke',
					}),
				],
			),
		],
	);
};

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Card, { class: 'w-full max-w-sm rounded-[8px] border border-black bg-white p-5' }, () => [
				h('h3', { class: 'text-sm font-semibold text-black mb-1' }, 'Card Title'),
				h(
					'p',
					{ class: 'text-sm text-[#6b7280]' },
					'This is a basic card component with a title and description. Use it to group related content together.',
				),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Card,
				{ class: 'w-full max-w-sm rounded-[8px] border border-black bg-white p-4 flex items-center gap-4' },
				() => [
					h(
						'div',
						{
							class: 'relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5]',
						},
						[h('span', { class: 'text-sm font-semibold text-black select-none' }, 'W')],
					),
					h('div', {}, [
						h('h3', { class: 'text-sm font-semibold text-black' }, 'Wire UI'),
						h('p', { class: 'text-xs text-[#6b7280]' }, 'Wireframe primitives for modern frameworks'),
					]),
				],
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Card,
				{ class: 'w-full max-w-sm overflow-hidden rounded-[20px] border border-black bg-white' },
				() => [
					h(WireframePlaceholder, { height: 180 }),
					h('div', { class: 'p-5' }, [
						h('h3', { class: 'text-sm font-semibold text-black mb-1' }, 'Product Name'),
						h(
							'p',
							{ class: 'text-sm text-[#6b7280] mb-4' },
							'A short description of the product with key details about what makes it special.',
						),
						h('div', { class: 'flex items-center justify-between' }, [
							h('span', { class: 'text-base font-bold text-black' }, '$49.99'),
							h(
								'button',
								{
									class: 'inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333]',
								},
								'Add to Cart',
							),
						]),
					]),
				],
			),
	}),
};
