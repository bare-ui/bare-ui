import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { Icon } from './Icon';

const meta = {
	title: 'Media/Icon',
	component: Icon,
	tags: ['autodocs'],
	args: { type: 'x' },
	parameters: {
		docs: {
			description: {
				component: 'SVG icon renderer from a raw SVG string map.',
			},
		},
	},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

const icons = {
	'caret-down':
		'<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',
	'warning-triangle':
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
	x: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>',
	search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>',
	edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>',
	'thumbs-up':
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11M2 21h2a1 1 0 001-1v-9a1 1 0 00-1-1H2v11zM7 10l4-7a2 2 0 012 2v3h5.5a2 2 0 011.98 2.3l-1.2 7A2 2 0 0117.3 21H7" /></svg>',
	alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>',
};

export const Default: Story = {
	render: () => (
		<div class='flex items-center gap-8'>
			<Icon
				type='caret-down'
				icons={icons}
				size='small'
				class='[data-size=small]:size-4 text-black'
			/>
			<Icon
				type='warning-triangle'
				icons={icons}
				size='small'
				class='[data-size=small]:size-4 text-black'
			/>
			<Icon
				type='x'
				icons={icons}
				size='small'
				class='[data-size=small]:size-4 text-black'
			/>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-8'>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Sizes</p>
				<div class='flex items-end gap-6 text-black'>
					<Icon
						type='alert'
						icons={icons}
						size='small'
						class='size-4'
					/>
					<Icon
						type='alert'
						icons={icons}
						size='medium'
						class='size-6'
					/>
					<Icon
						type='alert'
						icons={icons}
						size='large'
						class='size-8'
					/>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Colors</p>
				<div class='flex items-center gap-6'>
					<Icon
						type='thumbs-up'
						icons={icons}
						class='size-6 text-green-600'
					/>
					<Icon
						type='warning-triangle'
						icons={icons}
						class='size-6 text-amber-500'
					/>
					<Icon
						type='x'
						icons={icons}
						class='size-6 text-red-500'
					/>
					<Icon
						type='search'
						icons={icons}
						class='size-6 text-[#6b7280]'
					/>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>
					Accessible (with label)
				</p>
				<Icon
					type='alert'
					icons={icons}
					label='Notifications'
					class='size-6 text-black'
				/>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const tools = [
			{ type: 'search', label: 'Search' },
			{ type: 'alert', label: 'Notifications' },
			{ type: 'edit', label: 'Edit' },
			{ type: 'x', label: 'Close' },
		] as const;

		return (
			<div class='flex w-80 flex-col gap-4'>
				<div class='flex items-center gap-1 rounded-xl border border-[#e5e7eb] bg-white p-1.5'>
					<For each={tools}>
						{(t) => (
							<button
								type='button'
								aria-label={t.label}
								class='inline-flex size-9 items-center justify-center rounded-lg text-black hover:bg-[#f5f5f5]'>
								<Icon
									type={t.type}
									icons={icons}
									label={t.label}
									class='size-5'
								/>
							</button>
						)}
					</For>
				</div>

				<div class='flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3'>
					<Icon
						type='warning-triangle'
						icons={icons}
						label='Warning'
						class='mt-0.5 size-5 shrink-0 text-amber-600'
					/>
					<div>
						<p class='text-sm font-medium text-amber-900'>Storage almost full</p>
						<p class='text-xs text-amber-700'>You’ve used 92% of your available space.</p>
					</div>
				</div>
			</div>
		);
	},
};
