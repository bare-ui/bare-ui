import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Textarea } from '.';

const meta = {
	title: 'Components/Textarea',
	component: Textarea.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Compound multi-line text input with consumer-controlled error state.',
			},
		},
	},
} satisfies Meta<typeof Textarea.Root>;

export default meta;

const fieldCls =
	'w-full rounded-[8px] border-2 border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Textarea.Root, { class: 'w-80' }, () => [
				h(Textarea.Field, { placeholder: 'Write something...', rows: 4, class: fieldCls }),
			]),
	}),
};

export const WithLabel: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Textarea.Root, { class: 'flex w-80 flex-col gap-1.5' }, () => [
				h(Textarea.Label, { class: 'text-sm font-medium text-black' }, () => 'Message'),
				h(Textarea.Field, { placeholder: 'Type your message here...', rows: 4, class: fieldCls }),
			]),
	}),
};

export const Required: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(
				Textarea.Root,
				{
					isRequired: true,
					errorMessage: { required: 'This field is required' },
					class: 'flex w-80 flex-col gap-1.5',
				},
				() => [
					h(Textarea.Label, { class: 'text-sm font-medium text-black' }, () => 'Feedback'),
					h(Textarea.Field, { placeholder: 'Your feedback is important...', rows: 4, class: fieldCls }),
					h(Textarea.Error, { class: 'text-xs text-black' }),
				],
			),
	}),
};
