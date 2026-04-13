import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Button } from '.';

const meta = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A native button with full interactive state tracking and asChild polymorphism.',
			},
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

const btnCls = [
	'inline-flex cursor-pointer items-center justify-center rounded-[8px] border-2 border-black px-4 py-2',
	'bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors',
	'[data-hover]:bg-black [data-hover]:text-white',
	'[data-active]:scale-95',
	'[data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500 [data-focus-visible]:ring-offset-2',
	'[data-disabled]:cursor-not-allowed [data-disabled]:opacity-50',
].join(' ');

export const Default: StoryObj = {
	render: () => ({
		setup: () => () => h(Button, null, { default: () => 'Button' }),
	}),
};

export const Styled: StoryObj = {
	render: () => ({
		setup: () => () => h(Button, { class: btnCls }, { default: () => 'Styled Button' }),
	}),
};

export const Disabled: StoryObj = {
	render: () => ({
		setup: () => () => h(Button, { disabled: true, class: btnCls }, { default: () => 'Disabled Button' }),
	}),
};

export const AsChildAnchor: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Button, { asChild: true }, { default: () => h('a', { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer', class: btnCls }, 'Open example.com →') }),
	}),
};
