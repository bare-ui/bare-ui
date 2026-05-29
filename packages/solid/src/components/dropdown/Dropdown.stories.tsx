import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Dropdown } from './Dropdown';

const meta = {
	title: 'Overlays/Dropdown',
	component: Dropdown.Root,
	subcomponents: {
		'Dropdown.Trigger': Dropdown.Trigger,
		'Dropdown.Menu': Dropdown.Menu,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Trigger and menu pattern with keyboard and click-outside support.',
			},
		},
	},
} satisfies Meta<typeof Dropdown.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls =
	'inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const menuCls = 'absolute left-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border border-black bg-white py-1';

const itemCls = 'cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]';

export const Default: Story = {
	render: () => (
		<Dropdown.Root class='relative inline-block'>
			<Dropdown.Trigger class={triggerCls}>Open Menu</Dropdown.Trigger>
			<Dropdown.Menu class={menuCls}>
				<div class={itemCls}>Profile</div>
				<div class={itemCls}>Settings</div>
				<div class={itemCls}>Sign out</div>
			</Dropdown.Menu>
		</Dropdown.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Dropdown.Root class='relative inline-block'>
			<Dropdown.Trigger class={triggerCls}>Actions</Dropdown.Trigger>
			<Dropdown.Menu class={menuCls}>
				<div class={itemCls}>Edit</div>
				<div class={itemCls}>Duplicate</div>
				<div class='my-1 border-t border-black' />
				<div class={itemCls}>Archive</div>
				<div class={itemCls}>Delete</div>
			</Dropdown.Menu>
		</Dropdown.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<Dropdown.Root class='relative inline-block'>
			<Dropdown.Trigger class='inline-flex items-center gap-2 rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
				<svg
					class='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'>
					<path
						fill-rule='evenodd'
						d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z'
						clip-rule='evenodd'
					/>
				</svg>
				Account
			</Dropdown.Trigger>
			<Dropdown.Menu class='absolute left-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-[20px] border border-black bg-white py-1'>
				<div class={itemCls}>
					<span class='mr-2'>👤</span>Profile
				</div>
				<div class={itemCls}>
					<span class='mr-2'>⚙️</span>Settings
				</div>
				<div class={itemCls}>
					<span class='mr-2'>📊</span>Analytics
				</div>
				<div class='my-1 border-t border-black' />
				<div class='cursor-pointer px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
					<span class='mr-2'>🚪</span>Sign out
				</div>
			</Dropdown.Menu>
		</Dropdown.Root>
	),
};
