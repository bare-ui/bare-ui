import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './ScrollArea';

const meta = {
	title: 'Layout/ScrollArea',
	component: ScrollArea.Root,
	subcomponents: {
		'ScrollArea.Viewport': ScrollArea.Viewport,
		'ScrollArea.Scrollbar': ScrollArea.Scrollbar,
		'ScrollArea.Thumb': ScrollArea.Thumb,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A scroll container with a custom, stylable scrollbar. The native scrollbar is hidden; `Scrollbar` + `Thumb` reflect the scroll position and support drag.',
			},
		},
	},
} satisfies Meta<typeof ScrollArea.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 40 }, (_, i) => `Tag ${i + 1}`);

export const Vertical: Story = {
	render: () => (
		<ScrollArea.Root className='h-72 w-56 rounded-xl border border-[#e5e7eb]'>
			<ScrollArea.Viewport className='h-full w-full p-3'>
				<div className='space-y-1'>
					{tags.map((t) => (
						<div
							key={t}
							className='rounded-md px-2 py-1.5 text-sm text-[#374151] hover:bg-[#f3f4f6]'>
							{t}
						</div>
					))}
				</div>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				orientation='vertical'
				className='flex w-2.5 touch-none select-none p-0.5'>
				<ScrollArea.Thumb className='flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
			</ScrollArea.Scrollbar>
		</ScrollArea.Root>
	),
};

export const Horizontal: Story = {
	render: () => (
		<ScrollArea.Root className='w-96 rounded-xl border border-[#e5e7eb]'>
			<ScrollArea.Viewport className='w-full p-3'>
				<div className='flex gap-3'>
					{tags.map((t) => (
						<div
							key={t}
							className='flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-sm text-[#374151]'>
							{t}
						</div>
					))}
				</div>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				orientation='horizontal'
				className='flex h-2.5 touch-none select-none p-0.5'>
				<ScrollArea.Thumb className='rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
			</ScrollArea.Scrollbar>
		</ScrollArea.Root>
	),
};
