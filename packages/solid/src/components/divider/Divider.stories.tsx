import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { Divider } from './Divider';

const meta = {
	title: 'Layout/Divider',
	component: Divider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Horizontal or vertical separator line.',
			},
		},
	},
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div class='flex flex-col gap-8'>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Horizontal</p>
				<div class='flex flex-col gap-3'>
					<p class='text-sm text-black'>Item one</p>
					<Divider class='h-px w-full bg-black' />
					<p class='text-sm text-black'>Item two</p>
					<Divider class='h-px w-full bg-black' />
					<p class='text-sm text-black'>Item three</p>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Vertical</p>
				<div class='flex h-6 items-center gap-3'>
					<span class='text-sm text-black'>Home</span>
					<Divider
						orientation='vertical'
						class='h-full w-px bg-black'
					/>
					<span class='text-sm text-black'>About</span>
					<Divider
						orientation='vertical'
						class='h-full w-px bg-black'
					/>
					<span class='text-sm text-black'>Contact</span>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>With label</p>
				<div class='flex w-64 items-center gap-3'>
					<Divider class='h-px flex-1 bg-black' />
					<span class='text-xs font-medium text-[#6b7280]'>OR</span>
					<Divider class='h-px flex-1 bg-black' />
				</div>
			</div>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex w-64 flex-col gap-6'>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Thin</p>
				<Divider class='h-px w-full bg-[#e5e7eb]' />
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Thick</p>
				<Divider class='h-1 w-full rounded-full bg-black' />
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Dashed</p>
				<Divider class='w-full border-t border-dashed border-[#9ca3af]' />
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Inset</p>
				<Divider class='ml-8 h-px w-[calc(100%-2rem)] bg-black' />
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>
					Semantic (separator role)
				</p>
				<Divider
					decorative={false}
					class='h-px w-full bg-black'
				/>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white'>
			<div class='p-4'>
				<p class='text-sm font-semibold text-black'>Account</p>
				<p class='text-xs text-[#6b7280]'>jane@example.com</p>
			</div>
			<Divider class='h-px w-full bg-[#e5e7eb]' />
			<nav class='flex flex-col py-1'>
				<For each={['Profile', 'Billing', 'Notifications']}>
					{(item) => (
						<a
							href='#'
							onClick={(e) => e.preventDefault()}
							class='px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
							{item}
						</a>
					)}
				</For>
			</nav>
			<Divider class='h-px w-full bg-[#e5e7eb]' />
			<div class='flex items-center justify-between p-3'>
				<div class='flex h-5 items-center gap-3 text-xs text-[#6b7280]'>
					<a
						href='#'
						onClick={(e) => e.preventDefault()}
						class='hover:text-black'>
						Help
					</a>
					<Divider
						orientation='vertical'
						class='h-full w-px bg-[#d1d5db]'
					/>
					<a
						href='#'
						onClick={(e) => e.preventDefault()}
						class='hover:text-black'>
						Privacy
					</a>
					<Divider
						orientation='vertical'
						class='h-full w-px bg-[#d1d5db]'
					/>
					<a
						href='#'
						onClick={(e) => e.preventDefault()}
						class='hover:text-black'>
						Terms
					</a>
				</div>
				<button class='text-xs font-medium text-black hover:underline'>Sign out</button>
			</div>
		</div>
	),
};
