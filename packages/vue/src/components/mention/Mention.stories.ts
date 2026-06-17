import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Mention } from '.';
import type { MentionOption } from './Mention.types';

const meta = {
	title: 'AI/Mention',
	component: Mention.Root,
	subcomponents: {
		'Mention.Input': Mention.Input,
		'Mention.Content': Mention.Content,
		'Mention.Items': Mention.Items,
		'Mention.Empty': Mention.Empty,
	},
	tags: ['autodocs'],
	args: { options: [] },
	parameters: {
		docs: {
			description: {
				component:
					'Inline `@`-mention primitive: a combobox that tracks the caret inside a textarea, filters as you type, and inserts the chosen token. The trigger character, options and filtering are all configurable.',
			},
		},
	},
} satisfies Meta<typeof Mention.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const people: MentionOption[] = [
	{ id: 1, label: 'Ada Lovelace' },
	{ id: 2, label: 'Alan Turing' },
	{ id: 3, label: 'Grace Hopper' },
	{ id: 4, label: 'Katherine Johnson' },
	{ id: 5, label: 'Linus Torvalds', disabled: true },
];

const inputCls =
	'w-full resize-none rounded-lg border border-[#d1d5db] p-3 text-sm text-black outline-none focus:border-black';
const contentCls = 'z-10 mt-1 max-h-56 w-56 overflow-auto rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-lg';
const itemCls =
	'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-black data-[active]:bg-[#f3f4f6] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Mention.Root, { options: people, defaultValue: 'Hey ', class: 'relative w-full max-w-md' }, () => [
				h(Mention.Input, {
					'aria-label': 'Comment',
					rows: 4,
					placeholder: 'Type @ to mention someone…',
					class: inputCls,
				}),
				h(Mention.Content, { class: contentCls }, () => [
					h(Mention.Items, null, {
						default: ({ option }: { option: MentionOption }) =>
							h('div', { class: itemCls }, [
								h(
									'span',
									{
										class: 'flex size-6 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-[#4338ca]',
									},
									option.label.charAt(0),
								),
								option.label,
							]),
					}),
					h(Mention.Empty, { class: 'px-2 py-1.5 text-sm text-[#9ca3af]' }, () => 'No people found'),
				]),
			]),
	}),
};

const channels: MentionOption[] = [
	{ id: 'general', label: 'general' },
	{ id: 'random', label: 'random' },
	{ id: 'engineering', label: 'engineering' },
	{ id: 'design', label: 'design' },
];

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex w-full max-w-md flex-col gap-8' }, [
				h('div', {}, [
					h('p', { class: 'mb-1.5 text-xs font-medium text-[#6b7280]' }, '@ mention people'),
					h(Mention.Root, { options: people, class: 'relative' }, () => [
						h(Mention.Input, {
							'aria-label': 'Mention people',
							rows: 3,
							placeholder: 'Type @ to mention someone…',
							class: inputCls,
						}),
						h(Mention.Content, { class: contentCls }, () => [
							h(Mention.Items, null, {
								default: ({ option }: { option: MentionOption }) =>
									h('div', { class: itemCls }, [
										h(
											'span',
											{
												class: 'flex size-6 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-[#4338ca]',
											},
											option.label.charAt(0),
										),
										option.label,
									]),
							}),
							h(Mention.Empty, { class: 'px-2 py-1.5 text-sm text-[#9ca3af]' }, () => 'No people found'),
						]),
					]),
				]),
				h('div', {}, [
					h('p', { class: 'mb-1.5 text-xs font-medium text-[#6b7280]' }, '# reference channels'),
					h(Mention.Root, { options: channels, trigger: '#', class: 'relative' }, () => [
						h(Mention.Input, {
							'aria-label': 'Reference channel',
							rows: 3,
							placeholder: 'Reference a #channel…',
							class: inputCls,
						}),
						h(Mention.Content, { class: contentCls }, () => [
							h(Mention.Items, null, {
								default: ({ option }: { option: MentionOption }) =>
									h('div', { class: itemCls }, [
										h('span', { class: 'text-[#9ca3af]' }, '#'),
										option.label,
									]),
							}),
							h(Mention.Empty, { class: 'px-2 py-1.5 text-sm text-[#9ca3af]' }, () => 'No channels'),
						]),
					]),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const value = ref('');

			return () =>
				h('div', { class: 'w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm' }, [
					h('div', { class: 'flex items-start gap-3' }, [
						h(
							'div',
							{
								class: 'flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white',
							},
							'You',
						),
						h('div', { class: 'relative flex-1' }, [
							h(
								Mention.Root,
								{
									options: people,
									value: value.value,
									onChange: (v: string) => {
										value.value = v;
									},
									class: 'relative',
								},
								() => [
									h(Mention.Input, {
										'aria-label': 'Write a comment',
										rows: 3,
										placeholder: 'Add a comment… use @ to notify a teammate',
										class: inputCls,
									}),
									h(Mention.Content, { class: contentCls }, () => [
										h(Mention.Items, null, {
											default: ({ option }: { option: MentionOption }) =>
												h('div', { class: itemCls }, [
													h(
														'span',
														{
															class: 'flex size-6 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-[#4338ca]',
														},
														option.label.charAt(0),
													),
													option.label,
												]),
										}),
										h(
											Mention.Empty,
											{ class: 'px-2 py-1.5 text-sm text-[#9ca3af]' },
											() => 'No people found',
										),
									]),
								],
							),
						]),
					]),
					h('div', { class: 'mt-3 flex items-center justify-end gap-2' }, [
						h(
							'button',
							{
								class: 'rounded-lg px-3 py-1.5 text-sm font-medium text-[#6b7280] hover:bg-[#f5f5f5]',
							},
							'Cancel',
						),
						h(
							'button',
							{
								disabled: value.value.trim().length === 0,
								class: 'rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40',
							},
							'Comment',
						),
					]),
				]);
		},
	}),
};
