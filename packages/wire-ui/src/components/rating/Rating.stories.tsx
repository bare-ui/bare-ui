import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating } from './Rating';

const meta = {
	title: 'Components/Rating',
	component: Rating,
	tags: ['autodocs'],
	argTypes: {
		value: { control: 'number' },
		defaultValue: { control: 'number' },
		max: { control: 'number' },
		disabled: { control: 'boolean' },
		readOnly: { control: 'boolean' },
		onChange: { action: 'changed' },
		starClassName: { control: 'text' },
		className: { control: 'text' },
	},
	parameters: {
		controls: {
			include: ['value', 'defaultValue', 'max', 'disabled', 'readOnly', 'onChange', 'starClassName', 'className'],
		},
	},
	parameters: {
		docs: {
			description: {
				component: 'Star rating with hover preview, read-only, and disabled modes.',
			},
		},
	},
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

const starCls =
	'size-6 cursor-pointer text-[#e5e5e5] outline-none transition-colors data-[highlighted]:text-black data-[filled]:text-black hover:scale-110 data-[disabled]:cursor-default data-[disabled]:opacity-50';

export const Default: Story = {
	render: () => (
		<Rating
			defaultValue={3}
			onChange={(v) => console.log('rating:', v)}
			className='flex gap-0.5'
			starClassName={starCls}
		/>
	),
};

export const Unrated: Story = {
	render: () => (
		<Rating onChange={(v) => console.log('rating:', v)} className='flex gap-0.5' starClassName={starCls} />
	),
};

export const ReadOnly: Story = {
	render: () => (
		<Rating
			value={4}
			readOnly
			className='flex gap-0.5'
			starClassName='size-6 cursor-default text-[#e5e5e5] data-[filled]:text-black'
		/>
	),
};

export const WithLabel: Story = {
	render: () => {
		const [value, setValue] = useState(0);
		const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];

		return (
			<div className='flex flex-col items-start gap-2'>
				<Rating value={value} onChange={setValue} className='flex gap-0.5' starClassName={starCls} />
				<p className='text-sm text-[#9ca3af]'>
					{value > 0 ? <span className='font-medium text-black'>{labels[value]}</span> : 'Select a rating'}
				</p>
			</div>
		);
	},
};

export const WithCount: Story = {
	render: () => (
		<div className='flex items-center gap-2'>
			<Rating
				value={4}
				readOnly
				className='flex gap-0.5'
				starClassName='size-4 cursor-default text-[#e5e5e5] data-[filled]:text-black'
			/>
			<span className='text-sm font-medium text-black'>4.0</span>
			<span className='text-sm text-[#9ca3af]'>(128 reviews)</span>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center gap-3'>
				<span className='w-12 text-xs text-[#9ca3af]'>Small</span>
				<Rating
					defaultValue={3}
					className='flex gap-0.5'
					starClassName='size-4 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black'
				/>
			</div>
			<div className='flex items-center gap-3'>
				<span className='w-12 text-xs text-[#9ca3af]'>Medium</span>
				<Rating defaultValue={3} className='flex gap-0.5' starClassName={starCls} />
			</div>
			<div className='flex items-center gap-3'>
				<span className='w-12 text-xs text-[#9ca3af]'>Large</span>
				<Rating
					defaultValue={3}
					className='flex gap-0.5'
					starClassName='size-9 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black'
				/>
			</div>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<Rating
			defaultValue={2}
			disabled
			className='flex gap-0.5'
			starClassName='size-6 cursor-default text-[#e5e5e5] data-[filled]:text-black data-[disabled]:opacity-40'
		/>
	),
};
