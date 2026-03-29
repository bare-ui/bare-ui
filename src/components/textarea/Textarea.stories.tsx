import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta = {
	title: 'Components/Textarea',
	component: Textarea.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Textarea.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Textarea.Root className="w-80">
			<Textarea.Field
				placeholder="Write something..."
				rows={4}
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
		</Textarea.Root>
	),
}

export const WithLabel: Story = {
	render: () => (
		<Textarea.Root className="flex w-80 flex-col gap-1.5">
			<Textarea.Label className="text-sm font-medium text-gray-700">Message</Textarea.Label>
			<Textarea.Field
				placeholder="Type your message here..."
				rows={4}
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
		</Textarea.Root>
	),
}

export const Required: Story = {
	render: () => (
		<Textarea.Root
			isRequired
			errorMessage={{ required: 'This field is required' }}
			className="flex w-80 flex-col gap-1.5"
		>
			<Textarea.Label className="text-sm font-medium text-gray-700">Feedback</Textarea.Label>
			<Textarea.Field
				placeholder="Your feedback is important..."
				rows={4}
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
			<Textarea.Error className="text-xs text-red-500" />
		</Textarea.Root>
	),
}
