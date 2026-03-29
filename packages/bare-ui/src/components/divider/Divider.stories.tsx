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

// ---------------------------------------------------------------------------
// Default — horizontal, decorative
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: () => <Divider className='h-px w-full bg-gray-200' />,
};

// ---------------------------------------------------------------------------
// Horizontal
// ---------------------------------------------------------------------------

export const Horizontal: Story = {
	render: () => (
		<div className='flex w-64 flex-col gap-4'>
			<p className='text-sm text-gray-600'>Above the divider</p>
			<Divider className='h-px w-full bg-gray-200' />
			<p className='text-sm text-gray-600'>Below the divider</p>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Vertical
// ---------------------------------------------------------------------------

export const Vertical: Story = {
	render: () => (
		<div className='flex h-8 items-center gap-4'>
			<span className='text-sm text-gray-600'>Left</span>
			<Divider
				orientation='vertical'
				className='h-full w-px bg-gray-200'
			/>
			<span className='text-sm text-gray-600'>Right</span>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Semantic (decorative={false}) — announced by screen readers
// ---------------------------------------------------------------------------

export const Semantic: Story = {
	render: () => (
		<div className='flex w-64 flex-col gap-4'>
			<section>
				<h3 className='text-sm font-semibold text-gray-900'>Section A</h3>
				<p className='text-sm text-gray-600'>Content for section A.</p>
			</section>
			<Divider
				decorative={false}
				className='h-px w-full bg-gray-200'
			/>
			<section>
				<h3 className='text-sm font-semibold text-gray-900'>Section B</h3>
				<p className='text-sm text-gray-600'>Content for section B.</p>
			</section>
		</div>
	),
};

// ---------------------------------------------------------------------------
// With label — custom content alongside divider
// ---------------------------------------------------------------------------

export const WithLabel: Story = {
	render: () => (
		<div className='flex w-64 items-center gap-3'>
			<Divider className='h-px flex-1 bg-gray-200' />
			<span className='text-xs text-gray-400'>OR</span>
			<Divider className='h-px flex-1 bg-gray-200' />
		</div>
	),
};

// ---------------------------------------------------------------------------
// Both orientations side by side
// ---------------------------------------------------------------------------

export const Orientations: Story = {
	render: () => (
		<div className='flex flex-col gap-8'>
			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-400'>Horizontal</p>
				<div className='flex flex-col gap-3'>
					<p className='text-sm text-gray-600'>Item one</p>
					<Divider className='h-px w-full bg-gray-200' />
					<p className='text-sm text-gray-600'>Item two</p>
					<Divider className='h-px w-full bg-gray-200' />
					<p className='text-sm text-gray-600'>Item three</p>
				</div>
			</div>

			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-400'>Vertical</p>
				<div className='flex h-6 items-center gap-3'>
					{['Home', 'About', 'Contact'].map((label, i, arr) => (
						<React.Fragment key={label}>
							<span className='text-sm text-gray-600'>{label}</span>
							{i < arr.length - 1 && (
								<Divider
									orientation='vertical'
									className='h-full w-px bg-gray-200'
								/>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	),
};
