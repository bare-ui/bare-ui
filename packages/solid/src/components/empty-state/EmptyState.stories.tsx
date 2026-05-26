import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { EmptyState } from './EmptyState';

const meta = {
	title: 'Feedback/EmptyState',
	component: EmptyState.Root,
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

export const SearchEmpty: Story = {
	render: () => (
		<EmptyState.Root class='mx-auto flex max-w-sm flex-col items-center gap-2 p-8 text-center'>
			<EmptyState.Media class='text-3xl'>🔍</EmptyState.Media>
			<EmptyState.Title class='text-sm font-semibold text-black'>No results for “wireframe”</EmptyState.Title>
			<EmptyState.Description class='text-xs text-[#6b7280]'>
				Check the spelling or try a broader term.
			</EmptyState.Description>
		</EmptyState.Root>
	),
};
