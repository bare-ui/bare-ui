import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard } from './HoverCard';

const meta = {
	title: 'Overlays/HoverCard',
	component: HoverCard.Root,
	tags: ['autodocs'],
	args: { children: null },
	parameters: {
		docs: {
			description: {
				component:
					'A richer, interactive alternative to Tooltip — opens on hover/focus after a delay and stays open while you move into the card. Content is fully interactive (links, buttons).',
			},
		},
	},
} satisfies Meta<typeof HoverCard.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className='flex justify-center p-16'>
			<HoverCard.Root>
				<HoverCard.Trigger className='cursor-pointer font-medium text-[#4338ca] underline underline-offset-2'>
					@wire-ui
				</HoverCard.Trigger>
				<HoverCard.Content className='w-64 rounded-xl border border-[#e5e7eb] bg-white p-4 text-sm shadow-lg'>
					<div className='flex items-center gap-3'>
						<div className='flex size-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white'>
							W
						</div>
						<div>
							<p className='font-semibold text-black'>Wire UI</p>
							<p className='text-xs text-[#6b7280]'>@wire-ui</p>
						</div>
					</div>
					<p className='mt-3 text-[#374151]'>Headless, AI-native component primitives with zero CSS.</p>
					<div className='mt-3 flex gap-3 text-xs text-[#6b7280]'>
						<span>
							<b className='text-black'>1.2k</b> Following
						</span>
						<span>
							<b className='text-black'>18.3k</b> Followers
						</span>
					</div>
				</HoverCard.Content>
			</HoverCard.Root>
		</div>
	),
};

export const SideTop: Story = {
	render: () => (
		<div className='flex justify-center p-24'>
			<HoverCard.Root openDelay={150}>
				<HoverCard.Trigger className='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm'>
					Hover me
				</HoverCard.Trigger>
				<HoverCard.Content
					side='top'
					className='w-56 rounded-lg border border-[#e5e7eb] bg-white p-3 text-sm text-[#374151] shadow-lg'>
					This card appears above the trigger and stays open while hovered.
				</HoverCard.Content>
			</HoverCard.Root>
		</div>
	),
};
