import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const meta = {
	title: 'Components/Tooltip',
	component: Tooltip.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Hover/focus tooltip with configurable delay and side.',
			},
		},
	},
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const contentCls =
	'rounded-[8px] border-2 border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden whitespace-nowrap';

const outlineTriggerCls =
	'rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]';

const solidTriggerCls =
	'rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

export const Default: Story = {
	render: () => (
		<div className='flex items-center justify-center p-20'>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<button className={solidTriggerCls}>Hover me</button>
				</Tooltip.Trigger>
				<Tooltip.Content className={contentCls}>Tooltip content</Tooltip.Content>
			</Tooltip.Root>
		</div>
	),
};

export const NoDelay: Story = {
	render: () => (
		<div className='flex items-center justify-center p-20'>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button className={outlineTriggerCls}>Instant tooltip</button>
				</Tooltip.Trigger>
				<Tooltip.Content className={contentCls}>Shows immediately</Tooltip.Content>
			</Tooltip.Root>
		</div>
	),
};

export const Sides: Story = {
	render: () => (
		<div className='flex flex-col items-center justify-center gap-16 p-20'>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button className={outlineTriggerCls}>Top (default)</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					className={contentCls}>
					Tooltip on top
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button className={outlineTriggerCls}>Bottom</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='bottom'
					className={contentCls}>
					Tooltip on bottom
				</Tooltip.Content>
			</Tooltip.Root>

			<div className='flex gap-24'>
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<button className={outlineTriggerCls}>Left</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side='left'
						className={contentCls}>
						Tooltip on left
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<button className={outlineTriggerCls}>Right</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side='right'
						className={contentCls}>
						Tooltip on right
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</div>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className='flex items-center justify-center p-20'>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button
						className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-black hover:bg-[#f5f5f5]'
						aria-label='More information'>
						<svg
							className='h-4 w-4'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='right'
					className={contentCls}>
					Click to learn more about this feature
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	),
};

export const DarkAndLight: Story = {
	render: () => (
		<div className='flex items-center justify-center gap-8 p-20'>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button className={solidTriggerCls}>Dark tooltip</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					className='whitespace-nowrap rounded-[8px] border-2 border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden'>
					Dark tooltip
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button className={outlineTriggerCls}>Light tooltip</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					className='whitespace-nowrap rounded-[8px] border-2 border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden'>
					Light tooltip
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	),
};

export const InlineText: Story = {
	render: () => (
		<div className='p-8'>
			<p className='text-sm text-[#9ca3af]'>
				Hover over the{' '}
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<span className='cursor-help border-b border-dashed border-black text-black'>
							underlined text
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content className={contentCls}>Additional context about this term</Tooltip.Content>
				</Tooltip.Root>{' '}
				to see a tooltip.
			</p>
		</div>
	),
};
