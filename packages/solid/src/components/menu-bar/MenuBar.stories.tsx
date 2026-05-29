import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { MenuBar } from './MenuBar';

const meta = {
	title: 'Layout/MenuBar',
	component: MenuBar.Root,
	subcomponents: {
		'MenuBar.Menu': MenuBar.Menu,
		'MenuBar.Trigger': MenuBar.Trigger,
		'MenuBar.Content': MenuBar.Content,
		'MenuBar.Item': MenuBar.Item,
		'MenuBar.Separator': MenuBar.Separator,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Application menu bar (File / Edit / View). Hovering between triggers switches the open menu.',
			},
		},
	},
} satisfies Meta<typeof MenuBar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const barCls = 'flex items-center gap-1 rounded-[8px] border border-black bg-white p-1';
const triggerCls =
	'cursor-pointer rounded-[6px] px-3 py-1 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:bg-[#f5f5f5] data-[focus-visible]:ring-2 data-[focus-visible]:ring-black';
const contentCls = 'absolute left-0 top-full z-10 mt-1 min-w-[180px] rounded-[20px] border border-black bg-white p-1';
const itemCls =
	'cursor-pointer rounded-[6px] px-3 py-1.5 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[focus-visible]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';
const sepCls = 'my-1 h-px bg-black';

export const Default: Story = {
	render: () => (
		<MenuBar.Root class={barCls}>
			<MenuBar.Menu value='file'>
				<div class='relative'>
					<MenuBar.Trigger class={triggerCls}>File</MenuBar.Trigger>
					<MenuBar.Content class={contentCls}>
						<MenuBar.Item class={itemCls}>New</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Open</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Save</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='edit'>
				<div class='relative'>
					<MenuBar.Trigger class={triggerCls}>Edit</MenuBar.Trigger>
					<MenuBar.Content class={contentCls}>
						<MenuBar.Item class={itemCls}>Undo</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Redo</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Cut</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Copy</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Paste</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
		</MenuBar.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const menus = [
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
		];
		return (
			<MenuBar.Root class={barCls}>
				<For each={menus}>
					{(menu) => (
						<MenuBar.Menu value={menu.value}>
							<div class='relative'>
								<MenuBar.Trigger class={triggerCls}>{menu.label}</MenuBar.Trigger>
								<MenuBar.Content class={contentCls}>
									<For each={menu.items}>
										{(it) => (
											<MenuBar.Item class={itemCls}>
												<div class='flex items-center justify-between gap-8'>
													<span>{it.label}</span>
													<kbd class='text-[10px] text-[#6b7280]'>{it.shortcut}</kbd>
												</div>
											</MenuBar.Item>
										)}
									</For>
								</MenuBar.Content>
							</div>
						</MenuBar.Menu>
					)}
				</For>
			</MenuBar.Root>
		);
	},
};

export const Complex: Story = {
	render: () => (
		<MenuBar.Root class={barCls}>
			<MenuBar.Menu value='file'>
				<div class='relative'>
					<MenuBar.Trigger class={triggerCls}>File</MenuBar.Trigger>
					<MenuBar.Content class={contentCls}>
						<MenuBar.Item class={itemCls}>New File</MenuBar.Item>
						<MenuBar.Item class={itemCls}>New Window</MenuBar.Item>
						<MenuBar.Separator class={sepCls} />
						<MenuBar.Item class={itemCls}>Open Recent</MenuBar.Item>
						<MenuBar.Separator class={sepCls} />
						<MenuBar.Item class={itemCls}>Save</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Save As…</MenuBar.Item>
						<MenuBar.Separator class={sepCls} />
						<MenuBar.Item
							class={itemCls}
							disabled>
							Print
						</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='edit'>
				<div class='relative'>
					<MenuBar.Trigger class={triggerCls}>Edit</MenuBar.Trigger>
					<MenuBar.Content class={contentCls}>
						<MenuBar.Item class={itemCls}>Undo</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Redo</MenuBar.Item>
						<MenuBar.Separator class={sepCls} />
						<MenuBar.Item class={itemCls}>Find…</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Replace…</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='view'>
				<div class='relative'>
					<MenuBar.Trigger class={triggerCls}>View</MenuBar.Trigger>
					<MenuBar.Content class={contentCls}>
						<MenuBar.Item class={itemCls}>Sidebar</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Terminal</MenuBar.Item>
						<MenuBar.Separator class={sepCls} />
						<MenuBar.Item class={itemCls}>Full Screen</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
			<MenuBar.Menu value='help'>
				<div class='relative'>
					<MenuBar.Trigger class={triggerCls}>Help</MenuBar.Trigger>
					<MenuBar.Content class={contentCls}>
						<MenuBar.Item class={itemCls}>Documentation</MenuBar.Item>
						<MenuBar.Item class={itemCls}>Keyboard Shortcuts</MenuBar.Item>
					</MenuBar.Content>
				</div>
			</MenuBar.Menu>
		</MenuBar.Root>
	),
};
