import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Button } from '.';

const meta = {
	title: 'Forms/Button',
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

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(
				Button,
				{
					class: 'inline-flex cursor-pointer items-center justify-center rounded-[8px] border-2 border-black px-4 py-2 bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500 [data-focus-visible]:ring-offset-2 [data-disabled]:cursor-not-allowed [data-disabled]:opacity-50',
				},
				() => 'Styled Button',
			),
	}),
};

export const Composed: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Button, { asChild: true }, () =>
				h(
					'a',
					{
						href: 'https://example.com',
						target: '_blank',
						rel: 'noopener noreferrer',
						class: 'no-underline inline-flex cursor-pointer items-center justify-center rounded-[8px] border-2 border-black px-4 py-2 bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500 [data-focus-visible]:ring-offset-2 [data-disabled]:cursor-not-allowed [data-disabled]:opacity-50',
					},
					'Open example.com \u2192',
				),
			),
	}),
};

export const Complex: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-4' }, [
				h(
					'p',
					{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280]' },
					'Data attributes showcase',
				),
				h(
					'p',
					{ class: 'text-sm text-[#6b7280]' },
					'Hover, click, and tab to each button \u2014 data attributes change in real time.',
				),
				h('div', { class: 'flex flex-wrap gap-4' }, [
					h(
						Button,
						{
							class: 'cursor-pointer rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500',
						},
						() => 'Hover me',
					),
					h(
						Button,
						{
							class: 'cursor-pointer rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500',
						},
						() => 'Tab to me',
					),
					h(
						Button,
						{
							disabled: true,
							class: 'cursor-not-allowed rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none [data-disabled]:opacity-50',
						},
						() => 'Disabled',
					),
				]),
			]),
	}),
};
