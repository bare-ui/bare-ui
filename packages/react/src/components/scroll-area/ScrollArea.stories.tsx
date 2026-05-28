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

export const Default: Story = {
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

export const Composed: Story = {
	render: () => (
		<div className='flex flex-col gap-8'>
			<div>
				<p className='mb-2 text-sm font-medium text-[#374151]'>Horizontal</p>
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
			</div>

			<div>
				<p className='mb-2 text-sm font-medium text-[#374151]'>Both axes</p>
				<ScrollArea.Root className='h-64 w-80 rounded-xl border border-[#e5e7eb]'>
					<ScrollArea.Viewport className='h-full w-full p-3'>
						<div className='grid w-[640px] grid-cols-8 gap-2'>
							{Array.from({ length: 64 }, (_, i) => (
								<div
									key={i}
									className='flex h-16 items-center justify-center rounded-lg bg-[#f3f4f6] text-xs text-[#6b7280]'>
									{i + 1}
								</div>
							))}
						</div>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation='vertical'
						className='flex w-2.5 touch-none select-none p-0.5'>
						<ScrollArea.Thumb className='flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
					</ScrollArea.Scrollbar>
					<ScrollArea.Scrollbar
						orientation='horizontal'
						className='flex h-2.5 touch-none select-none p-0.5'>
						<ScrollArea.Thumb className='rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const notifications = Array.from({ length: 24 }, (_, i) => ({
			id: i,
			who: ['Maya Chen', 'Leo Park', 'Ravi Singh', 'Tess Doyle'][i % 4],
			text: ['mentioned you in a comment', 'requested your review', 'assigned you a task', 'shared a document'][
				i % 4
			],
			when: `${i + 1}m ago`,
		}));

		return (
			<div className='w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white'>
				<div className='flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3'>
					<p className='text-sm font-semibold text-black'>Notifications</p>
					<span className='rounded-full bg-black px-2 py-0.5 text-xs text-white'>24</span>
				</div>
				<ScrollArea.Root className='h-72'>
					<ScrollArea.Viewport className='h-full w-full'>
						<ul className='divide-y divide-[#f3f4f6]'>
							{notifications.map((n) => (
								<li
									key={n.id}
									className='flex items-start gap-3 px-4 py-3 hover:bg-[#f5f5f5]'>
									<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-[#374151]'>
										{n.who
											.split(' ')
											.map((p) => p[0])
											.join('')}
									</span>
									<div className='min-w-0 text-sm'>
										<p className='text-black'>
											<span className='font-medium'>{n.who}</span> {n.text}
										</p>
										<p className='text-xs text-[#9ca3af]'>{n.when}</p>
									</div>
								</li>
							))}
						</ul>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation='vertical'
						className='flex w-2.5 touch-none select-none p-0.5'>
						<ScrollArea.Thumb className='flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>
			</div>
		);
	},
};
