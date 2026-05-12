import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { ContextMenu } from '.';

const meta = {
	title: 'Overlays/ContextMenu',
	component: ContextMenu.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Right-click triggered menu. Positioned at the cursor; closes on outside click or Escape.',
			},
		},
	},
} satisfies Meta<typeof ContextMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls =
	'flex h-32 w-72 items-center justify-center rounded-[20px] border border-dashed border-black bg-[#f5f5f5] text-sm text-[#6b7280] select-none';
const contentCls = 'min-w-[180px] rounded-[20px] border border-black bg-white p-1';
const itemCls =
	'cursor-pointer rounded-[8px] px-3 py-1.5 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[focus-visible]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';
const sepCls = 'my-1 h-px bg-black';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(ContextMenu.Root, {}, () => [
				h(ContextMenu.Trigger, { class: triggerCls }, () => 'Right-click here'),
				h(ContextMenu.Content, { class: contentCls }, () => [
					h(
						ContextMenu.Item,
						{ class: itemCls, onSelect: () => alert('Cut') },
						() => 'Cut',
					),
					h(
						ContextMenu.Item,
						{ class: itemCls, onSelect: () => alert('Copy') },
						() => 'Copy',
					),
					h(
						ContextMenu.Item,
						{ class: itemCls, onSelect: () => alert('Paste') },
						() => 'Paste',
					),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(ContextMenu.Root, {}, () => [
				h(ContextMenu.Trigger, { class: triggerCls }, () => 'Right-click for actions'),
				h(ContextMenu.Content, { class: contentCls }, () => [
					h(ContextMenu.Item, { class: itemCls }, () => 'Open'),
					h(ContextMenu.Item, { class: itemCls }, () => 'Open in new tab'),
					h(ContextMenu.Separator, { class: sepCls }),
					h(ContextMenu.Item, { class: itemCls }, () => 'Rename'),
					h(ContextMenu.Item, { class: itemCls }, () => 'Duplicate'),
					h(ContextMenu.Separator, { class: sepCls }),
					h(ContextMenu.Item, { class: itemCls }, () => 'Delete'),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(ContextMenu.Root, {}, () => [
				h(ContextMenu.Trigger, { class: triggerCls }, () => [
					h('div', { class: 'text-center' }, [
						h('p', { class: 'text-sm font-medium text-black' }, 'image.png'),
						h('p', { class: 'text-xs text-[#6b7280]' }, 'Right-click for options'),
					]),
				]),
				h(ContextMenu.Content, { class: contentCls }, () => [
					h(ContextMenu.Item, { class: itemCls }, () => [
						h('div', { class: 'flex items-center justify-between gap-6' }, [
							h('span', {}, 'Open'),
							h('kbd', { class: 'text-[10px] text-[#6b7280]' }, '⏎'),
						]),
					]),
					h(ContextMenu.Item, { class: itemCls }, () => [
						h('div', { class: 'flex items-center justify-between gap-6' }, [
							h('span', {}, 'Copy'),
							h('kbd', { class: 'text-[10px] text-[#6b7280]' }, '⌘C'),
						]),
					]),
					h(ContextMenu.Item, { class: itemCls }, () => [
						h('div', { class: 'flex items-center justify-between gap-6' }, [
							h('span', {}, 'Move to…'),
							h('span', { class: 'text-[10px] text-[#6b7280]' }, '›'),
						]),
					]),
					h(ContextMenu.Separator, { class: sepCls }),
					h(
						ContextMenu.Item,
						{ class: itemCls, disabled: true },
						() => 'Move to trash',
					),
				]),
			]),
	}),
};
