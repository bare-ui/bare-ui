import type { Meta, StoryObj } from '@storybook/react-vite'
import { List } from './List'

const meta = {
	title: 'Components/List',
	component: List,
	tags: ['autodocs'],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Unordered: Story = {
	render: () => (
		<List className="list-disc space-y-1 pl-5 text-sm text-gray-700">
			<li>First item</li>
			<li>Second item</li>
			<li>Third item</li>
		</List>
	),
}

export const Ordered: Story = {
	render: () => (
		<List isOrdered className="list-decimal space-y-1 pl-5 text-sm text-gray-700">
			<li>First step</li>
			<li>Second step</li>
			<li>Third step</li>
		</List>
	),
}

export const WithDividers: Story = {
	render: () => (
		<List className="w-64 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
			{['Inbox', 'Sent', 'Drafts', 'Trash', 'Spam'].map((item) => (
				<li
					key={item}
					className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					{item}
				</li>
			))}
		</List>
	),
}

export const WithIconsAndDividers: Story = {
	render: () => (
		<List className="w-72 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
			{[
				{ label: 'Profile', icon: '👤', desc: 'Manage your account' },
				{ label: 'Notifications', icon: '🔔', desc: 'Configure alerts' },
				{ label: 'Privacy', icon: '🔒', desc: 'Control your data' },
				{ label: 'Help', icon: '❓', desc: 'Get support' },
			].map(({ label, icon, desc }) => (
				<li
					key={label}
					className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
				>
					<span className="text-xl">{icon}</span>
					<div>
						<p className="text-sm font-medium text-gray-900">{label}</p>
						<p className="text-xs text-gray-500">{desc}</p>
					</div>
					<svg
						className="ml-auto h-4 w-4 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
							clipRule="evenodd"
						/>
					</svg>
				</li>
			))}
		</List>
	),
}

export const Striped: Story = {
	render: () => (
		<List className="w-64 overflow-hidden rounded-lg border border-gray-200 text-sm [&>li:nth-child(odd)]:bg-gray-50 [&>li]:px-4 [&>li]:py-2.5 [&>li]:text-gray-700">
			<li>Alice Johnson</li>
			<li>Bob Smith</li>
			<li>Carol White</li>
			<li>David Brown</li>
			<li>Eva Martinez</li>
		</List>
	),
}

export const SimpleMenu: Story = {
	render: () => (
		<List className="w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
			{['Cut', 'Copy', 'Paste', 'Delete'].map((item) => (
				<li
					key={item}
					className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
				>
					{item}
				</li>
			))}
		</List>
	),
}

export const Checklist: Story = {
	render: () => (
		<List className="w-64 space-y-2">
			{[
				{ label: 'Design mockups', done: true },
				{ label: 'Write unit tests', done: true },
				{ label: 'Implement API', done: false },
				{ label: 'Deploy to staging', done: false },
			].map(({ label, done }) => (
				<li key={label} className="flex items-center gap-2.5 text-sm">
					<span
						className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
							done
								? 'border-emerald-500 bg-emerald-500 text-white'
								: 'border-gray-300 bg-white'
						}`}
					>
						{done && (
							<svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
								<path
									d="M3.5 6L5.5 8L8.5 4.5"
									stroke="white"
									strokeWidth="1.5"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</span>
					<span className={done ? 'text-gray-400 line-through' : 'text-gray-700'}>
						{label}
					</span>
				</li>
			))}
		</List>
	),
}

export const Horizontal: Story = {
	render: () => (
		<List className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
			{['All', 'Active', 'Completed', 'Archived'].map((tab) => (
				<li
					key={tab}
					className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium ${
						tab === 'All'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					{tab}
				</li>
			))}
		</List>
	),
}
