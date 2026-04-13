import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Switch } from '.';

const meta = {
	title: 'Components/Switch',
	component: Switch.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A toggle switch with compound Root and Thumb pattern.',
			},
		},
	},
} satisfies Meta<typeof Switch.Root>;

export default meta;

const rootCls = 'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full border-2 border-black bg-white transition-colors data-[checked]:bg-black';
const thumbCls = 'inline-block size-5 rounded-full bg-black transition-transform data-[checked]:translate-x-5 data-[checked]:bg-white';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () => h(Switch.Root, { class: rootCls }, () => h(Switch.Thumb, { class: thumbCls })),
	}),
};

export const Checked: StoryObj = {
	render: () => ({
		setup: () => () => h(Switch.Root, { defaultChecked: true, class: rootCls }, () => h(Switch.Thumb, { class: thumbCls })),
	}),
};

export const Disabled: StoryObj = {
	render: () => ({
		setup: () => () => h(Switch.Root, { disabled: true, class: `${rootCls} opacity-50 cursor-not-allowed` }, () => h(Switch.Thumb, { class: thumbCls })),
	}),
};
