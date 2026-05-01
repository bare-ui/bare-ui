import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuBar } from './MenuBar';

const meta = {
	title: 'Layout/MenuBar',
	component: MenuBar.Root,
	tags: ['autodocs'],
	parameters: {
		docs: { description: { component: 'Application menu bar (File / Edit / View). Hovering between triggers switches the open menu.' } },
	},
} satisfies Meta<typeof MenuBar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const barCls = 'flex items-center gap-1 rounded-[8px] border border-black bg-white p-1';
const triggerCls = 'cursor-pointer rounded-[6px] px-3 py-1 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:bg-[#f5f5f5] data-[focus-visible]:ring-2 data-[focus-visible]:ring-black';
const contentCls = 'absolute left-0 top-full z-10 mt-1 min-w-[180px] rounded-[20px] border border-black bg-white p-1';
const itemCls = 'cursor-pointer rounded-[6px] px-3 py-1.5 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[focus-visible]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';
const sepCls = 'my-1 h-px bg-black';

export const Default: Story = {
	render: () => (
		<MenuBar.Root className={barCls}>
			<MenuBar.Menu value='file'>
				<div className='relative'>
					<MenuBar.Trigger className={triggerCls}>File</MenuBar.Trigger>
					<MenuBar.Content className={contentCls}>
						<MenuBar.Item className={itemCls}>New</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Open</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Save</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='edit'>
				<div className='relative'>
					<MenuBar.Trigger className={triggerCls}>Edit</MenuBar.Trigger>
					<MenuBar.Content className={contentCls}>
						<MenuBar.Item className={itemCls}>Undo</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Redo</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Cut</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Copy</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Paste</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
		</MenuBar.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<MenuBar.Root className={barCls}>
			{[
				{
					value: 'file',
					label: 'File',
					items: [
						{ label: 'New', shortcut: '⌘N' },
						{ label: 'Open', shortcut: '⌘O' },
						{ label: 'Save', shortcut: '⌘S' },
					],
				},
				{
					value: 'edit',
					label: 'Edit',
					items: [
						{ label: 'Undo', shortcut: '⌘Z' },
						{ label: 'Redo', shortcut: '⇧⌘Z' },
					],
				},
				{
					value: 'view',
					label: 'View',
					items: [
						{ label: 'Zoom In', shortcut: '⌘+' },
						{ label: 'Zoom Out', shortcut: '⌘-' },
					],
				},
			].map((menu) => (
				<MenuBar.Menu key={menu.value} value={menu.value}>
					<div className='relative'>
						<MenuBar.Trigger className={triggerCls}>{menu.label}</MenuBar.Trigger>
						<MenuBar.Content className={contentCls}>
							{menu.items.map((it) => (
								<MenuBar.Item key={it.label} className={itemCls}>
									<div className='flex items-center justify-between gap-8'>
										<span>{it.label}</span>
										<kbd className='text-[10px] text-[#6b7280]'>{it.shortcut}</kbd>
									</div>
								</MenuBar.Item>
							))}
						</MenuBar.Content>
					</div>
				</MenuBar.Menu>
			))}
		</MenuBar.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<MenuBar.Root className={barCls}>
			<MenuBar.Menu value='file'>
				<div className='relative'>
					<MenuBar.Trigger className={triggerCls}>File</MenuBar.Trigger>
					<MenuBar.Content className={contentCls}>
						<MenuBar.Item className={itemCls}>New File</MenuBar.Item>
						<MenuBar.Item className={itemCls}>New Window</MenuBar.Item>
						<MenuBar.Separator className={sepCls} />
						<MenuBar.Item className={itemCls}>Open Recent</MenuBar.Item>
						<MenuBar.Separator className={sepCls} />
						<MenuBar.Item className={itemCls}>Save</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Save As…</MenuBar.Item>
						<MenuBar.Separator className={sepCls} />
						<MenuBar.Item className={itemCls} disabled>Print</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='edit'>
				<div className='relative'>
					<MenuBar.Trigger className={triggerCls}>Edit</MenuBar.Trigger>
					<MenuBar.Content className={contentCls}>
						<MenuBar.Item className={itemCls}>Undo</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Redo</MenuBar.Item>
						<MenuBar.Separator className={sepCls} />
						<MenuBar.Item className={itemCls}>Find…</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Replace…</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='view'>
				<div className='relative'>
					<MenuBar.Trigger className={triggerCls}>View</MenuBar.Trigger>
					<MenuBar.Content className={contentCls}>
						<MenuBar.Item className={itemCls}>Sidebar</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Terminal</MenuBar.Item>
						<MenuBar.Separator className={sepCls} />
						<MenuBar.Item className={itemCls}>Full Screen</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='help'>
				<div className='relative'>
					<MenuBar.Trigger className={triggerCls}>Help</MenuBar.Trigger>
					<MenuBar.Content className={contentCls}>
						<MenuBar.Item className={itemCls}>Documentation</MenuBar.Item>
						<MenuBar.Item className={itemCls}>Keyboard Shortcuts</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
		</MenuBar.Root>
	),
};
