import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { TagInput } from '.';
import { Tag } from '../tag';

const meta = {
	title: 'Forms/TagInput',
	component: TagInput.Root,
	subcomponents: {
		'TagInput.List': TagInput.List,
		'TagInput.Items': TagInput.Items,
		'TagInput.Field': TagInput.Field,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Multi-tag input. Press Enter or comma to add; Backspace at empty input removes the last tag.',
			},
		},
	},
} satisfies Meta<typeof TagInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperCls =
	'flex flex-wrap items-center gap-1.5 rounded-[8px] border border-black bg-white px-2 py-1.5 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-1 data-[disabled]:opacity-50';
const fieldCls =
	'flex-1 min-w-[100px] bg-transparent px-1 py-1 text-sm text-black outline-none placeholder:text-[#a3a3a3]';
const tagCls =
	'inline-flex items-center gap-1 rounded-full border border-black bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-black';
const removeCls = 'inline-flex size-4 items-center justify-center rounded-full text-black hover:bg-[#e5e5e5]';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(TagInput.Root, { defaultValue: ['react', 'tailwind'], class: wrapperCls }, () => [
				h(
					TagInput.Items,
					{},
					{
						default: ({ tag, index, remove }: { tag: string; index: number; remove: () => void }) => [
							h(Tag.Root, { key: `${tag}-${index}`, class: tagCls }, () => [
								h(Tag.Label, {}, () => tag),
								h(Tag.Remove, { class: removeCls, onClick: remove }, () => '×'),
							]),
						],
					},
				),
				h(TagInput.Field, { placeholder: 'Add a tag…', class: fieldCls }),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const tags = ref<string[]>(['design', 'typography']);
			return () =>
				h('div', { class: 'flex flex-col gap-2' }, [
					h('label', { class: 'text-sm font-medium text-black' }, 'Topics'),
					h(
						TagInput.Root,
						{
							value: tags.value,
							onChange: (v: string[]) => (tags.value = v),
							maxTags: 5,
							class: wrapperCls,
						},
						() => [
							h(
								TagInput.Items,
								{},
								{
									default: ({
										tag,
										index,
										remove,
									}: {
										tag: string;
										index: number;
										remove: () => void;
									}) => [
										h(Tag.Root, { key: `${tag}-${index}`, class: tagCls }, () => [
											h(Tag.Label, {}, () => tag),
											h(Tag.Remove, { class: removeCls, onClick: remove }, () => '×'),
										]),
									],
								},
							),
							h(TagInput.Field, {
								placeholder: tags.value.length >= 5 ? '' : 'Add up to 5 topics',
								class: fieldCls,
							}),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, `${tags.value.length}/5 — press Enter or comma to add`),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const emails = ref<string[]>([]);
			const validate = (raw: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
			return () =>
				h('div', { class: 'flex max-w-md flex-col gap-2' }, [
					h('label', { class: 'text-sm font-medium text-black' }, 'Invite teammates'),
					h(
						TagInput.Root,
						{
							value: emails.value,
							onChange: (v: string[]) => (emails.value = v),
							validate,
							commitKeys: ['Enter', ',', ' '],
							class: wrapperCls,
						},
						() => [
							h(
								TagInput.Items,
								{},
								{
									default: ({
										tag,
										index,
										remove,
									}: {
										tag: string;
										index: number;
										remove: () => void;
									}) => [
										h(Tag.Root, { key: `${tag}-${index}`, class: tagCls }, () => [
											h(Tag.Label, {}, () => tag),
											h(Tag.Remove, { class: removeCls, onClick: remove }, () => '×'),
										]),
									],
								},
							),
							h(TagInput.Field, { placeholder: 'name@company.com', class: fieldCls }),
						],
					),
					h(
						'p',
						{ class: 'text-xs text-[#6b7280]' },
						'Email-validated; commit on Enter, comma, or space. Invalid entries are silently rejected.',
					),
				]);
		},
	}),
};
