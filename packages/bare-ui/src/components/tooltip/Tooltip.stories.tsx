import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const meta = {
	title: 'Components/Tooltip',
	component: Tooltip.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const contentCls =
	'rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md data-[state=closed]:hidden whitespace-nowrap';

export const Default: Story = {
	render: () => (
		<div className='flex items-center justify-center p-20'>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<button className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'>
						Hover me
					</button>
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
					<button className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
						Instant tooltip
					</button>
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
					<button className='rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'>
						Top (default)
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					className={contentCls}>
					Tooltip on top
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button className='rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'>
						Bottom
					</button>
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
						<button className='rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'>
							Left
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side='left'
						className={contentCls}>
						Tooltip on left
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<button className='rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'>
							Right
						</button>
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
						className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
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
					<button className='rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white'>
						Dark tooltip
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					className='whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md data-[state=closed]:hidden'>
					Dark background
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					<button className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm'>
						Light tooltip
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					side='top'
					className='whitespace-nowrap rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-md data-[state=closed]:hidden'>
					Light background
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	),
};

export const InlineText: Story = {
	render: () => (
		<div className='p-8'>
			<p className='text-sm text-gray-600'>
				Hover over the{' '}
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<span className='cursor-help border-b border-dashed border-gray-400 text-gray-900'>
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
