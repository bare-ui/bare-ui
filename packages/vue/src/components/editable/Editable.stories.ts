import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Editable } from '.';

const meta = {
	title: 'Forms/Editable',
	component: Editable.Root,
	subcomponents: {
		'Editable.Preview': Editable.Preview,
		'Editable.Input': Editable.Input,
		'Editable.Area': Editable.Area,
		'Editable.EditTrigger': Editable.EditTrigger,
		'Editable.SubmitTrigger': Editable.SubmitTrigger,
		'Editable.CancelTrigger': Editable.CancelTrigger,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Inline text editing: click the preview to edit, Enter/blur to commit, Escape to discard. Pair with `Editable.Area` for multiline.',
			},
		},
	},
} satisfies Meta<typeof Editable.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const previewCls =
	'cursor-text rounded-md px-2 py-1 text-sm text-black hover:bg-[#f3f4f6] data-[empty]:text-[#9ca3af]';
const inputCls = 'rounded-md border border-black px-2 py-1 text-sm text-black outline-none';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Editable.Root,
				{ defaultValue: 'Click to edit me', placeholder: 'Enter some text…', class: 'inline-flex' },
				() => [
					h(Editable.Preview, { class: previewCls }),
					h(Editable.Input, { class: inputCls }),
				],
			),
	}),
};

export const WithControls: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Editable.Root,
				{ defaultValue: 'Project title', submitOnBlur: false, class: 'flex items-center gap-2' },
				() => [
					h(Editable.Preview, { class: previewCls }),
					h(Editable.Input, { class: inputCls }),
					h(
						Editable.SubmitTrigger,
						{ class: 'rounded-md bg-black px-2 py-1 text-xs text-white' },
						() => 'Save',
					),
					h(
						Editable.CancelTrigger,
						{ class: 'rounded-md border border-[#d1d5db] px-2 py-1 text-xs' },
						() => 'Cancel',
					),
					h(
						Editable.EditTrigger,
						{ class: 'rounded-md border border-[#d1d5db] px-2 py-1 text-xs' },
						() => 'Edit',
					),
				],
			),
	}),
};

export const Multiline: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Editable.Root,
				{
					defaultValue: 'A longer description that spans multiple lines. Press Cmd/Ctrl+Enter to save.',
					class: 'block w-80',
				},
				() => [
					h(Editable.Preview, {
						class: 'block cursor-text rounded-md p-2 text-sm leading-relaxed text-black hover:bg-[#f3f4f6]',
					}),
					h(Editable.Area, {
						rows: 3,
						class: 'w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none',
					}),
				],
			),
	}),
};
