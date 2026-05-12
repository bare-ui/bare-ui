import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Skeleton } from '.';

const meta = {
	title: 'Feedback/Skeleton',
	component: Skeleton,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Loading placeholder. Set loading=false to swap in your real content.' },
		},
	},
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseCls = 'animate-pulse rounded-[8px] bg-[#e5e5e5]';

export const Default: Story = {
	render: () => ({
		setup: () => () => h(Skeleton, { class: `${baseCls} h-4 w-48` }),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-2 w-72' }, [
				h(Skeleton, { class: `${baseCls} h-6 w-1/2` }),
				h(Skeleton, { class: `${baseCls} h-4 w-full` }),
				h(Skeleton, { class: `${baseCls} h-4 w-5/6` }),
				h(Skeleton, { class: `${baseCls} h-4 w-2/3` }),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex w-80 gap-3 rounded-[20px] border border-black bg-white p-4' }, [
				h(Skeleton, { class: `${baseCls} h-12 w-12 rounded-full` }),
				h('div', { class: 'flex-1 flex flex-col gap-2' }, [
					h(Skeleton, { class: `${baseCls} h-4 w-1/2` }),
					h(Skeleton, { class: `${baseCls} h-3 w-full` }),
					h(Skeleton, { class: `${baseCls} h-3 w-3/4` }),
				]),
			]),
	}),
};
