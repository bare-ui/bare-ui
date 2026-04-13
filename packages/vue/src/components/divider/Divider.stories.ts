import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Divider } from './Divider';

const meta = {
	title: 'Components/Divider',
	component: Divider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless visual or semantic divider with orientation support.',
			},
		},
	},
} satisfies Meta<typeof Divider>;

export default meta;

export const Horizontal: StoryObj = {
	render: () => ({
		setup: () => () => h(Divider, { class: 'h-0.5 w-full bg-black' }),
	}),
};

export const Vertical: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex h-20 items-center gap-4' }, [
				h('span', 'Left'),
				h(Divider, { orientation: 'vertical', class: 'w-0.5 self-stretch bg-black' }),
				h('span', 'Right'),
			]),
	}),
};
