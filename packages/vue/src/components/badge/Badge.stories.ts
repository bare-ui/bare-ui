import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Badge } from './Badge';

const meta = {
	title: 'Components/Badge',
	component: Badge,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Numeric count badge capped at 9+.',
			},
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const badgeCls =
	'inline-flex min-w-[20px] items-center justify-center rounded-full border-2 border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white';

export const Default: Story = {
	render: () => ({
		setup: () => () => h(Badge, { count: 1, class: badgeCls }),
	}),
};

export const ZeroCount: Story = {
	render: () => ({
		setup: () => () => h(Badge, { count: 0, class: badgeCls }),
	}),
};

export const NinePlus: Story = {
	render: () => ({
		setup: () => () => h(Badge, { count: 15, class: badgeCls }),
	}),
};

export const AllCounts: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{ class: 'flex items-center gap-3' },
				[0, 1, 5, 9, 10, 99].map((n) => h(Badge, { key: n, count: n, class: badgeCls })),
			),
	}),
};
