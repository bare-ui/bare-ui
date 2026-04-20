import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
	title: 'Feedback/Badge',
	component: Badge,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Numeric count badge capped at 9+.',
			},
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const bellIcon = (
	<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
		<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
	</svg>
);

const chatIcon = (
	<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
		<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
	</svg>
);

const mailIcon = (
	<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
		<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
	</svg>
);

const badgeCls =
	'absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full border border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white';

export const Default: Story = {
	render: () => (
		<div className='relative inline-flex'>
			<button className='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
				{bellIcon}
			</button>
			<Badge count={3} className={badgeCls} />
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div className='flex items-center gap-8'>
			<div className='relative inline-flex'>
				<button className='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					{bellIcon}
				</button>
				<Badge count={3} className={badgeCls} />
			</div>
			<div className='relative inline-flex'>
				<button className='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					{chatIcon}
				</button>
				<Badge count={12} className={badgeCls} />
			</div>
			<div className='relative inline-flex'>
				<button className='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					{mailIcon}
				</button>
				<Badge count={99} className={badgeCls} />
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const navItems = [
			{ label: 'Dashboard', count: 0 },
			{ label: 'Messages', count: 4 },
			{ label: 'Notifications', count: 12 },
			{ label: 'Settings', count: 0 },
		];

		return (
			<nav className='w-56 rounded-[8px] border border-black bg-white p-2'>
				{navItems.map(({ label, count }) => (
					<a
						key={label}
						href='#'
						className='flex items-center justify-between rounded-[8px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'
						onClick={(e) => e.preventDefault()}>
						<span>{label}</span>
						{count > 0 && (
							<Badge
								count={count}
								className='inline-flex min-w-[20px] items-center justify-center rounded-full border border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white'
							/>
						)}
					</a>
				))}
			</nav>
		);
	},
};
