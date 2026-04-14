import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Image } from '.';

const meta = {
	title: 'Media/Image',
	component: Image,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Image wrapper with a loader placeholder shown until the image loads.',
			},
		},
	},
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj;

const WireframePlaceholder = (props: { width?: number; height?: number }) => {
	const width = props.width ?? 400;
	const height = props.height ?? 240;
	return h(
		'div',
		{
			style: {
				width: `${width}px`,
				height: `${height}px`,
				position: 'relative',
				background: '#f5f5f5',
				border: '2px solid #000',
				overflow: 'hidden',
			},
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
						stroke: '#000',
						'stroke-width': '2',
						'vector-effect': 'non-scaling-stroke',
					}),
					h('line', {
						x1: '100',
						y1: '0',
						x2: '0',
						y2: '100',
						stroke: '#000',
						'stroke-width': '2',
						'vector-effect': 'non-scaling-stroke',
					}),
				],
			),
		],
	);
};

export const Default: Story = {
	render: () => ({
		setup: () => () => h(WireframePlaceholder, { width: 400, height: 240 }),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-6' }, [
				h('div', {}, [
					h('p', { class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2' }, 'Left'),
					h('div', { class: 'flex justify-start' }, [h(WireframePlaceholder, { width: 320, height: 200 })]),
				]),
				h('div', {}, [
					h('p', { class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2' }, 'Center'),
					h('div', { class: 'flex justify-center' }, [
						h(WireframePlaceholder, { width: 320, height: 200 }),
					]),
				]),
				h('div', {}, [
					h('p', { class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2' }, 'Right'),
					h('div', { class: 'flex justify-end' }, [h(WireframePlaceholder, { width: 320, height: 200 })]),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'grid grid-cols-2 gap-4' }, [
				h(WireframePlaceholder, { width: 200, height: 150 }),
				h(WireframePlaceholder, { width: 200, height: 150 }),
				h(WireframePlaceholder, { width: 200, height: 150 }),
				h(WireframePlaceholder, { width: 200, height: 150 }),
			]),
	}),
};
