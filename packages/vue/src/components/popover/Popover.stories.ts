import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Popover } from '.';

const meta = {
	title: 'Overlays/Popover',
	component: Popover.Root,
	subcomponents: {
		'Popover.Trigger': Popover.Trigger,
		'Popover.Content': Popover.Content,
		'Popover.Close': Popover.Close,
	},
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
	render: () => ({
		setup: () => () =>
			h(Popover.Root, { class: 'relative inline-block' }, () => [
				h(Popover.Trigger, { class: triggerCls }, () => 'Show details'),
				h(Popover.Content, { class: panelCls }, () => [
					h('p', { class: 'font-medium mb-1' }, 'Popover'),
					h('p', { class: 'text-[#6b7280]' }, 'This is a basic popover. Click outside or press Escape to close.'),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(Popover.Root, { class: 'relative inline-block' }, () => [
				h(Popover.Trigger, { class: triggerCls }, () => 'Account'),
				h(Popover.Content, { class: 'absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-4' }, () => [
					h('div', { class: 'flex items-center gap-3 pb-3 border-b border-black' }, [
						h('div', { class: 'flex size-10 items-center justify-center rounded-full border border-black bg-[#f5f5f5] text-sm font-semibold text-black' }, 'JD'),
						h('div', null, [
							h('p', { class: 'text-sm font-medium text-black' }, 'Jane Doe'),
							h('p', { class: 'text-xs text-[#6b7280]' }, 'jane@example.com'),
						]),
					]),
					h('nav', { class: 'mt-3 flex flex-col' }, [
						h('button', { class: 'cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm text-black hover:bg-[#f5f5f5]' }, 'Profile'),
						h('button', { class: 'cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm text-black hover:bg-[#f5f5f5]' }, 'Settings'),
						h(Popover.Close, { class: 'cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm font-medium text-black hover:bg-[#f5f5f5]' }, () => 'Sign out'),
					]),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-12 items-center py-8' }, [
				h('div', { class: 'flex gap-6' }, [
					h(Popover.Root, { class: 'relative inline-block' }, () => [
						h(Popover.Trigger, { class: 'cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]' }, () => 'Top'),
						h(Popover.Content, { side: 'top', class: 'absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 w-48 rounded-[20px] border border-black bg-white p-3 text-xs text-black' }, () => 'Anchored to top'),
					]),
					h(Popover.Root, { class: 'relative inline-block' }, () => [
						h(Popover.Trigger, { class: 'cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]' }, () => 'Bottom'),
						h(Popover.Content, { side: 'bottom', class: 'absolute left-1/2 top-full z-10 -translate-x-1/2 mt-2 w-48 rounded-[20px] border border-black bg-white p-3 text-xs text-black' }, () => 'Anchored to bottom'),
					]),
				]),
				h(Popover.Root, { class: 'relative inline-block' }, () => [
					h(Popover.Trigger, { class: 'cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]' }, () => 'Form popover'),
					h(Popover.Content, { class: 'absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-4' }, () => [
						h('h3', { class: 'mb-3 text-sm font-semibold text-black' }, 'Quick edit'),
						h('div', { class: 'flex flex-col gap-3' }, [
							h('label', { class: 'text-xs font-medium text-black' }, [
								'Name',
								h('input', { type: 'text', value: 'Jane', class: 'mt-1 w-full rounded-[8px] border border-black bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black' }),
							]),
							h('label', { class: 'text-xs font-medium text-black' }, [
								'Email',
								h('input', { type: 'email', value: 'jane@example.com', class: 'mt-1 w-full rounded-[8px] border border-black bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black' }),
							]),
							h('div', { class: 'flex gap-2 mt-1' }, [
								h(Popover.Close, { class: 'flex-1 cursor-pointer rounded-[8px] border border-black py-1.5 text-sm font-medium text-black hover:bg-[#f5f5f5]' }, () => 'Cancel'),
								h(Popover.Close, { class: 'flex-1 cursor-pointer rounded-[8px] border border-black bg-black py-1.5 text-sm font-medium text-white hover:bg-[#333]' }, () => 'Save'),
							]),
						]),
					]),
				]),
			]),
	}),
};
