import type { Meta, StoryObj } from '@storybook/react-vite';
import { List } from './List';

const meta = {
	title: 'Components/List',
	component: List,
	tags: ['autodocs'],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unordered: Story = {
	render: () => (
		<List className='list-disc space-y-1 pl-5 text-sm text-black'>
			<li>First item</li>
			<li>Second item</li>
			<li>Third item</li>
		</List>
	),
};

export const Ordered: Story = {
	render: () => (
		<List
			isOrdered
			className='list-decimal space-y-1 pl-5 text-sm text-black'>
			<li>First step</li>
			<li>Second step</li>
			<li>Third step</li>
		</List>
	),
};

export const WithDividers: Story = {
	render: () => (
		<List className='w-64 divide-y divide-[#d4d4d4] overflow-hidden rounded-[8px] border-2 border-black bg-white'>
			{['Inbox', 'Sent', 'Drafts', 'Trash', 'Spam'].map((item) => (
				<li
					key={item}
					className='cursor-pointer px-4 py-3 text-sm text-black hover:bg-[#f5f5f5]'>
					{item}
				</li>
			))}
		</List>
	),
};

export const WithIconsAndDividers: Story = {
	render: () => (
		<List className='w-72 divide-y divide-[#d4d4d4] overflow-hidden rounded-[8px] border-2 border-black bg-white'>
			{[
				{ label: 'Profile', icon: '👤', desc: 'Manage your account' },
				{ label: 'Notifications', icon: '🔔', desc: 'Configure alerts' },
				{ label: 'Privacy', icon: '🔒', desc: 'Control your data' },
				{ label: 'Help', icon: '❓', desc: 'Get support' },
			].map(({ label, icon, desc }) => (
				<li
					key={label}
					className='flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-[#f5f5f5]'>
					<span className='text-xl'>{icon}</span>
					<div>
						<p className='text-sm font-medium text-black'>{label}</p>
						<p className='text-xs text-[#9ca3af]'>{desc}</p>
					</div>
					<svg
						className='ml-auto h-4 w-4 text-black'
						viewBox='0 0 20 20'
						fill='currentColor'>
						<path
							fillRule='evenodd'
							d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
							clipRule='evenodd'
						/>
					</svg>
				</li>
			))}
		</List>
	),
};

export const Striped: Story = {
	render: () => (
		<List className='w-64 overflow-hidden rounded-[8px] border-2 border-black text-sm [&>li:nth-child(odd)]:bg-[#f5f5f5] [&>li]:px-4 [&>li]:py-2.5 [&>li]:text-black'>
			<li>Alice Johnson</li>
			<li>Bob Smith</li>
			<li>Carol White</li>
			<li>David Brown</li>
			<li>Eva Martinez</li>
		</List>
	),
};

export const SimpleMenu: Story = {
	render: () => (
		<List className='w-48 overflow-hidden rounded-[8px] border-2 border-black bg-white p-1'>
			{['Cut', 'Copy', 'Paste', 'Delete'].map((item) => (
				<li
					key={item}
					className='cursor-pointer rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
					{item}
				</li>
			))}
		</List>
	),
};

export const Checklist: Story = {
	render: () => (
		<List className='w-64 space-y-2'>
			{[
				{ label: 'Design mockups', done: true },
				{ label: 'Write unit tests', done: true },
				{ label: 'Implement API', done: false },
				{ label: 'Deploy to staging', done: false },
			].map(({ label, done }) => (
				<li
					key={label}
					className='flex items-center gap-2.5 text-sm'>
					<span
						className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
							done ? 'border-black bg-black text-white' : 'border-black bg-white'
						}`}>
						{done && (
							<svg
								className='h-3 w-3'
								viewBox='0 0 12 12'
								fill='currentColor'>
								<path
									d='M3.5 6L5.5 8L8.5 4.5'
									stroke='white'
									strokeWidth='1.5'
									fill='none'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						)}
					</span>
					<span className={done ? 'text-[#9ca3af] line-through' : 'text-black'}>{label}</span>
				</li>
			))}
		</List>
	),
};

export const Horizontal: Story = {
	render: () => (
		<List className='flex gap-1 overflow-hidden rounded-[8px] border-2 border-black bg-[#f5f5f5] p-1'>
			{['All', 'Active', 'Completed', 'Archived'].map((tab) => (
				<li
					key={tab}
					className={`cursor-pointer rounded-[6px] px-3 py-1.5 text-sm font-medium ${
						tab === 'All' ? 'bg-black text-white' : 'text-[#9ca3af] hover:text-black'
					}`}>
					{tab}
				</li>
			))}
		</List>
	),
};
