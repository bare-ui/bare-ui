import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Search } from './Search'
import type { SearchOption } from './Search.types'

const mockItems: SearchOption[] = [
	{ id: 1, title: 'React', subtitle: 'A JavaScript library for building user interfaces' },
	{ id: 2, title: 'Vue', subtitle: 'The progressive JavaScript framework' },
	{ id: 3, title: 'Angular', subtitle: 'Platform for building mobile and desktop apps' },
	{ id: 4, title: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
	{ id: 5, title: 'Next.js', subtitle: 'The React framework for production' },
]

const meta = {
	title: 'Components/Search',
	component: Search.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Search.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => {
		const [query, setQuery] = useState('')
		const filtered = mockItems.filter((item) =>
			item.title.toLowerCase().includes(query.toLowerCase()),
		)

		return (
			<Search.Root
				value={query}
				onSearchChange={setQuery}
				onSelect={(option) => alert(`Selected: ${option.title}`)}
				className="relative w-80"
			>
				<Search.Input
					placeholder="Search frameworks..."
					className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
				<Search.Content className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
					{filtered.map((item) => (
						<Search.Item
							key={item.id}
							option={item}
							className="cursor-pointer px-3 py-2 hover:bg-gray-100 data-[highlighted]:bg-blue-50"
						>
							<div className="text-sm font-medium text-gray-900">{item.title}</div>
							<div className="text-xs text-gray-500">{item.subtitle}</div>
						</Search.Item>
					))}
					<Search.Empty className="px-3 py-4 text-center text-sm text-gray-500">
						No results found
					</Search.Empty>
				</Search.Content>
			</Search.Root>
		)
	},
}

export const WithLoading: Story = {
	render: () => (
		<Search.Root loading className="relative w-80">
			<Search.Input
				placeholder="Search..."
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
			<Search.Content className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
				<div className="flex items-center justify-center px-3 py-4 text-sm text-gray-500">
					Loading...
				</div>
			</Search.Content>
		</Search.Root>
	),
}

export const EmptyState: Story = {
	render: () => (
		<Search.Root defaultOpen className="relative w-80">
			<Search.Input
				placeholder="Search..."
				className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			/>
			<Search.Content className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
				<Search.Empty className="px-3 py-6 text-center text-sm text-gray-500">
					No results found. Try a different search term.
				</Search.Empty>
			</Search.Content>
		</Search.Root>
	),
}
