import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Tag } from '.';

const meta = {
	title: 'Forms/Tag',
	component: Tag.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Compact label with optional remove button. Use as a chip in TagInput, filters, or status indicators.',
			},
		},
	},
} satisfies Meta<typeof Tag.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const tagCls =
	'inline-flex items-center gap-1 rounded-full border border-black bg-[#f5f5f5] px-2.5 py-1 text-xs font-medium text-black data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed';

const removeCls =
	'inline-flex size-4 items-center justify-center rounded-full text-black hover:bg-[#e5e5e5] [data-focus-visible]:ring-2 [data-focus-visible]:ring-black';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Tag.Root, { class: tagCls }, () => [
				h(Tag.Label, {}, () => 'React'),
				h(Tag.Remove, { class: removeCls }, () => '×'),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{ class: 'flex flex-wrap gap-2' },
				['React', 'Vue', 'Angular', 'Svelte', 'Solid'].map((label) =>
					h(Tag.Root, { key: label, class: tagCls }, () => [
						h(Tag.Label, {}, () => label),
						h(Tag.Remove, { class: removeCls }, () => '×'),
					]),
				),
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-3' }, [
				h('div', { class: 'flex flex-wrap items-center gap-2' }, [
					h(
						'span',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280]' },
						'Status',
					),
					h(
						Tag.Root,
						{
							class: 'inline-flex items-center gap-1 rounded-full border border-black bg-black px-2.5 py-1 text-xs font-medium text-white',
						},
						() => [h(Tag.Label, {}, () => 'active')],
					),
					h(Tag.Root, { class: tagCls }, () => [h(Tag.Label, {}, () => 'draft')]),
					h(Tag.Root, { disabled: true, class: tagCls }, () => [h(Tag.Label, {}, () => 'archived')]),
				]),
				h('div', { class: 'flex flex-wrap items-center gap-2' }, [
					h(
						'span',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280]' },
						'Filters',
					),
					...['type:bug', 'priority:high', 'assignee:jane'].map((label) =>
						h(Tag.Root, { key: label, class: tagCls }, () => [
							h(Tag.Label, {}, () => label),
							h(Tag.Remove, { class: removeCls }, () => '×'),
						]),
					),
				]),
			]),
	}),
};
