import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { List } from './List';

const meta = {
	title: 'Components/List',
	component: List,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless list container with type and size data attributes.',
			},
		},
	},
} satisfies Meta<typeof List>;

export default meta;

export const Unordered: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(List, { class: 'list-disc pl-6 text-sm' }, { default: () => ['Apple', 'Banana', 'Cherry'].map((f) => h('li', { key: f }, f)) }),
	}),
};

export const Ordered: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(List, { isOrdered: true, class: 'list-decimal pl-6 text-sm' }, { default: () => ['First', 'Second', 'Third'].map((f) => h('li', { key: f }, f)) }),
	}),
};
