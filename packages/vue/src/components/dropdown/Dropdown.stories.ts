import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Dropdown } from '.';

const meta = {
	title: 'Components/Dropdown',
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
	'absolute left-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border-[3px] border-black bg-white py-1 shadow-lg';

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

export const PositionLeft: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex justify-end p-8' }, [
				h(Dropdown.Root, { class: 'relative inline-block' }, () => [
					h(Dropdown.Trigger, { class: triggerCls }, () => 'Left Aligned'),
					h(Dropdown.Menu, { position: 'left', class: menuCls }, () => [
						h('div', { class: itemCls }, 'Option A'),
						h('div', { class: itemCls }, 'Option B'),
						h('div', { class: itemCls }, 'Option C'),
					]),
				]),
			]),
	}),
};
