import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Input } from '.';

const meta = {
	title: 'Components/Input',
	component: Input.Root,
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
	'w-full rounded-[8px] border-2 border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Input.Root, { class: 'w-72' }, () => [
				h(Input.Field, { placeholder: 'Enter text...', class: fieldCls }),
			]),
	}),
};

export const WithLabel: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Input.Root, { class: 'flex w-72 flex-col gap-1.5' }, () => [
				h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Full Name'),
				h(Input.Field, { placeholder: 'John Doe', class: fieldCls }),
			]),
	}),
};

export const Required: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Input.Root, { isRequired: true, class: 'flex w-72 flex-col gap-1.5' }, () => [
				h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Username'),
				h(Input.Field, { placeholder: 'Required field', class: fieldCls }),
				h(Input.Error, { class: 'text-xs text-black' }, () => 'This field is required'),
			]),
	}),
};

export const WithError: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(
				Input.Root,
				{
					invalidType: 'email',
					defaultValue: 'not-an-email',
					errorMessage: { email: 'Please enter a valid email address' },
					class: 'flex w-72 flex-col gap-1.5',
				},
				() => [
					h(Input.Label, { class: 'text-sm font-medium text-black' }, () => 'Email'),
					h(Input.Field, { type: 'email', class: fieldCls }),
					h(Input.Error, { class: 'text-xs text-black' }),
				],
			),
	}),
};
