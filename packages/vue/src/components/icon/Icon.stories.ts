import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Icon } from '.';

const meta = {
	title: 'Media/Icon',
	component: Icon,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'SVG icon renderer from a raw SVG string map.',
			},
		},
	},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

const icons = {
	'caret-down':
		'<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',
	'warning-triangle':
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
	x: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>',
};

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-center gap-8' }, [
				h(Icon, { type: 'caret-down', icons, size: 'small', class: '[data-size=small]:size-4 text-black' }),
				h(Icon, {
					type: 'warning-triangle',
					icons,
					size: 'small',
					class: '[data-size=small]:size-4 text-black',
				}),
				h(Icon, { type: 'x', icons, size: 'small', class: '[data-size=small]:size-4 text-black' }),
			]),
	}),
};
