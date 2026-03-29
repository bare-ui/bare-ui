import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
	title: 'Components/Input',
	component: Input.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Input.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Input.Root className="w-72">
			<Input.Field
				placeholder="Enter text..."
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
		</Input.Root>
	),
}

export const WithLabel: Story = {
	render: () => (
		<Input.Root className="flex w-72 flex-col gap-1.5">
			<Input.Label className="text-sm font-medium text-gray-700">Full Name</Input.Label>
			<Input.Field
				placeholder="John Doe"
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
		</Input.Root>
	),
}

export const Required: Story = {
	render: () => (
		<Input.Root isRequired className="flex w-72 flex-col gap-1.5">
			<Input.Label className="text-sm font-medium text-gray-700">Username</Input.Label>
			<Input.Field
				placeholder="Required field"
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
			<Input.Error className="text-xs text-red-500">This field is required</Input.Error>
		</Input.Root>
	),
}

export const WithEmailValidation: Story = {
	render: () => (
		<Input.Root
			validation="email"
			errorMessage={{
				email: 'Please enter a valid email address',
				required: 'Email is required',
			}}
			isRequired
			className="flex w-72 flex-col gap-1.5"
		>
			<Input.Label className="text-sm font-medium text-gray-700">Email</Input.Label>
			<Input.Field
				type="email"
				placeholder="you@example.com"
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
			<Input.Error className="text-xs text-red-500" />
		</Input.Root>
	),
}

export const ErrorState: Story = {
	render: () => (
		<Input.Root
			invalidType="custom"
			defaultValue="admin"
			errorMessage={{ custom: 'This username is already taken' }}
			className="flex w-72 flex-col gap-1.5"
		>
			<Input.Label className="text-sm font-medium text-gray-700">Username</Input.Label>
			<Input.Field className="w-full rounded-md border border-red-500 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
			<Input.Error className="text-xs text-red-500" />
		</Input.Root>
	),
}

export const SuccessState: Story = {
	render: () => (
		<Input.Root isSuccess defaultValue="available_user" className="flex w-72 flex-col gap-1.5">
			<Input.Label className="text-sm font-medium text-gray-700">Username</Input.Label>
			<Input.Field className="w-full rounded-md border border-green-500 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
			<span className="text-xs text-green-600">Username is available</span>
		</Input.Root>
	),
}
