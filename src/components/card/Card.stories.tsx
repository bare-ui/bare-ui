import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
	title: 'Components/Card',
	component: Card,
	tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: 'This is a default card with some content inside.',
		className: 'rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700',
	},
}

export const Primary: Story = {
	args: {
		color: 'primary',
		children: 'This is a primary card.',
		className: 'rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800',
	},
}

export const Inverse: Story = {
	args: {
		color: 'inverse',
		children: 'This is an inverse card.',
		className: 'rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-gray-100',
	},
}

export const Colors: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Card
				color="default"
				className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700"
			>
				Default color card
			</Card>
			<Card
				color="primary"
				className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
			>
				Primary color card
			</Card>
			<Card
				color="inverse"
				className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-gray-100"
			>
				Inverse color card
			</Card>
		</div>
	),
}

export const XSmall: Story = {
	args: {
		size: 'xsmall',
		children: 'Extra small card',
		className: 'rounded border border-gray-200 bg-white p-2 text-xs text-gray-700',
	},
}

export const Small: Story = {
	args: {
		size: 'small',
		children: 'Small card',
		className: 'rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-700',
	},
}

export const Medium: Story = {
	args: {
		size: 'medium',
		children: 'Medium card',
		className: 'rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700',
	},
}

export const Large: Story = {
	args: {
		size: 'large',
		children: 'Large card',
		className: 'rounded-xl border border-gray-200 bg-white p-6 text-base text-gray-700',
	},
}

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Card
				size="xsmall"
				className="rounded border border-gray-200 bg-white p-2 text-xs text-gray-700"
			>
				Extra small
			</Card>
			<Card
				size="small"
				className="rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-700"
			>
				Small
			</Card>
			<Card
				size="medium"
				className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700"
			>
				Medium
			</Card>
			<Card
				size="large"
				className="rounded-xl border border-gray-200 bg-white p-6 text-base text-gray-700"
			>
				Large
			</Card>
		</div>
	),
}
