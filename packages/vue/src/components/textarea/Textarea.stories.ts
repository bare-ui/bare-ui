import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Textarea } from '.';

const meta = {
	title: 'Forms/Textarea',
	component: Textarea.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Compound textarea with label, validation, and error display.',
			},
		},
	},
} satisfies Meta<typeof Textarea.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Textarea.Root, { class: 'flex max-w-xs flex-col gap-1.5' }, () => [
				h(Textarea.Label, { class: 'text-sm font-medium text-black' }, () => 'Message'),
				h(Textarea.Field, {
					placeholder: 'Type your message here...',
					rows: 4,
					class: 'w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1',
				}),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Textarea.Root,
				{
					isRequired: true,
					errorMessage: { required: 'This field is required' },
					class: 'flex max-w-xs flex-col gap-1.5',
				},
				() => [
					h(Textarea.Label, { class: 'text-sm font-medium text-black' }, () => 'Feedback'),
					h(Textarea.Field, {
						placeholder: 'Your feedback is important...',
						rows: 4,
						class: 'w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1',
					}),
					h(Textarea.Error, { class: 'text-xs text-black' }),
				],
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const value = ref('');
			return () =>
				h(
					Textarea.Root,
					{
						value: value.value,
						onChange: (v: string) => (value.value = v),
						class: 'flex max-w-xs flex-col gap-1.5',
					},
					() => [
						h(Textarea.Label, { class: 'text-sm font-medium text-black' }, () => 'Bio'),
						h('p', { class: 'text-xs text-[#6b7280]' }, 'Write a short bio about yourself.'),
						h(Textarea.Field, {
							placeholder: 'Tell us about yourself...',
							rows: 4,
							maxlength: 200,
							class: 'w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1',
						}),
						h('p', { class: 'text-right text-xs text-[#6b7280]' }, `${value.value.length}/200`),
					],
				);
		},
	}),
};
