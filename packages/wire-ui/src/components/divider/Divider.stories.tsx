import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta = {
	title: 'Components/Divider',
	component: Divider,
	tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Divider className='h-[2px] w-full bg-black' />,
};

export const Horizontal: Story = {
	render: () => (
		<div className='flex w-64 flex-col gap-4'>
			<p className='text-sm text-black'>Above the divider</p>
			<Divider className='h-[2px] w-full bg-black' />
			<p className='text-sm text-black'>Below the divider</p>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className='flex h-8 items-center gap-4'>
			<span className='text-sm text-black'>Left</span>
			<Divider orientation='vertical' className='h-full w-[2px] bg-black' />
			<span className='text-sm text-black'>Right</span>
		</div>
	),
};

export const Semantic: Story = {
	render: () => (
		<div className='flex w-64 flex-col gap-4'>
			<section>
				<h3 className='text-sm font-semibold text-black'>Section A</h3>
				<p className='text-sm text-black'>Content for section A.</p>
			</section>
			<Divider decorative={false} className='h-[2px] w-full bg-black' />
			<section>
				<h3 className='text-sm font-semibold text-black'>Section B</h3>
				<p className='text-sm text-black'>Content for section B.</p>
			</section>
		</div>
	),
};

export const WithLabel: Story = {
	render: () => (
		<div className='flex w-64 items-center gap-3'>
			<Divider className='h-[2px] flex-1 bg-black' />
			<span className='text-xs text-[#9ca3af]'>OR</span>
			<Divider className='h-[2px] flex-1 bg-black' />
		</div>
	),
};

export const Orientations: Story = {
	render: () => (
		<div className='flex flex-col gap-8'>
			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-[#9ca3af]'>Horizontal</p>
				<div className='flex flex-col gap-3'>
					<p className='text-sm text-black'>Item one</p>
					<Divider className='h-[2px] w-full bg-black' />
					<p className='text-sm text-black'>Item two</p>
					<Divider className='h-[2px] w-full bg-black' />
					<p className='text-sm text-black'>Item three</p>
				</div>
			</div>

			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-[#9ca3af]'>Vertical</p>
				<div className='flex h-6 items-center gap-3'>
					{['Home', 'About', 'Contact'].map((label, i, arr) => (
						<React.Fragment key={label}>
							<span className='text-sm text-black'>{label}</span>
							{i < arr.length - 1 && (
								<Divider orientation='vertical' className='h-full w-[2px] bg-black' />
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	),
};
