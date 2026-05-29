import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { HoverCard } from './HoverCard';

const meta = {
	title: 'Overlays/HoverCard',
	component: HoverCard.Root,
	subcomponents: {
		'HoverCard.Trigger': HoverCard.Trigger,
		'HoverCard.Content': HoverCard.Content,
	},
	tags: ['autodocs'],
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
		<div class='flex justify-center p-16'>
			<HoverCard.Root>
				<HoverCard.Trigger class='cursor-pointer font-medium text-[#4338ca] underline underline-offset-2'>
					@wire-ui
				</HoverCard.Trigger>
				<HoverCard.Content class='w-64 rounded-xl border border-[#e5e7eb] bg-white p-4 text-sm shadow-lg'>
					<div class='flex items-center gap-3'>
						<div class='flex size-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white'>
							W
						</div>
						<div>
							<p class='font-semibold text-black'>Wire UI</p>
							<p class='text-xs text-[#6b7280]'>@wire-ui</p>
						</div>
					</div>
					<p class='mt-3 text-[#374151]'>Headless, AI-native component primitives with zero CSS.</p>
					<div class='mt-3 flex gap-3 text-xs text-[#6b7280]'>
						<span>
							<b class='text-black'>1.2k</b> Following
						</span>
						<span>
							<b class='text-black'>18.3k</b> Followers
						</span>
					</div>
				</HoverCard.Content>
			</HoverCard.Root>
		</div>
	),
};

export const SideTop: Story = {
	render: () => (
		<div class='flex justify-center p-24'>
			<HoverCard.Root openDelay={150}>
				<HoverCard.Trigger class='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm'>
					Hover me
				</HoverCard.Trigger>
				<HoverCard.Content
					side='top'
					class='w-56 rounded-lg border border-[#e5e7eb] bg-white p-3 text-sm text-[#374151] shadow-lg'>
					This card appears above the trigger and stays open while hovered.
				</HoverCard.Content>
			</HoverCard.Root>
		</div>
	),
};
