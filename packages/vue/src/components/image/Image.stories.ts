import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Image } from '.';

const meta = {
	title: 'Components/Image',
	component: Image,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless image component with loading state and position support.',
			},
		},
	},
} satisfies Meta<typeof Image>;

export default meta;

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Image, {
				src: 'https://picsum.photos/400/300',
				alt: 'Random image',
				class: 'overflow-hidden rounded-lg border-2 border-black',
			}),
	}),
};
