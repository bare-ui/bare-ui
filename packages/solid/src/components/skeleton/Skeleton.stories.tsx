import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Skeleton } from './Skeleton';

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
	render: () => <Skeleton class={`${baseCls} h-4 w-48`} />,
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-2 w-72'>
			<Skeleton class={`${baseCls} h-6 w-1/2`} />
			<Skeleton class={`${baseCls} h-4 w-full`} />
			<Skeleton class={`${baseCls} h-4 w-5/6`} />
			<Skeleton class={`${baseCls} h-4 w-2/3`} />
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='flex w-80 gap-3 rounded-[20px] border border-black bg-white p-4'>
			<Skeleton class={`${baseCls} h-12 w-12 rounded-full`} />
			<div class='flex-1 flex flex-col gap-2'>
				<Skeleton class={`${baseCls} h-4 w-1/2`} />
				<Skeleton class={`${baseCls} h-3 w-full`} />
				<Skeleton class={`${baseCls} h-3 w-3/4`} />
			</div>
		</div>
	),
};
