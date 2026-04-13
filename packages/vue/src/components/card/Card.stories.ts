import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Card } from './Card';

const meta = {
	title: 'Components/Card',
	component: Card,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless card container with color and size data attributes.',
			},
		},
	},
} satisfies Meta<typeof Card>;

export default meta;

const cardCls = 'rounded-[20px] border-[3px] border-black bg-white p-6';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Card, { class: cardCls }, { default: () => h('p', { class: 'text-sm text-black' }, 'A simple card.') }),
	}),
};
