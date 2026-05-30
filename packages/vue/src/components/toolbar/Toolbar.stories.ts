import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Toolbar } from '.';

const meta = {
	title: 'Layout/Toolbar',
	component: Toolbar.Root,
	subcomponents: {
		'Toolbar.Button': Toolbar.Button,
		'Toolbar.Toggle': Toolbar.Toggle,
		'Toolbar.Link': Toolbar.Link,
		'Toolbar.Separator': Toolbar.Separator,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'An accessible `role="toolbar"` wrapper with roving tabindex — the group is a single tab stop and arrow keys move focus between items (Home/End jump to ends).',
			},
		},
	},
} satisfies Meta<typeof Toolbar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const btnCls =
	'flex size-9 items-center justify-center rounded-md text-sm text-[#374151] hover:bg-[#f3f4f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black aria-pressed:bg-[#e5e7eb]';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Toolbar.Root,
				{
					'aria-label': 'Text formatting',
					class: 'inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1',
				},
				() => [
					h(Toolbar.Button, { class: btnCls, 'aria-label': 'Bold' }, () => h('b', null, 'B')),
					h(Toolbar.Button, { class: btnCls, 'aria-label': 'Italic' }, () => h('i', null, 'I')),
					h(Toolbar.Button, { class: `${btnCls} underline`, 'aria-label': 'Underline' }, () => 'U'),
					h(Toolbar.Separator, { class: 'mx-1 h-5 w-px bg-[#e5e7eb]' }),
					h(Toolbar.Button, { class: btnCls, 'aria-label': 'Align left' }, () => '⬅'),
					h(Toolbar.Button, { class: btnCls, 'aria-label': 'Align center' }, () => '⬌'),
					h(Toolbar.Separator, { class: 'mx-1 h-5 w-px bg-[#e5e7eb]' }),
					h(Toolbar.Link, { href: '#', class: `${btnCls} w-auto px-2` }, () => 'Help'),
				],
			),
	}),
};

export const WithToggles: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Toolbar.Root,
				{
					'aria-label': 'Text formatting',
					class: 'inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1',
				},
				() => [
					h(Toolbar.Toggle, { class: btnCls, 'aria-label': 'Bold', defaultPressed: true }, () => h('b', null, 'B')),
					h(Toolbar.Toggle, { class: btnCls, 'aria-label': 'Italic' }, () => h('i', null, 'I')),
					h(Toolbar.Toggle, { class: `${btnCls} underline`, 'aria-label': 'Underline' }, () => 'U'),
					h(Toolbar.Separator, { class: 'mx-1 h-5 w-px bg-[#e5e7eb]' }),
					h(Toolbar.Toggle, { class: btnCls, 'aria-label': 'Strikethrough', disabled: true }, () => h('s', null, 'S')),
				],
			),
	}),
};

export const Vertical: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Toolbar.Root,
				{
					orientation: 'vertical',
					'aria-label': 'Tools',
					class: 'inline-flex flex-col items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1',
				},
				() => [
					h(Toolbar.Button, { class: btnCls, 'aria-label': 'Move' }, () => '✥'),
					h(Toolbar.Button, { class: btnCls, 'aria-label': 'Draw' }, () => '✎'),
					h(Toolbar.Separator, { class: 'my-1 h-px w-5 bg-[#e5e7eb]' }),
					h(Toolbar.Button, { class: btnCls, 'aria-label': 'Erase' }, () => '⌫'),
				],
			),
	}),
};
