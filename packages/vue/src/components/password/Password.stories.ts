import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Password } from '.';

const meta = {
	title: 'Components/Password',
	component: Password.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Password input with a built-in show/hide toggle and consumer-controlled error state.',
			},
		},
	},
} satisfies Meta<typeof Password.Root>;

export default meta;

const fieldCls =
	'w-full rounded-[8px] border-2 border-black px-3 py-2 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';

const toggleCls =
	'group absolute inset-y-0 right-0 flex items-center px-3 text-[#9ca3af] outline-none transition hover:text-black data-[visible]:text-black';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Password.Root, { class: 'w-72' }, () => [
				h('div', { class: 'relative' }, [
					h(Password.Field, { placeholder: 'Enter password', class: fieldCls }),
					h(Password.Toggle, { class: toggleCls }, () => 'Toggle'),
				]),
			]),
	}),
};

export const WithLabel: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Password.Root, { class: 'flex w-72 flex-col gap-1.5' }, () => [
				h(Password.Label, { class: 'text-sm font-medium text-black' }, () => 'Password'),
				h('div', { class: 'relative' }, [
					h(Password.Field, { placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', class: fieldCls }),
					h(Password.Toggle, { class: toggleCls }, () => 'Toggle'),
				]),
			]),
	}),
};

export const Required: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(
				Password.Root,
				{
					isRequired: true,
					errorMessage: { required: 'Password is required' },
					class: 'flex w-72 flex-col gap-1.5',
				},
				() => [
					h(Password.Label, { class: 'text-sm font-medium text-black' }, () => 'Password'),
					h('div', { class: 'relative' }, [
						h(Password.Field, { placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', class: fieldCls }),
						h(Password.Toggle, { class: toggleCls }, () => 'Toggle'),
					]),
					h(Password.Error, { class: 'text-xs text-black' }),
				],
			),
	}),
};
