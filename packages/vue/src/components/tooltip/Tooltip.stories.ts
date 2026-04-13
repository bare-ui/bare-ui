import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Tooltip } from '.';

const meta = {
	title: 'Components/Tooltip',
	component: Tooltip.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Hover/focus tooltip with configurable delay and side.',
			},
		},
	},
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const contentCls =
	'rounded-[8px] border-2 border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden whitespace-nowrap';

const solidTriggerCls =
	'rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const outlineTriggerCls =
	'rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-center justify-center p-20' }, [
				h(Tooltip.Root, null, () => [
					h(Tooltip.Trigger, null, () => h('button', { class: solidTriggerCls }, 'Hover me')),
					h(Tooltip.Content, { class: contentCls }, () => 'Tooltip content'),
				]),
			]),
	}),
};

export const NoDelay: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-center justify-center p-20' }, [
				h(Tooltip.Root, { delayDuration: 0 }, () => [
					h(Tooltip.Trigger, null, () => h('button', { class: outlineTriggerCls }, 'Instant tooltip')),
					h(Tooltip.Content, { class: contentCls }, () => 'Shows immediately'),
				]),
			]),
	}),
};

export const Sides: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col items-center justify-center gap-16 p-20' }, [
				h(Tooltip.Root, { delayDuration: 0 }, () => [
					h(Tooltip.Trigger, null, () => h('button', { class: outlineTriggerCls }, 'Top (default)')),
					h(Tooltip.Content, { side: 'top', class: contentCls }, () => 'Tooltip on top'),
				]),
				h(Tooltip.Root, { delayDuration: 0 }, () => [
					h(Tooltip.Trigger, null, () => h('button', { class: outlineTriggerCls }, 'Bottom')),
					h(Tooltip.Content, { side: 'bottom', class: contentCls }, () => 'Tooltip on bottom'),
				]),
				h('div', { class: 'flex gap-24' }, [
					h(Tooltip.Root, { delayDuration: 0 }, () => [
						h(Tooltip.Trigger, null, () => h('button', { class: outlineTriggerCls }, 'Left')),
						h(Tooltip.Content, { side: 'left', class: contentCls }, () => 'Tooltip on left'),
					]),
					h(Tooltip.Root, { delayDuration: 0 }, () => [
						h(Tooltip.Trigger, null, () => h('button', { class: outlineTriggerCls }, 'Right')),
						h(Tooltip.Content, { side: 'right', class: contentCls }, () => 'Tooltip on right'),
					]),
				]),
			]),
	}),
};
