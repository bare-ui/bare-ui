import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tooltip } from './Tooltip';

const meta = {
	title: 'Overlays/Tooltip',
	component: Tooltip.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Hover tooltip with configurable delay and placement.',
			},
		},
	},
} satisfies Meta<typeof Tooltip.Root>;

export default meta;

const contentCls =
	'rounded-[8px] border border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden whitespace-nowrap';

export const Default: StoryObj = {
	render: () => (
		<Tooltip.Root delayDuration={0}>
			<Tooltip.Trigger>
				<button class='rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
					Hover me
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content
				side='top'
				class={contentCls}>
				Tooltip on top
			</Tooltip.Content>
		</Tooltip.Root>
	),
};

export const Composed: StoryObj = {
	render: () => (
		<div class='flex flex-col items-center gap-16'>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button class='rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
						Top
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					class={contentCls}>
					Tooltip on top
				</Tooltip.Content>
			</Tooltip.Root>

			<div class='flex gap-24'>
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<button class='rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
							Left
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side='left'
						class={contentCls}>
						Tooltip on left
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<button class='rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
							Right
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side='right'
						class={contentCls}>
						Tooltip on right
					</Tooltip.Content>
				</Tooltip.Root>
			</div>

			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button class='rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
						Bottom
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='bottom'
					class={contentCls}>
					Tooltip on bottom
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	),
};

export const Complex: StoryObj = {
	render: () => (
		<div class='flex items-center gap-6'>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button class='rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
						Outline Button
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					class={contentCls}>
					This is an outline trigger
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button class='rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
						Solid Button
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					class={contentCls}>
					This is a solid trigger
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	),
};
