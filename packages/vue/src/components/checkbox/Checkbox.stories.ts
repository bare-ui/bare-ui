import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Checkbox } from '.';

const meta = {
	title: 'Components/Checkbox',
	component: Checkbox.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Multi-select checkbox group with compound component pattern.',
			},
		},
	},
} satisfies Meta<typeof Checkbox.Root>;

export default meta;

const itemCls = 'flex cursor-pointer items-center gap-3 rounded-lg border-2 border-black px-4 py-3 data-[checked]:bg-black data-[checked]:text-white';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Checkbox.Root, { class: 'flex flex-col gap-2' }, () =>
				['Apple', 'Banana', 'Cherry'].map((fruit) =>
					h(Checkbox.Item, { key: fruit, value: fruit.toLowerCase(), class: itemCls }, () => [
						h(Checkbox.Indicator, { class: 'text-sm' }, () => '✓'),
						h(Checkbox.Label, { class: 'text-sm' }, () => fruit),
					]),
				),
			),
	}),
};
