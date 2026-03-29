import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from './Dropdown'

const meta = {
	title: 'Components/Dropdown',
	component: Dropdown.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Dropdown.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Dropdown.Root className="relative inline-block">
			<Dropdown.Trigger className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
				Open Menu
			</Dropdown.Trigger>
			<Dropdown.Menu className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
				<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
					Profile
				</div>
				<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
					Settings
				</div>
				<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
					Sign out
				</div>
			</Dropdown.Menu>
		</Dropdown.Root>
	),
}

export const PositionLeft: Story = {
	render: () => (
		<div className="flex justify-end p-8">
			<Dropdown.Root className="relative inline-block">
				<Dropdown.Trigger className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
					Left Aligned
				</Dropdown.Trigger>
				<Dropdown.Menu
					position="left"
					className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
				>
					<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						Option A
					</div>
					<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						Option B
					</div>
					<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						Option C
					</div>
				</Dropdown.Menu>
			</Dropdown.Root>
		</div>
	),
}

export const PositionRight: Story = {
	render: () => (
		<div className="p-8">
			<Dropdown.Root className="relative inline-block">
				<Dropdown.Trigger className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
					Right Aligned
				</Dropdown.Trigger>
				<Dropdown.Menu
					position="right"
					className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
				>
					<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						Option A
					</div>
					<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						Option B
					</div>
					<div className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						Option C
					</div>
				</Dropdown.Menu>
			</Dropdown.Root>
		</div>
	),
}
