import type { Meta, StoryObj } from '@storybook/react-vite';
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
	render: () => <Skeleton className={`${baseCls} h-4 w-48`} />,
};

export const Composed: Story = {
	render: () => (
		<div className='flex flex-col gap-2 w-72'>
			<Skeleton className={`${baseCls} h-6 w-1/2`} />
			<Skeleton className={`${baseCls} h-4 w-full`} />
			<Skeleton className={`${baseCls} h-4 w-5/6`} />
			<Skeleton className={`${baseCls} h-4 w-2/3`} />
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div className='flex w-80 gap-3 rounded-[20px] border border-black bg-white p-4'>
			<Skeleton className={`${baseCls} h-12 w-12 rounded-full`} />
			<div className='flex-1 flex flex-col gap-2'>
				<Skeleton className={`${baseCls} h-4 w-1/2`} />
				<Skeleton className={`${baseCls} h-3 w-full`} />
				<Skeleton className={`${baseCls} h-3 w-3/4`} />
			</div>
		</div>
	),
};
