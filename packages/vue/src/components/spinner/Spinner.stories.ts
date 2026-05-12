import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Spinner } from '.';

const meta = {
	title: 'Feedback/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Accessible loading indicator with role=status and visually-hidden label.' },
		},
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

const Ring = (props: { size?: number }) => {
	const size = props.size ?? 24;
	return h(
		'svg',
		{
			width: size,
			height: size,
			viewBox: '0 0 24 24',
			fill: 'none',
			style: { animation: 'spin 1s linear infinite' },
		},
		[
			h('style', {}, '@keyframes spin { to { transform: rotate(360deg); } }'),
			h('circle', { cx: 12, cy: 12, r: 10, stroke: '#e5e5e5', 'stroke-width': 2 }),
			h('path', {
				d: 'M22 12a10 10 0 0 0-10-10',
				stroke: 'black',
				'stroke-width': 2,
				'stroke-linecap': 'round',
			}),
		],
	);
};

export const Default: Story = {
	render: () => ({
		setup: () => () => h(Spinner, {}, () => h(Ring)),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-center gap-6' }, [
				h(Spinner, { label: 'Small' }, () => h(Ring, { size: 16 })),
				h(Spinner, { label: 'Medium' }, () => h(Ring, { size: 24 })),
				h(Spinner, { label: 'Large' }, () => h(Ring, { size: 40 })),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{
					class: 'flex items-center gap-3 rounded-[8px] border border-black bg-white px-4 py-3 text-sm text-black',
				},
				[
					h(Spinner, { label: 'Saving changes' }, () => h(Ring, { size: 18 })),
					h('span', {}, 'Saving changes…'),
				],
			),
	}),
};
