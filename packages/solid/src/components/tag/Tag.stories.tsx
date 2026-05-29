import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { Tag } from './Tag';

const meta = {
	title: 'Forms/Tag',
	component: Tag.Root,
	subcomponents: {
		'Tag.Label': Tag.Label,
		'Tag.Remove': Tag.Remove,
	},
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
	render: () => (
		<Tag.Root class={tagCls}>
			<Tag.Label>React</Tag.Label>
			<Tag.Remove class={removeCls}>×</Tag.Remove>
		</Tag.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-wrap gap-2'>
			<For each={['React', 'Vue', 'Angular', 'Svelte', 'Solid']}>
				{(label) => (
					<Tag.Root class={tagCls}>
						<Tag.Label>{label}</Tag.Label>
						<Tag.Remove class={removeCls}>×</Tag.Remove>
					</Tag.Root>
				)}
			</For>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='flex flex-col gap-3'>
			<div class='flex flex-wrap items-center gap-2'>
				<span class='text-xs font-medium uppercase tracking-wide text-[#6b7280]'>Status</span>
				<Tag.Root class='inline-flex items-center gap-1 rounded-full border border-black bg-black px-2.5 py-1 text-xs font-medium text-white'>
					<Tag.Label>active</Tag.Label>
				</Tag.Root>
				<Tag.Root class={tagCls}>
					<Tag.Label>draft</Tag.Label>
				</Tag.Root>
				<Tag.Root
					disabled
					class={tagCls}>
					<Tag.Label>archived</Tag.Label>
				</Tag.Root>
			</div>
			<div class='flex flex-wrap items-center gap-2'>
				<span class='text-xs font-medium uppercase tracking-wide text-[#6b7280]'>Filters</span>
				<For each={['type:bug', 'priority:high', 'assignee:jane']}>
					{(label) => (
						<Tag.Root class={tagCls}>
							<Tag.Label>{label}</Tag.Label>
							<Tag.Remove class={removeCls}>×</Tag.Remove>
						</Tag.Root>
					)}
				</For>
			</div>
		</div>
	),
};
