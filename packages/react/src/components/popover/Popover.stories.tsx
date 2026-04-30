import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';

const meta = {
	title: 'Overlays/Popover',
	component: Popover.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Floating panel anchored to a trigger. Closes on outside click or Escape.',
			},
		},
	},
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls =
	'inline-flex cursor-pointer items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const panelCls =
	'absolute left-0 top-full z-10 mt-2 w-64 rounded-[20px] border border-black bg-white p-4 text-sm text-black';

export const Default: Story = {
	render: () => (
		<Popover.Root className='relative inline-block'>
			<Popover.Trigger className={triggerCls}>Show details</Popover.Trigger>
			<Popover.Content className={panelCls}>
				<p className='font-medium mb-1'>Popover</p>
				<p className='text-[#6b7280]'>This is a basic popover. Click outside or press Escape to close.</p>
			</Popover.Content>
		</Popover.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Popover.Root className='relative inline-block'>
			<Popover.Trigger className={triggerCls}>Account</Popover.Trigger>
			<Popover.Content className='absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-4'>
				<div className='flex items-center gap-3 pb-3 border-b border-black'>
					<div className='flex size-10 items-center justify-center rounded-full border border-black bg-[#f5f5f5] text-sm font-semibold text-black'>JD</div>
					<div>
						<p className='text-sm font-medium text-black'>Jane Doe</p>
						<p className='text-xs text-[#6b7280]'>jane@example.com</p>
					</div>
				</div>
				<nav className='mt-3 flex flex-col'>
					<button className='cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm text-black hover:bg-[#f5f5f5]'>
						Profile
					</button>
					<button className='cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm text-black hover:bg-[#f5f5f5]'>
						Settings
					</button>
					<Popover.Close className='cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm font-medium text-black hover:bg-[#f5f5f5]'>
						Sign out
					</Popover.Close>
				</nav>
			</Popover.Content>
		</Popover.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<div className='flex flex-col gap-12 items-center py-8'>
			<div className='flex gap-6'>
				<Popover.Root className='relative inline-block'>
					<Popover.Trigger className='cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
						Top
					</Popover.Trigger>
					<Popover.Content
						side='top'
						className='absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 w-48 rounded-[20px] border border-black bg-white p-3 text-xs text-black'>
						Anchored to top
					</Popover.Content>
				</Popover.Root>

				<Popover.Root className='relative inline-block'>
					<Popover.Trigger className='cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
						Bottom
					</Popover.Trigger>
					<Popover.Content
						side='bottom'
						className='absolute left-1/2 top-full z-10 -translate-x-1/2 mt-2 w-48 rounded-[20px] border border-black bg-white p-3 text-xs text-black'>
						Anchored to bottom
					</Popover.Content>
				</Popover.Root>
			</div>

			<Popover.Root className='relative inline-block'>
				<Popover.Trigger className='cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
					Form popover
				</Popover.Trigger>
				<Popover.Content className='absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-4'>
					<h3 className='mb-3 text-sm font-semibold text-black'>Quick edit</h3>
					<div className='flex flex-col gap-3'>
						<label className='text-xs font-medium text-black'>
							Name
							<input
								type='text'
								defaultValue='Jane'
								className='mt-1 w-full rounded-[8px] border border-black bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black'
							/>
						</label>
						<label className='text-xs font-medium text-black'>
							Email
							<input
								type='email'
								defaultValue='jane@example.com'
								className='mt-1 w-full rounded-[8px] border border-black bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black'
							/>
						</label>
						<div className='flex gap-2 mt-1'>
							<Popover.Close className='flex-1 cursor-pointer rounded-[8px] border border-black py-1.5 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
								Cancel
							</Popover.Close>
							<Popover.Close className='flex-1 cursor-pointer rounded-[8px] border border-black bg-black py-1.5 text-sm font-medium text-white hover:bg-[#333]'>
								Save
							</Popover.Close>
						</div>
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
	),
};
