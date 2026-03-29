import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
	title: 'Components/ProgressBar',
	component: ProgressBar,
	tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Track + fill class helpers
const trackCls =
	'w-full overflow-hidden rounded-full bg-gray-200 [&_[data-part=fill]]:h-full [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:bg-blue-600 [&_[data-part=fill]]:transition-[width] [&_[data-part=fill]]:duration-300';

const sizeCls = {
	small: 'h-1',
	medium: 'h-2',
	large: 'h-4',
};

export const Default: Story = {
	render: () => (
		<div className='w-80'>
			<ProgressBar
				percentage={50}
				className={`${trackCls} ${sizeCls.medium}`}
			/>
		</div>
	),
};

export const Empty: Story = {
	render: () => (
		<div className='w-80'>
			<ProgressBar
				percentage={0}
				className={`${trackCls} ${sizeCls.medium}`}
			/>
		</div>
	),
};

export const Full: Story = {
	render: () => (
		<div className='w-80'>
			<ProgressBar
				percentage={100}
				className={`${trackCls} ${sizeCls.medium}`}
			/>
		</div>
	),
};

export const AllPercentages: Story = {
	render: () => (
		<div className='flex w-80 flex-col gap-3'>
			{[0, 25, 50, 75, 100].map((p) => (
				<div
					key={p}
					className='flex items-center gap-3'>
					<div className='w-8 text-right text-xs text-gray-500'>{p}%</div>
					<ProgressBar
						percentage={p}
						className={`flex-1 ${trackCls} ${sizeCls.medium}`}
					/>
				</div>
			))}
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className='flex w-80 flex-col gap-4'>
			<div>
				<p className='mb-1.5 text-xs text-gray-500'>Small (h-1)</p>
				<ProgressBar
					percentage={60}
					className={`${trackCls} ${sizeCls.small}`}
				/>
			</div>
			<div>
				<p className='mb-1.5 text-xs text-gray-500'>Medium (h-2)</p>
				<ProgressBar
					percentage={60}
					className={`${trackCls} ${sizeCls.medium}`}
				/>
			</div>
			<div>
				<p className='mb-1.5 text-xs text-gray-500'>Large (h-4)</p>
				<ProgressBar
					percentage={60}
					className={`${trackCls} ${sizeCls.large}`}
				/>
			</div>
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className='flex w-80 flex-col gap-3'>
			{[
				{ label: 'Blue', fill: 'bg-blue-600', value: 80 },
				{ label: 'Green', fill: 'bg-emerald-500', value: 65 },
				{ label: 'Amber', fill: 'bg-amber-500', value: 45 },
				{ label: 'Red', fill: 'bg-red-500', value: 30 },
				{ label: 'Purple', fill: 'bg-violet-500', value: 70 },
			].map(({ label, fill, value }) => (
				<div
					key={label}
					className='flex items-center gap-3'>
					<div className='w-12 text-right text-xs text-gray-500'>{label}</div>
					<ProgressBar
						percentage={value}
						className={`flex-1 overflow-hidden rounded-full bg-gray-200 h-2 [&_[data-part=fill]]:h-full [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:${fill}`}
					/>
				</div>
			))}
		</div>
	),
};

export const WithLabel: Story = {
	render: () => (
		<div className='w-80'>
			<div className='mb-1 flex justify-between text-sm'>
				<span className='font-medium text-gray-700'>Storage used</span>
				<span className='text-gray-500'>68%</span>
			</div>
			<ProgressBar
				percentage={68}
				className={`${trackCls} ${sizeCls.medium}`}
			/>
			<p className='mt-1 text-xs text-gray-400'>6.8 GB of 10 GB used</p>
		</div>
	),
};

export const Animated: Story = {
	render: () => {
		const [progress, setProgress] = useState(0);

		useEffect(() => {
			const timer = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 100) {
						clearInterval(timer);
						return 100;
					}
					return prev + 2;
				});
			}, 50);
			return () => clearInterval(timer);
		}, []);

		return (
			<div className='w-80'>
				<div className='mb-1 flex justify-between text-sm'>
					<span className='font-medium text-gray-700'>Installing…</span>
					<span className='text-gray-500'>{progress}%</span>
				</div>
				<ProgressBar
					percentage={progress}
					className={`${trackCls} ${sizeCls.medium}`}
				/>
			</div>
		);
	},
};

export const Steps: Story = {
	render: () => (
		<div className='w-80'>
			<div className='mb-1 flex justify-between text-sm'>
				<span className='font-medium text-gray-700'>Step 2 of 4</span>
				<span className='text-gray-500'>50%</span>
			</div>
			<ProgressBar
				percentage={50}
				className={`${trackCls} ${sizeCls.large}`}
			/>
		</div>
	),
};
