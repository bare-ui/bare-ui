import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { ProgressBar } from '.';

const meta = {
	title: 'Feedback/ProgressBar',
	component: ProgressBar,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Accessible progress indicator with role="progressbar" and ARIA attributes.',
			},
		},
	},
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const trackCls =
	'w-full overflow-hidden rounded-full bg-[#e5e5e5] [&_[data-part=fill]]:h-full [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:bg-black [&_[data-part=fill]]:transition-[width] [&_[data-part=fill]]:duration-300';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'w-80' }, [h(ProgressBar, { percentage: 60, class: ['h-2', trackCls].join(' ') })]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{ class: 'flex w-80 flex-col gap-3' },
				[0, 25, 50, 75, 100].map((p) =>
					h('div', { key: p, class: 'flex items-center gap-3' }, [
						h('div', { class: 'w-8 text-right text-xs text-[#6b7280]' }, `${p}%`),
						h(ProgressBar, { percentage: p, class: ['flex-1 h-2', trackCls].join(' ') }),
					]),
				),
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'w-80' }, [
				h('div', { class: 'mb-1 flex justify-between text-sm' }, [
					h('span', { class: 'font-medium text-black' }, 'Storage used'),
					h('span', { class: 'text-[#6b7280]' }, '68%'),
				]),
				h(ProgressBar, { percentage: 68, class: ['h-2', trackCls].join(' ') }),
				h('p', { class: 'mt-1 text-xs text-[#6b7280]' }, '6.8 GB of 10 GB used'),
			]),
	}),
};
