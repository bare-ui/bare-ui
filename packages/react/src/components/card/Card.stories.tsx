import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
	title: 'Components/Card',
	component: Card,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Unstyled container with optional data-color and data-size attributes.',
			},
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'This is a default card with some content inside.',
		className: 'rounded-[8px] border-2 border-black bg-white p-4 text-sm text-black',
	},
};

export const Primary: Story = {
	args: {
		color: 'primary',
		children: 'This is a primary card.',
		className: 'rounded-[8px] border-2 border-black bg-[#f5f5f5] p-4 text-sm text-black',
	},
};

export const Inverse: Story = {
	args: {
		color: 'inverse',
		children: 'This is an inverse card.',
		className: 'rounded-[8px] border-2 border-black bg-black p-4 text-sm text-white',
	},
};

export const Colors: Story = {
	render: () => (
		<div className='flex flex-col gap-4'>
			<Card color='default' className='rounded-[8px] border-2 border-black bg-white p-4 text-sm text-black'>
				Default color card
			</Card>
			<Card color='primary' className='rounded-[8px] border-2 border-black bg-[#f5f5f5] p-4 text-sm text-black'>
				Primary color card
			</Card>
			<Card color='inverse' className='rounded-[8px] border-2 border-black bg-black p-4 text-sm text-white'>
				Inverse color card
			</Card>
		</div>
	),
};

export const XSmall: Story = {
	args: {
		size: 'xsmall',
		children: 'Extra small card',
		className: 'rounded-[8px] border-2 border-black bg-white p-2 text-xs text-black',
	},
};

export const Small: Story = {
	args: {
		size: 'small',
		children: 'Small card',
		className: 'rounded-[8px] border-2 border-black bg-white p-3 text-sm text-black',
	},
};

export const Medium: Story = {
	args: {
		size: 'medium',
		children: 'Medium card',
		className: 'rounded-[20px] border-[3px] border-black bg-white p-4 text-sm text-black',
	},
};

export const Large: Story = {
	args: {
		size: 'large',
		children: 'Large card',
		className: 'rounded-[20px] border-[3px] border-black bg-white p-6 text-base text-black',
	},
};

export const Sizes: Story = {
	render: () => (
		<div className='flex flex-col gap-4'>
			<Card size='xsmall' className='rounded-[8px] border-2 border-black bg-white p-2 text-xs text-black'>
				Extra small
			</Card>
			<Card size='small' className='rounded-[8px] border-2 border-black bg-white p-3 text-sm text-black'>
				Small
			</Card>
			<Card size='medium' className='rounded-[20px] border-[3px] border-black bg-white p-4 text-sm text-black'>
				Medium
			</Card>
			<Card size='large' className='rounded-[20px] border-[3px] border-black bg-white p-6 text-base text-black'>
				Large
			</Card>
		</div>
	),
};
