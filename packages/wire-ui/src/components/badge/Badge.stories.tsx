import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
	title: 'Components/Badge',
	component: Badge,
	tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const badgeCls =
	'inline-flex min-w-[20px] items-center justify-center rounded-full border-2 border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white';

export const Default: Story = {
	render: () => <Badge count={1} className={badgeCls} />,
};

export const ZeroCount: Story = {
	render: () => <Badge count={0} className={badgeCls} />,
};

export const NinePlus: Story = {
	render: () => <Badge count={15} className={badgeCls} />,
};

export const AllCounts: Story = {
	render: () => (
		<div className='flex items-center gap-3'>
			{[0, 1, 5, 9, 10, 99].map((n) => (
				<Badge key={n} count={n} className={badgeCls} />
			))}
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className='flex items-center gap-4'>
			{['Red', 'Blue', 'Green', 'Amber', 'Purple'].map((label) => (
				<div key={label} className='flex flex-col items-center gap-1'>
					<Badge count={5} className={badgeCls} />
					<span className='text-xs text-[#9ca3af]'>{label}</span>
				</div>
			))}
		</div>
	),
};

export const OnIcon: Story = {
	render: () => (
		<div className='flex items-center gap-8'>
			{/* Bell */}
			<div className='relative inline-flex'>
				<button className='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
					</svg>
				</button>
				<Badge count={3} className='absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full border-2 border-black bg-black px-1 py-0.5 text-[10px] font-bold leading-none text-white' />
			</div>

			{/* Chat */}
			<div className='relative inline-flex'>
				<button className='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
					</svg>
				</button>
				<Badge count={12} className='absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full border-2 border-black bg-black px-1 py-0.5 text-[10px] font-bold leading-none text-white' />
			</div>

			{/* Mail */}
			<div className='relative inline-flex'>
				<button className='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
					</svg>
				</button>
				<Badge count={99} className='absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full border-2 border-black bg-black px-1 py-0.5 text-[10px] font-bold leading-none text-white' />
			</div>
		</div>
	),
};

export const OnNavItem: Story = {
	render: () => (
		<nav className='w-56 rounded-[8px] border-2 border-black bg-white p-2'>
			{[
				{ label: 'Dashboard', count: 0 },
				{ label: 'Messages', count: 4 },
				{ label: 'Notifications', count: 12 },
				{ label: 'Settings', count: 0 },
			].map(({ label, count }) => (
				<a
					key={label}
					href='#'
					className='flex items-center justify-between rounded-[8px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'
					onClick={(e) => e.preventDefault()}>
					<span>{label}</span>
					{count > 0 && (
						<Badge count={count} className='inline-flex min-w-[20px] items-center justify-center rounded-full border-2 border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white' />
					)}
				</a>
			))}
		</nav>
	),
};
