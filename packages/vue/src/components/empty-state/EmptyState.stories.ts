import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { EmptyState } from '.';

const meta = {
	title: 'Feedback/EmptyState',
	component: EmptyState.Root,
	subcomponents: {
		'EmptyState.Media': EmptyState.Media,
		'EmptyState.Title': EmptyState.Title,
		'EmptyState.Description': EmptyState.Description,
		'EmptyState.Actions': EmptyState.Actions,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A composable empty / zero-data placeholder with media, title, description and action slots.',
			},
		},
	},
} satisfies Meta<typeof EmptyState.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				EmptyState.Root,
				{ class: 'mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-dashed border-[#d1d5db] p-10 text-center' },
				() => [
					h(EmptyState.Media, { class: 'flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-2xl' }, () => '📭'),
					h(EmptyState.Title, { class: 'text-base font-semibold text-black' }, () => 'No messages yet'),
					h(EmptyState.Description, { class: 'text-sm text-[#6b7280]' }, () => 'When you start a conversation, it will show up here.'),
					h(EmptyState.Actions, { class: 'mt-2 flex gap-2' }, () => [
						h('button', { class: 'rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white' }, 'New message'),
						h('button', { class: 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-black' }, 'Learn more'),
					]),
				],
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-wrap items-start gap-6' }, [
				h(
					EmptyState.Root,
					{ class: 'flex max-w-xs flex-col items-center gap-2 rounded-2xl border border-[#e5e7eb] p-8 text-center' },
					() => [
						h(EmptyState.Media, { class: 'text-3xl' }, () => '🔍'),
						h(EmptyState.Title, { class: 'text-sm font-semibold text-black' }, () => 'No results for “wireframe”'),
						h(EmptyState.Description, { class: 'text-xs text-[#6b7280]' }, () => 'Check the spelling or try a broader term.'),
					],
				),
				h(
					EmptyState.Root,
					{ class: 'flex max-w-xs flex-col items-center gap-2 rounded-2xl border border-[#e5e7eb] p-8 text-center' },
					() => [
						h(EmptyState.Media, { class: 'flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-2xl' }, () => '📁'),
						h(EmptyState.Title, { class: 'text-sm font-semibold text-black' }, () => 'This folder is empty'),
						h(EmptyState.Description, { class: 'text-xs text-[#6b7280]' }, () => 'Drag files here or upload to get started.'),
						h(EmptyState.Actions, { class: 'mt-2' }, () => [
							h('button', { class: 'rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white' }, 'Upload'),
						]),
					],
				),
				h(
					EmptyState.Root,
					{ class: 'flex max-w-xs flex-col items-center gap-2 rounded-2xl border border-dashed border-[#d1d5db] p-8 text-center' },
					() => [
						h(EmptyState.Media, { class: 'text-3xl' }, () => '⚠️'),
						h(EmptyState.Title, { class: 'text-sm font-semibold text-black' }, () => 'Something went wrong'),
						h(EmptyState.Description, { class: 'text-xs text-[#6b7280]' }, () => 'We couldn’t load your data. Please try again.'),
						h(EmptyState.Actions, { class: 'mt-2' }, () => [
							h('button', { class: 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-black' }, 'Retry'),
						]),
					],
				),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'w-[28rem] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white' }, [
				h('div', { class: 'flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3' }, [
					h('div', {}, [
						h('h2', { class: 'text-sm font-semibold text-black' }, 'Projects'),
						h('p', { class: 'text-xs text-[#9ca3af]' }, '0 active'),
					]),
					h('button', { class: 'rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white' }, 'New project'),
				]),
				h(
					EmptyState.Root,
					{ class: 'flex flex-col items-center gap-3 px-6 py-12 text-center' },
					() => [
						h(EmptyState.Media, { class: 'flex size-14 items-center justify-center rounded-full bg-[#f3f4f6] text-3xl' }, () => '🗂️'),
						h(EmptyState.Title, { class: 'text-base font-semibold text-black' }, () => 'No projects yet'),
						h(EmptyState.Description, { class: 'max-w-xs text-sm text-[#6b7280]' }, () => 'Create your first project to organize tasks, files and collaborators in one place.'),
						h(EmptyState.Actions, { class: 'mt-2 flex gap-2' }, () => [
							h('button', { class: 'rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white' }, 'Create project'),
							h('button', { class: 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-black' }, 'Import'),
						]),
					],
				),
			]),
	}),
};
