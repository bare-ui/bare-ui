import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Command } from '.';

const meta = {
	title: 'Overlays/Command',
	component: Command.Root,
	subcomponents: {
		'Command.Input': Command.Input,
		'Command.List': Command.List,
		'Command.Group': Command.Group,
		'Command.Item': Command.Item,
		'Command.Separator': Command.Separator,
		'Command.Empty': Command.Empty,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A command palette (cmdk/kbar-style): grouped, filterable actions with keyboard navigation and an optional global hotkey. Distinct from Combobox — it selects actions, not form values.',
			},
		},
	},
} satisfies Meta<typeof Command.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const paletteCls = 'w-full max-w-md overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-xl';
const inputCls = 'w-full border-b border-[#e5e7eb] px-4 py-3 text-sm text-black outline-none placeholder:text-[#9ca3af]';
const listCls = 'max-h-72 overflow-auto p-2';
const headingCls = 'px-2 py-1.5 text-xs font-medium text-[#9ca3af]';
const itemCls = 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-black data-[active]:bg-[#f3f4f6] data-[disabled]:opacity-40';

// The grouped palette body shared by the Composed and Complex stories.
function makePalette() {
	return [
		h(Command.Input, { placeholder: 'Type a command or search…', class: inputCls }),
		h(Command.List, { class: listCls }, () => [
			h(Command.Empty, { class: 'py-6 text-center text-sm text-[#9ca3af]' }, () => 'No results found.'),
			h(Command.Group, { heading: 'Suggestions', class: '[&[hidden]]:hidden' }, () => [
				h('div', { class: headingCls }, 'Suggestions'),
				h(Command.Item, { value: 'New File', keywords: ['create', 'document'], class: itemCls }, () => '📄 New File'),
				h(Command.Item, { value: 'Search Docs', keywords: ['find', 'help'], class: itemCls }, () => '🔍 Search Docs'),
			]),
			h(Command.Separator, { class: 'my-1 h-px bg-[#f3f4f6]' }),
			h(Command.Group, { class: '[&[hidden]]:hidden' }, () => [
				h('div', { class: headingCls }, 'Settings'),
				h(Command.Item, { value: 'Profile', class: itemCls }, () => '👤 Profile'),
				h(Command.Item, { value: 'Appearance', keywords: ['theme', 'dark mode'], class: itemCls }, () => '🎨 Appearance'),
				h(Command.Item, { value: 'Billing', disabled: true, class: itemCls }, () => '💳 Billing (disabled)'),
			]),
		]),
	];
}

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Command.Root, { class: paletteCls }, () => [
				h(Command.Input, { placeholder: 'Type a command or search…', class: inputCls }),
				h(Command.List, { class: listCls }, () => [
					h(Command.Empty, { class: 'py-6 text-center text-sm text-[#9ca3af]' }, () => 'No results found.'),
					h(Command.Item, { value: 'New File', keywords: ['create', 'document'], class: itemCls }, () => '📄 New File'),
					h(Command.Item, { value: 'Search Docs', keywords: ['find', 'help'], class: itemCls }, () => '🔍 Search Docs'),
					h(Command.Item, { value: 'Open Settings', keywords: ['preferences'], class: itemCls }, () => '⚙️ Open Settings'),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Command.Root,
				{ class: paletteCls, onSelect: (v: string) => console.log('selected', v) },
				() => makePalette(),
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const open = ref(false);
			return () =>
				h('div', { class: 'flex h-64 items-start justify-center' }, [
					h('p', { class: 'text-sm text-[#6b7280]' }, [
						'Press ',
						h('kbd', { class: 'rounded border border-[#d1d5db] px-1.5' }, '⌘'),
						h('kbd', { class: 'rounded border border-[#d1d5db] px-1.5' }, 'K'),
						' to open the palette.',
					]),
					h(
						Command.Root,
						{
							open: open.value,
							onOpenChange: (v: boolean) => {
								open.value = v;
							},
							shortcut: 'mod+k',
							class: `fixed left-1/2 top-[12vh] z-50 -translate-x-1/2 ${paletteCls}`,
						},
						() => makePalette(),
					),
				]);
		},
	}),
};
