import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Radio } from '.';

const meta = {
	title: 'Components/Radio',
	component: Radio.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Single-select radio group with compound component pattern.',
			},
		},
	},
} satisfies Meta<typeof Radio.Root>;

export default meta;

const itemCls = 'flex cursor-pointer items-center gap-3 rounded-lg border-2 border-black px-4 py-3 data-[checked]:bg-black data-[checked]:text-white';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Radio.Root, { class: 'flex flex-col gap-2' }, () =>
				['Red', 'Blue', 'Green'].map((color) =>
					h(Radio.Item, { key: color, value: color.toLowerCase(), class: itemCls }, () => [
						h(Radio.Indicator, { class: 'text-sm' }, () => '●'),
						h(Radio.Label, { class: 'text-sm' }, () => color),
					]),
				),
			),
	}),
};
