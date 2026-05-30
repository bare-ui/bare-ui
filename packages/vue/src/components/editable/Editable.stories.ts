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

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-6' }, [
				h('div', { class: 'space-y-1' }, [
					h('p', { class: 'text-xs font-medium text-[#6b7280]' }, 'With explicit controls'),
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
				]),
				h('div', { class: 'space-y-1' }, [
					h('p', { class: 'text-xs font-medium text-[#6b7280]' }, 'Multiline (Cmd/Ctrl+Enter to save)'),
					h(
						Editable.Root,
						{
							defaultValue: 'A longer description that spans multiple lines.',
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
				]),
				h('div', { class: 'space-y-1' }, [
					h('p', { class: 'text-xs font-medium text-[#6b7280]' }, 'Disabled'),
					h(
						Editable.Root,
						{ defaultValue: 'Read-only value', disabled: true, class: 'inline-flex' },
						() => [
							h(Editable.Preview, {
								class: 'cursor-not-allowed rounded-md px-2 py-1 text-sm text-[#9ca3af]',
							}),
							h(Editable.Input, { class: inputCls }),
						],
					),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'w-80 rounded-2xl border border-[#e5e7eb] bg-white p-5' }, [
				h('div', { class: 'mb-4 flex items-center gap-3' }, [
					h(
						'div',
						{
							class: 'flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-lg font-semibold text-[#374151]',
						},
						'JA',
					),
					h('div', { class: 'min-w-0 flex-1' }, [
						h(
							Editable.Root,
							{ defaultValue: 'Jerald Austero', class: 'block' },
							() => [
								h(Editable.Preview, {
									class: 'block w-full cursor-text rounded-md px-2 py-0.5 text-sm font-semibold text-black hover:bg-[#f3f4f6]',
								}),
								h(Editable.Input, {
									class: 'w-full rounded-md border border-black px-2 py-0.5 text-sm font-semibold outline-none',
								}),
							],
						),
						h(
							Editable.Root,
							{ defaultValue: 'Product Designer', class: 'block' },
							() => [
								h(Editable.Preview, {
									class: 'block w-full cursor-text rounded-md px-2 py-0.5 text-xs text-[#6b7280] hover:bg-[#f3f4f6]',
								}),
								h(Editable.Input, {
									class: 'w-full rounded-md border border-black px-2 py-0.5 text-xs outline-none',
								}),
							],
						),
					]),
				]),
				h('label', { class: 'mb-1 block text-xs font-medium text-[#374151]' }, 'Bio'),
				h(
					Editable.Root,
					{
						defaultValue: 'Designing accessible component systems.',
						placeholder: 'Add a short bio…',
						class: 'block',
					},
					() => [
						h(Editable.Preview, {
							class: 'block w-full cursor-text rounded-md border border-transparent p-2 text-sm leading-relaxed text-black hover:border-[#e5e7eb] data-[empty]:text-[#9ca3af]',
						}),
						h(Editable.Area, {
							rows: 3,
							class: 'w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none',
						}),
					],
				),
			]),
	}),
};
