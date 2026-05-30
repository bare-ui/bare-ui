import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Tooltip } from '.';

const meta = {
	title: 'Overlays/Tooltip',
	component: Tooltip.Root,
	subcomponents: {
		'Tooltip.Trigger': Tooltip.Trigger,
		'Tooltip.Content': Tooltip.Content,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Hover tooltip with configurable delay and placement.',
			},
		},
	},
} satisfies Meta<typeof Tooltip.Root>;

export default meta;

const contentCls =
	'rounded-[8px] border border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden whitespace-nowrap';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Tooltip.Root, { delayDuration: 0 }, () => [
				h(Tooltip.Trigger, () =>
					h(
						'button',
						{
							class: 'rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]',
						},
						'Hover me',
					),
				),
				h(Tooltip.Content, { side: 'top', class: contentCls }, () => 'Tooltip on top'),
			]),
	}),
};

export const Composed: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col items-center gap-16' }, [
				h(Tooltip.Root, { delayDuration: 0 }, () => [
					h(Tooltip.Trigger, () =>
						h(
							'button',
							{
								class: 'rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]',
							},
							'Top',
						),
					),
					h(Tooltip.Content, { side: 'top', class: contentCls }, () => 'Tooltip on top'),
				]),
				h('div', { class: 'flex gap-24' }, [
					h(Tooltip.Root, { delayDuration: 0 }, () => [
						h(Tooltip.Trigger, () =>
							h(
								'button',
								{
									class: 'rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]',
								},
								'Left',
							),
						),
						h(Tooltip.Content, { side: 'left', class: contentCls }, () => 'Tooltip on left'),
					]),
					h(Tooltip.Root, { delayDuration: 0 }, () => [
						h(Tooltip.Trigger, () =>
							h(
								'button',
								{
									class: 'rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]',
								},
								'Right',
							),
						),
						h(Tooltip.Content, { side: 'right', class: contentCls }, () => 'Tooltip on right'),
					]),
				]),
				h(Tooltip.Root, { delayDuration: 0 }, () => [
					h(Tooltip.Trigger, () =>
						h(
							'button',
							{
								class: 'rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]',
							},
							'Bottom',
						),
					),
					h(Tooltip.Content, { side: 'bottom', class: contentCls }, () => 'Tooltip on bottom'),
				]),
			]),
	}),
};

export const Complex: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-center gap-6' }, [
				h(Tooltip.Root, { delayDuration: 0 }, () => [
					h(Tooltip.Trigger, () =>
						h(
							'button',
							{
								class: 'rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]',
							},
							'Outline Button',
						),
					),
					h(Tooltip.Content, { side: 'top', class: contentCls }, () => 'This is an outline trigger'),
				]),
				h(Tooltip.Root, { delayDuration: 0 }, () => [
					h(Tooltip.Trigger, () =>
						h(
							'button',
							{
								class: 'rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]',
							},
							'Solid Button',
						),
					),
					h(Tooltip.Content, { side: 'top', class: contentCls }, () => 'This is a solid trigger'),
				]),
			]),
	}),
};
