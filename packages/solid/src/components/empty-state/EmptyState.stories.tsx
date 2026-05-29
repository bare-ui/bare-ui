import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { EmptyState } from './EmptyState';

const meta = {
	title: 'Feedback/EmptyState',
	component: EmptyState.Root,
	subcomponents: {
		'EmptyState.Media': EmptyState.Media,
		'EmptyState.Title': EmptyState.Title,
		'EmptyState.Description': EmptyState.Description,
		'EmptyState.Actions': EmptyState.Actions,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A composable empty / zero-data placeholder with media, title, description and action slots.',
			},
		},
	},
} satisfies Meta<typeof EmptyState.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<EmptyState.Root class='mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-dashed border-[#d1d5db] p-10 text-center'>
			<EmptyState.Media class='flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-2xl'>
				📭
			</EmptyState.Media>
			<EmptyState.Title class='text-base font-semibold text-black'>No messages yet</EmptyState.Title>
			<EmptyState.Description class='text-sm text-[#6b7280]'>
				When you start a conversation, it will show up here.
			</EmptyState.Description>
			<EmptyState.Actions class='mt-2 flex gap-2'>
				<button class='rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white'>New message</button>
				<button class='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-black'>
					Learn more
				</button>
			</EmptyState.Actions>
		</EmptyState.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-wrap items-start gap-6'>
			<EmptyState.Root class='flex max-w-xs flex-col items-center gap-2 rounded-2xl border border-[#e5e7eb] p-8 text-center'>
				<EmptyState.Media class='text-3xl'>🔍</EmptyState.Media>
				<EmptyState.Title class='text-sm font-semibold text-black'>
					No results for “wireframe”
				</EmptyState.Title>
				<EmptyState.Description class='text-xs text-[#6b7280]'>
					Check the spelling or try a broader term.
				</EmptyState.Description>
			</EmptyState.Root>

			<EmptyState.Root class='flex max-w-xs flex-col items-center gap-2 rounded-2xl border border-[#e5e7eb] p-8 text-center'>
				<EmptyState.Media class='flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-2xl'>
					📁
				</EmptyState.Media>
				<EmptyState.Title class='text-sm font-semibold text-black'>This folder is empty</EmptyState.Title>
				<EmptyState.Description class='text-xs text-[#6b7280]'>
					Drag files here or upload to get started.
				</EmptyState.Description>
				<EmptyState.Actions class='mt-2'>
					<button class='rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white'>Upload</button>
				</EmptyState.Actions>
			</EmptyState.Root>

			<EmptyState.Root class='flex max-w-xs flex-col items-center gap-2 rounded-2xl border border-dashed border-[#d1d5db] p-8 text-center'>
				<EmptyState.Media class='text-3xl'>⚠️</EmptyState.Media>
				<EmptyState.Title class='text-sm font-semibold text-black'>Something went wrong</EmptyState.Title>
				<EmptyState.Description class='text-xs text-[#6b7280]'>
					We couldn’t load your data. Please try again.
				</EmptyState.Description>
				<EmptyState.Actions class='mt-2'>
					<button class='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-black'>
						Retry
					</button>
				</EmptyState.Actions>
			</EmptyState.Root>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='w-[28rem] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white'>
			<div class='flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3'>
				<div>
					<h2 class='text-sm font-semibold text-black'>Projects</h2>
					<p class='text-xs text-[#9ca3af]'>0 active</p>
				</div>
				<button class='rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white'>New project</button>
			</div>
			<EmptyState.Root class='flex flex-col items-center gap-3 px-6 py-12 text-center'>
				<EmptyState.Media class='flex size-14 items-center justify-center rounded-full bg-[#f3f4f6] text-3xl'>
					🗂️
				</EmptyState.Media>
				<EmptyState.Title class='text-base font-semibold text-black'>No projects yet</EmptyState.Title>
				<EmptyState.Description class='max-w-xs text-sm text-[#6b7280]'>
					Create your first project to organize tasks, files and collaborators in one place.
				</EmptyState.Description>
				<EmptyState.Actions class='mt-2 flex gap-2'>
					<button class='rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white'>
						Create project
					</button>
					<button class='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-black'>
						Import
					</button>
				</EmptyState.Actions>
			</EmptyState.Root>
		</div>
	),
};
