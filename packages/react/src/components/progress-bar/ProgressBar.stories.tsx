import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
	title: 'Components/ProgressBar',
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
	'w-full overflow-hidden rounded-[8px] border-2 border-black bg-[#e5e5e5] [&_[data-part=fill]]:h-full [&_[data-part=fill]]:rounded-[6px] [&_[data-part=fill]]:bg-black [&_[data-part=fill]]:transition-[width] [&_[data-part=fill]]:duration-300';

const sizeCls = {
	small: 'h-1',
	medium: 'h-2',
	large: 'h-4',
};

export const Default: Story = {
	render: () => (
		<div className='w-80'>
			<ProgressBar percentage={50} className={[trackCls, sizeCls.medium].join(' ')} />
		</div>
	),
};

export const Empty: Story = {
	render: () => (
		<div className='w-80'>
			<ProgressBar percentage={0} className={[trackCls, sizeCls.medium].join(' ')} />
		</div>
	),
};

export const Full: Story = {
	render: () => (
		<div className='w-80'>
			<ProgressBar percentage={100} className={[trackCls, sizeCls.medium].join(' ')} />
		</div>
	),
};

export const AllPercentages: Story = {
	render: () => (
		<div className='flex w-80 flex-col gap-3'>
			{[0, 25, 50, 75, 100].map((p) => (
				<div key={p} className='flex items-center gap-3'>
					<div className='w-8 text-right text-xs text-[#9ca3af]'>{p}%</div>
					<ProgressBar percentage={p} className={['flex-1', trackCls, sizeCls.medium].join(' ')} />
				</div>
			))}
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className='flex w-80 flex-col gap-4'>
			<div>
				<p className='mb-1.5 text-xs text-[#9ca3af]'>Small (h-1)</p>
				<ProgressBar percentage={60} className={[trackCls, sizeCls.small].join(' ')} />
			</div>
			<div>
				<p className='mb-1.5 text-xs text-[#9ca3af]'>Medium (h-2)</p>
				<ProgressBar percentage={60} className={[trackCls, sizeCls.medium].join(' ')} />
			</div>
			<div>
				<p className='mb-1.5 text-xs text-[#9ca3af]'>Large (h-4)</p>
				<ProgressBar percentage={60} className={[trackCls, sizeCls.large].join(' ')} />
			</div>
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className='flex w-80 flex-col gap-3'>
			{[
				{ label: 'Blue', value: 80 },
				{ label: 'Green', value: 65 },
				{ label: 'Amber', value: 45 },
				{ label: 'Red', value: 30 },
				{ label: 'Purple', value: 70 },
			].map(({ label, value }) => (
				<div key={label} className='flex items-center gap-3'>
					<div className='w-12 text-right text-xs text-[#9ca3af]'>{label}</div>
					<ProgressBar percentage={value} className={['flex-1', trackCls, sizeCls.medium].join(' ')} />
				</div>
			))}
		</div>
	),
};

export const WithLabel: Story = {
	render: () => (
		<div className='w-80'>
			<div className='mb-1 flex justify-between text-sm'>
				<span className='font-medium text-black'>Storage used</span>
				<span className='text-[#9ca3af]'>68%</span>
			</div>
			<ProgressBar percentage={68} className={[trackCls, sizeCls.medium].join(' ')} />
			<p className='mt-1 text-xs text-[#9ca3af]'>6.8 GB of 10 GB used</p>
		</div>
	),
};

export const Animated: Story = {
	render: () => {
		const [progress, setProgress] = useState(0);

		useEffect(() => {
			const timer = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 100) { clearInterval(timer); return 100; }
					return prev + 2;
				});
			}, 50);
			return () => clearInterval(timer);
		}, []);

		return (
			<div className='w-80'>
				<div className='mb-1 flex justify-between text-sm'>
					<span className='font-medium text-black'>Installing…</span>
					<span className='text-[#9ca3af]'>{progress}%</span>
				</div>
				<ProgressBar percentage={progress} className={[trackCls, sizeCls.medium].join(' ')} />
			</div>
		);
	},
};

export const Steps: Story = {
	render: () => (
		<div className='w-80'>
			<div className='mb-1 flex justify-between text-sm'>
				<span className='font-medium text-black'>Step 2 of 4</span>
				<span className='text-[#9ca3af]'>50%</span>
			</div>
			<ProgressBar percentage={50} className={[trackCls, sizeCls.large].join(' ')} />
		</div>
	),
};
