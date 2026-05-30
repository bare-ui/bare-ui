import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Input } from '.';

const meta = {
	title: 'Forms/Input',
	component: Input.Root,
	subcomponents: {
		'Input.Field': Input.Field,
		'Input.Label': Input.Label,
		'Input.Error': Input.Error,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Compound text input with consumer-controlled error state.',
			},
		},
	},
} satisfies Meta<typeof Input.Root>;

export default meta;

const fieldCls =
	'w-full rounded-[8px] bg-white border border-black px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Input.Root, { class: 'flex w-full max-w-xs flex-col gap-1.5' }, () => [
				h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Full Name'),
				h(Input.Field, { placeholder: 'John Doe', class: fieldCls }),
			]),
	}),
};

export const Composed: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(
				Input.Root,
				{
					invalidType: 'email',
					defaultValue: 'not-an-email',
					errorMessage: { email: 'Please enter a valid email address' },
					class: 'flex w-full max-w-xs flex-col gap-1.5',
				},
				() => [
					h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Email'),
					h(Input.Field, { type: 'email', class: fieldCls }),
					h(Input.Error, { class: 'text-xs text-black' }),
				],
			),
	}),
};

export const Complex: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-6 max-w-xs' }, [
				h(Input.Root, { class: 'flex flex-col gap-1.5' }, () => [
					h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Full Name'),
					h(Input.Field, { placeholder: 'John Doe', class: fieldCls }),
				]),
				h(
					Input.Root,
					{
						invalidType: 'email',
						defaultValue: 'not-an-email',
						errorMessage: { email: 'Please enter a valid email address' },
						class: 'flex flex-col gap-1.5',
					},
					() => [
						h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Email'),
						h(Input.Field, { type: 'email', class: fieldCls }),
						h(Input.Error, { class: 'text-xs text-black' }),
					],
				),
				h(Input.Root, { isSuccess: true, defaultValue: 'available_user', class: 'flex flex-col gap-1.5' }, () => [
					h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Username'),
					h(Input.Field, { class: fieldCls }),
					h('span', { class: 'text-xs text-black' }, 'Username is available'),
				]),
			]),
	}),
};
