import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { List } from './List';

const meta = {
	title: 'Layout/List',
	component: List,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Semantic list element with no opinions about styling.',
			},
		},
	},
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<List class='w-72 divide-y divide-black overflow-hidden rounded-[8px] border border-black bg-white'>
			<For each={['Profile settings', 'Notifications', 'Privacy controls', 'Help center']}>
				{(item) => <li class='px-4 py-3 text-sm text-black'>{item}</li>}
			</For>
		</List>
	),
};

export const Composed: Story = {
	render: () => (
		<List class='w-72 divide-y divide-[#2a2a2a] overflow-hidden rounded-[8px] border border-black bg-white'>
			<For
				each={[
					{ label: 'Profile', icon: '👤', desc: 'Manage your account' },
					{ label: 'Notifications', icon: '🔔', desc: 'Configure alerts' },
					{ label: 'Privacy', icon: '🔒', desc: 'Control your data' },
					{ label: 'Help', icon: '❓', desc: 'Get support' },
				]}>
				{(item) => (
					<li class='flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-black hover:bg-[#f5f5f5]'>
						<span class='text-xl'>{item.icon}</span>
						<div>
							<p class='text-sm font-medium text-black'>{item.label}</p>
							<p class='text-xs text-[#6b7280]'>{item.desc}</p>
						</div>
						<svg
							class='ml-auto h-4 w-4 text-[#6b7280]'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fill-rule='evenodd'
								d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
								clip-rule='evenodd'
							/>
						</svg>
					</li>
				)}
			</For>
		</List>
	),
};

export const Complex: Story = {
	render: () => (
		<List class='w-64 space-y-2'>
			<For
				each={[
					{ label: 'Design mockups', done: true },
					{ label: 'Write unit tests', done: true },
					{ label: 'Implement API', done: false },
					{ label: 'Deploy to staging', done: false },
				]}>
				{(item) => (
					<li class='flex items-center gap-2.5 text-sm'>
						<span
							class={[
								'flex h-5 w-5 items-center justify-center rounded-full border',
								item.done ? 'border-black bg-black text-white' : 'border-black bg-white',
							].join(' ')}>
							{item.done && (
								<svg
									class='h-3 w-3'
									viewBox='0 0 12 12'
									fill='currentColor'>
									<path
										d='M3.5 6L5.5 8L8.5 4.5'
										stroke='white'
										stroke-width='1.5'
										fill='none'
										stroke-linecap='round'
										stroke-linejoin='round'
									/>
								</svg>
							)}
						</span>
						<span class={item.done ? 'text-[#6b7280] line-through' : 'text-black'}>{item.label}</span>
					</li>
				)}
			</For>
		</List>
	),
};
