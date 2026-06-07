import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For, Show } from 'solid-js';
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

const BellIcon = () => (
	<svg
		class='h-6 w-6'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'>
		<path
			stroke-linecap='round'
			stroke-linejoin='round'
			stroke-width='2'
			d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
		/>
	</svg>
);

const ChatIcon = () => (
	<svg
		class='h-6 w-6'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'>
		<path
			stroke-linecap='round'
			stroke-linejoin='round'
			stroke-width='2'
			d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
		/>
	</svg>
);

const MailIcon = () => (
	<svg
		class='h-6 w-6'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'>
		<path
			stroke-linecap='round'
			stroke-linejoin='round'
			stroke-width='2'
			d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
		/>
	</svg>
);

const badgeCls =
	'absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full border border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white';

export const Default: Story = {
	render: () => (
		<div class='relative inline-flex'>
			<button
				aria-label='Notifications'
				class='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
				<BellIcon />
			</button>
			<Badge
				count={3}
				class={badgeCls}
			/>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex items-center gap-8'>
			<div class='relative inline-flex'>
				<button
					aria-label='Notifications'
					class='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					<BellIcon />
				</button>
				<Badge
					count={3}
					class={badgeCls}
				/>
			</div>
			<div class='relative inline-flex'>
				<button
					aria-label='Messages'
					class='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					<ChatIcon />
				</button>
				<Badge
					count={12}
					class={badgeCls}
				/>
			</div>
			<div class='relative inline-flex'>
				<button
					aria-label='Mail'
					class='rounded-full p-2 text-black hover:bg-[#f5f5f5]'>
					<MailIcon />
				</button>
				<Badge
					count={99}
					class={badgeCls}
				/>
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
			<nav class='w-56 rounded-[8px] border border-black bg-white p-2'>
				<For each={navItems}>
					{(item) => (
						<a
							href='#'
							class='flex items-center justify-between rounded-[8px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'
							onClick={(e) => e.preventDefault()}>
							<span>{item.label}</span>
							<Show when={item.count > 0}>
								<Badge
									count={item.count}
									class='inline-flex min-w-[20px] items-center justify-center rounded-full border border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white'
								/>
							</Show>
						</a>
					)}
				</For>
			</nav>
		);
	},
};
