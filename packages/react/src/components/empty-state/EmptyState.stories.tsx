import type { Meta, StoryObj } from '@storybook/react-vite';
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
		<EmptyState.Root className='mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-dashed border-[#d1d5db] p-10 text-center'>
			<EmptyState.Media className='flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-2xl'>
				📭
			</EmptyState.Media>
			<EmptyState.Title className='text-base font-semibold text-black'>No messages yet</EmptyState.Title>
			<EmptyState.Description className='text-sm text-[#6b7280]'>
				When you start a conversation, it will show up here.
			</EmptyState.Description>
			<EmptyState.Actions className='mt-2 flex gap-2'>
				<button className='rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white'>New message</button>
				<button className='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-black'>
					Learn more
				</button>
			</EmptyState.Actions>
		</EmptyState.Root>
	),
};

export const SearchEmpty: Story = {
	render: () => (
		<EmptyState.Root className='mx-auto flex max-w-sm flex-col items-center gap-2 p-8 text-center'>
			<EmptyState.Media className='text-3xl'>🔍</EmptyState.Media>
			<EmptyState.Title className='text-sm font-semibold text-black'>No results for “wireframe”</EmptyState.Title>
			<EmptyState.Description className='text-xs text-[#6b7280]'>
				Check the spelling or try a broader term.
			</EmptyState.Description>
		</EmptyState.Root>
	),
};
