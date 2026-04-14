import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { ProgressBar } from '.';

const meta = {
	title: 'Components/ProgressBar',
	component: ProgressBar,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless progress bar with ARIA attributes and fill element.',
			},
		},
	},
} satisfies Meta<typeof ProgressBar>;

export default meta;

const barCls = 'h-3 w-full overflow-hidden rounded-full border-2 border-black bg-white [&>[data-part=fill]]:h-full [&>[data-part=fill]]:bg-black [&>[data-part=fill]]:transition-all';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () => h(ProgressBar, { percentage: 60, class: barCls }),
	}),
};

export const Empty: StoryObj = {
	render: () => ({
		setup: () => () => h(ProgressBar, { percentage: 0, class: barCls }),
	}),
};

export const Full: StoryObj = {
	render: () => ({
		setup: () => () => h(ProgressBar, { percentage: 100, class: barCls }),
	}),
};
