import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Dropdown } from '.';

const meta = {
	title: 'Overlays/Dropdown',
	component: Dropdown.Root,
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
	'inline-flex items-center rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const menuCls =
	'absolute left-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border-[3px] border-black bg-white py-1';

const itemCls = 'cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Dropdown.Root, { class: 'relative inline-block' }, () => [
				h(Dropdown.Trigger, { class: triggerCls }, () => 'Open Menu'),
				h(Dropdown.Menu, { class: menuCls }, () => [
					h('div', { class: itemCls }, 'Profile'),
					h('div', { class: itemCls }, 'Settings'),
					h('div', { class: itemCls }, 'Sign out'),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(Dropdown.Root, { class: 'relative inline-block' }, () => [
				h(Dropdown.Trigger, { class: triggerCls }, () => 'Actions'),
				h(Dropdown.Menu, { class: menuCls }, () => [
					h('div', { class: itemCls }, 'Edit'),
					h('div', { class: itemCls }, 'Duplicate'),
					h('div', { class: 'my-1 border-t-2 border-black' }),
					h('div', { class: itemCls }, 'Archive'),
					h('div', { class: itemCls }, 'Delete'),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(Dropdown.Root, { class: 'relative inline-block' }, () => [
				h(
					Dropdown.Trigger,
					{
						class: 'inline-flex items-center gap-2 rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]',
					},
					() => [
						h('svg', { class: 'h-5 w-5', viewBox: '0 0 20 20', fill: 'currentColor' }, [
							h('path', {
								'fill-rule': 'evenodd',
								d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z',
								'clip-rule': 'evenodd',
							}),
						]),
						'Account',
					],
				),
				h(
					Dropdown.Menu,
					{
						class: 'absolute left-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-[20px] border-[3px] border-black bg-white py-1',
					},
					() => [
						h('div', { class: itemCls }, [h('span', { class: 'mr-2' }, '\u{1F464}'), 'Profile']),
						h('div', { class: itemCls }, [h('span', { class: 'mr-2' }, '\u2699\uFE0F'), 'Settings']),
						h('div', { class: itemCls }, [h('span', { class: 'mr-2' }, '\u{1F4CA}'), 'Analytics']),
						h('div', { class: 'my-1 border-t-2 border-black' }),
						h(
							'div',
							{ class: 'cursor-pointer px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]' },
							[h('span', { class: 'mr-2' }, '\u{1F6AA}'), 'Sign out'],
						),
					],
				),
			]),
	}),
};
