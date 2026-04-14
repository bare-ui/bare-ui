import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Icon } from '.';

const sampleIcons = {
	alert: '<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" fill="currentColor"/></svg>',
	home: '<svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
};

const meta = {
	title: 'Components/Icon',
	component: Icon,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless SVG icon renderer with size and accessibility support.',
			},
		},
	},
} satisfies Meta<typeof Icon>;

export default meta;

export const Default: StoryObj = {
	render: () => ({
		setup: () => () => h(Icon, { type: 'alert', icons: sampleIcons, class: 'size-6' }),
	}),
};

export const WithLabel: StoryObj = {
	render: () => ({
		setup: () => () => h(Icon, { type: 'home', label: 'Home', icons: sampleIcons, class: 'size-8' }),
	}),
};
