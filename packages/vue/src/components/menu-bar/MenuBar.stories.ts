import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { MenuBar } from '.';

const meta = {
	title: 'Layout/MenuBar',
	component: MenuBar.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Application menu bar (File / Edit / View). Hovering between triggers switches the open menu.',
			},
		},
	},
} satisfies Meta<typeof MenuBar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const barCls = 'flex items-center gap-1 rounded-[8px] border border-black bg-white p-1';
const triggerCls =
	'cursor-pointer rounded-[6px] px-3 py-1 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:bg-[#f5f5f5] data-[focus-visible]:ring-2 data-[focus-visible]:ring-black';
const contentCls =
	'absolute left-0 top-full z-10 mt-1 min-w-[180px] rounded-[20px] border border-black bg-white p-1';
const itemCls =
	'cursor-pointer rounded-[6px] px-3 py-1.5 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[focus-visible]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';
const sepCls = 'my-1 h-px bg-black';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(MenuBar.Root, { class: barCls }, () => [
				h(MenuBar.Menu, { value: 'file' }, () => [
					h('div', { class: 'relative' }, [
						h(MenuBar.Trigger, { class: triggerCls }, () => 'File'),
						h(MenuBar.Content, { class: contentCls }, () => [
							h(MenuBar.Item, { class: itemCls }, () => 'New'),
							h(MenuBar.Item, { class: itemCls }, () => 'Open'),
							h(MenuBar.Item, { class: itemCls }, () => 'Save'),
						]),
					]),
				]),
				h(MenuBar.Menu, { value: 'edit' }, () => [
					h('div', { class: 'relative' }, [
						h(MenuBar.Trigger, { class: triggerCls }, () => 'Edit'),
						h(MenuBar.Content, { class: contentCls }, () => [
							h(MenuBar.Item, { class: itemCls }, () => 'Undo'),
							h(MenuBar.Item, { class: itemCls }, () => 'Redo'),
							h(MenuBar.Item, { class: itemCls }, () => 'Cut'),
							h(MenuBar.Item, { class: itemCls }, () => 'Copy'),
							h(MenuBar.Item, { class: itemCls }, () => 'Paste'),
						]),
					]),
				]),
			]),
	}),
};

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

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				MenuBar.Root,
				{ class: barCls },
				menus.map((menu) =>
					h(MenuBar.Menu, { key: menu.value, value: menu.value }, () => [
						h('div', { class: 'relative' }, [
							h(MenuBar.Trigger, { class: triggerCls }, () => menu.label),
							h(
								MenuBar.Content,
								{ class: contentCls },
								menu.items.map((it) =>
									h(MenuBar.Item, { key: it.label, class: itemCls }, () => [
										h('div', { class: 'flex items-center justify-between gap-8' }, [
											h('span', {}, it.label),
											h('kbd', { class: 'text-[10px] text-[#6b7280]' }, it.shortcut),
										]),
									]),
								),
							),
						]),
					]),
				),
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(MenuBar.Root, { class: barCls }, () => [
				h(MenuBar.Menu, { value: 'file' }, () => [
					h('div', { class: 'relative' }, [
						h(MenuBar.Trigger, { class: triggerCls }, () => 'File'),
						h(MenuBar.Content, { class: contentCls }, () => [
							h(MenuBar.Item, { class: itemCls }, () => 'New File'),
							h(MenuBar.Item, { class: itemCls }, () => 'New Window'),
							h(MenuBar.Separator, { class: sepCls }),
							h(MenuBar.Item, { class: itemCls }, () => 'Open Recent'),
							h(MenuBar.Separator, { class: sepCls }),
							h(MenuBar.Item, { class: itemCls }, () => 'Save'),
							h(MenuBar.Item, { class: itemCls }, () => 'Save As…'),
							h(MenuBar.Separator, { class: sepCls }),
							h(MenuBar.Item, { class: itemCls, disabled: true }, () => 'Print'),
						]),
					]),
				]),
				h(MenuBar.Menu, { value: 'edit' }, () => [
					h('div', { class: 'relative' }, [
						h(MenuBar.Trigger, { class: triggerCls }, () => 'Edit'),
						h(MenuBar.Content, { class: contentCls }, () => [
							h(MenuBar.Item, { class: itemCls }, () => 'Undo'),
							h(MenuBar.Item, { class: itemCls }, () => 'Redo'),
							h(MenuBar.Separator, { class: sepCls }),
							h(MenuBar.Item, { class: itemCls }, () => 'Find…'),
							h(MenuBar.Item, { class: itemCls }, () => 'Replace…'),
						]),
					]),
				]),
				h(MenuBar.Menu, { value: 'view' }, () => [
					h('div', { class: 'relative' }, [
						h(MenuBar.Trigger, { class: triggerCls }, () => 'View'),
						h(MenuBar.Content, { class: contentCls }, () => [
							h(MenuBar.Item, { class: itemCls }, () => 'Sidebar'),
							h(MenuBar.Item, { class: itemCls }, () => 'Terminal'),
							h(MenuBar.Separator, { class: sepCls }),
							h(MenuBar.Item, { class: itemCls }, () => 'Full Screen'),
						]),
					]),
				]),
				h(MenuBar.Menu, { value: 'help' }, () => [
					h('div', { class: 'relative' }, [
						h(MenuBar.Trigger, { class: triggerCls }, () => 'Help'),
						h(MenuBar.Content, { class: contentCls }, () => [
							h(MenuBar.Item, { class: itemCls }, () => 'Documentation'),
							h(MenuBar.Item, { class: itemCls }, () => 'Keyboard Shortcuts'),
						]),
					]),
				]),
			]),
	}),
};
