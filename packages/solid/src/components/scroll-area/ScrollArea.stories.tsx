import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
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
		<ScrollArea.Root class='h-72 w-56 rounded-xl border border-[#e5e7eb]'>
			<ScrollArea.Viewport class='h-full w-full p-3'>
				<div class='space-y-1'>
					<For each={tags}>
						{(t) => (
							<div class='rounded-md px-2 py-1.5 text-sm text-[#374151] hover:bg-[#f3f4f6]'>{t}</div>
						)}
					</For>
				</div>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				orientation='vertical'
				class='flex w-2.5 touch-none select-none p-0.5'>
				<ScrollArea.Thumb class='flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
			</ScrollArea.Scrollbar>
		</ScrollArea.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-8'>
			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Horizontal</p>
				<ScrollArea.Root class='w-96 rounded-xl border border-[#e5e7eb]'>
					<ScrollArea.Viewport class='w-full p-3'>
						<div class='flex gap-3'>
							<For each={tags}>
								{(t) => (
									<div class='flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-sm text-[#374151]'>
										{t}
									</div>
								)}
							</For>
						</div>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation='horizontal'
						class='flex h-2.5 touch-none select-none p-0.5'>
						<ScrollArea.Thumb class='rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>
			</div>

			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Both axes</p>
				<ScrollArea.Root class='h-64 w-80 rounded-xl border border-[#e5e7eb]'>
					<ScrollArea.Viewport class='h-full w-full p-3'>
						<div class='grid w-[640px] grid-cols-8 gap-2'>
							<For each={Array.from({ length: 64 }, (_, i) => i)}>
								{(i) => (
									<div class='flex h-16 items-center justify-center rounded-lg bg-[#f3f4f6] text-xs text-[#6b7280]'>
										{i + 1}
									</div>
								)}
							</For>
						</div>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation='vertical'
						class='flex w-2.5 touch-none select-none p-0.5'>
						<ScrollArea.Thumb class='flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
					</ScrollArea.Scrollbar>
					<ScrollArea.Scrollbar
						orientation='horizontal'
						class='flex h-2.5 touch-none select-none p-0.5'>
						<ScrollArea.Thumb class='rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
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
			<div class='w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white'>
				<div class='flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3'>
					<p class='text-sm font-semibold text-black'>Notifications</p>
					<span class='rounded-full bg-black px-2 py-0.5 text-xs text-white'>24</span>
				</div>
				<ScrollArea.Root class='h-72'>
					<ScrollArea.Viewport class='h-full w-full'>
						<ul class='divide-y divide-[#f3f4f6]'>
							<For each={notifications}>
								{(n) => (
									<li class='flex items-start gap-3 px-4 py-3 hover:bg-[#f5f5f5]'>
										<span class='flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-[#374151]'>
											{n.who
												.split(' ')
												.map((p) => p[0])
												.join('')}
										</span>
										<div class='min-w-0 text-sm'>
											<p class='text-black'>
												<span class='font-medium'>{n.who}</span> {n.text}
											</p>
											<p class='text-xs text-[#9ca3af]'>{n.when}</p>
										</div>
									</li>
								)}
							</For>
						</ul>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation='vertical'
						class='flex w-2.5 touch-none select-none p-0.5'>
						<ScrollArea.Thumb class='flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>
			</div>
		);
	},
};
