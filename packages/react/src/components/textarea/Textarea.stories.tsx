import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
	title: 'Forms/Textarea',
	component: Textarea.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Compound textarea with label, validation, and error display.',
			},
		},
	},
} satisfies Meta<typeof Textarea.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Textarea.Root className='flex max-w-xs flex-col gap-1.5'>
			<Textarea.Label className='text-sm font-medium text-black'>Message</Textarea.Label>
			<Textarea.Field
				placeholder='Type your message here...'
				rows={4}
				className='w-full rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
			/>
		</Textarea.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Textarea.Root
			isRequired
			errorMessage={{ required: 'This field is required' }}
			className='flex max-w-xs flex-col gap-1.5'>
			<Textarea.Label className='text-sm font-medium text-black'>Feedback</Textarea.Label>
			<Textarea.Field
				placeholder='Your feedback is important...'
				rows={4}
				className='w-full rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
			/>
			<Textarea.Error className='text-xs text-black' />
		</Textarea.Root>
	),
};

export const Complex: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<Textarea.Root value={value} onChange={setValue} className='flex max-w-xs flex-col gap-1.5'>
				<Textarea.Label className='text-sm font-medium text-black'>Bio</Textarea.Label>
				<p className='text-xs text-[#6b7280]'>Write a short bio about yourself.</p>
				<Textarea.Field
					placeholder='Tell us about yourself...'
					rows={4}
					maxLength={200}
					className='w-full rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
				/>
				<p className='text-right text-xs text-[#6b7280]'>{value.length}/200</p>
			</Textarea.Root>
		);
	},
};
