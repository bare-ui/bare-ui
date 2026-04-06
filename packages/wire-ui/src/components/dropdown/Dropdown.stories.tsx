import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';

const meta = {
	title: 'Components/Dropdown',
	component: Dropdown.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Dropdown.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls =
	'inline-flex items-center rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const menuCls =
	'absolute left-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border-[3px] border-black bg-white py-1 shadow-lg';

const itemCls = 'cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]';

export const Default: Story = {
	render: () => (
		<Dropdown.Root className='relative inline-block'>
			<Dropdown.Trigger className={triggerCls}>Open Menu</Dropdown.Trigger>
			<Dropdown.Menu className={menuCls}>
				<div className={itemCls}>Profile</div>
				<div className={itemCls}>Settings</div>
				<div className={itemCls}>Sign out</div>
			</Dropdown.Menu>
		</Dropdown.Root>
	),
};

export const PositionLeft: Story = {
	render: () => (
		<div className='flex justify-end p-8'>
			<Dropdown.Root className='relative inline-block'>
				<Dropdown.Trigger className={triggerCls}>Left Aligned</Dropdown.Trigger>
				<Dropdown.Menu
					position='left'
					className={menuCls}>
					<div className={itemCls}>Option A</div>
					<div className={itemCls}>Option B</div>
					<div className={itemCls}>Option C</div>
				</Dropdown.Menu>
			</Dropdown.Root>
		</div>
	),
};

export const PositionRight: Story = {
	render: () => (
		<div className='p-8'>
			<Dropdown.Root className='relative inline-block'>
				<Dropdown.Trigger className={triggerCls}>Right Aligned</Dropdown.Trigger>
				<Dropdown.Menu
					position='right'
					className='absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border-[3px] border-black bg-white py-1 shadow-lg'>
					<div className={itemCls}>Option A</div>
					<div className={itemCls}>Option B</div>
					<div className={itemCls}>Option C</div>
				</Dropdown.Menu>
			</Dropdown.Root>
		</div>
	),
};
