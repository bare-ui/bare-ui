import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ScrollArea } from '.';

const meta = {
	title: 'Layout/ScrollArea',
	component: ScrollArea.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A scroll container with a custom, stylable scrollbar. The native scrollbar is hidden; `Scrollbar` + `Thumb` reflect the scroll position and support drag.',
			},
		},
	},
} satisfies Meta<typeof ScrollArea.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 40 }, (_, i) => `Tag ${i + 1}`);

export const Vertical: Story = {
	render: () => ({
		setup: () => () =>
			h(
				ScrollArea.Root,
				{ class: 'h-72 w-56 rounded-xl border border-[#e5e7eb]' },
				() => [
					h(
						ScrollArea.Viewport,
						{ class: 'h-full w-full p-3' },
						() => h('div', { class: 'space-y-1' }, tags.map((t) =>
							h('div', { key: t, class: 'rounded-md px-2 py-1.5 text-sm text-[#374151] hover:bg-[#f3f4f6]' }, t)
						)),
					),
					h(
						ScrollArea.Scrollbar,
						{ orientation: 'vertical', class: 'flex w-2.5 touch-none select-none p-0.5' },
						() => h(ScrollArea.Thumb, { class: 'flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' }),
					),
				],
			),
	}),
};

export const Horizontal: Story = {
	render: () => ({
		setup: () => () =>
			h(
				ScrollArea.Root,
				{ class: 'w-96 rounded-xl border border-[#e5e7eb]' },
				() => [
					h(
						ScrollArea.Viewport,
						{ class: 'w-full p-3' },
						() => h('div', { class: 'flex gap-3' }, tags.map((t) =>
							h('div', { key: t, class: 'flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-sm text-[#374151]' }, t)
						)),
					),
					h(
						ScrollArea.Scrollbar,
						{ orientation: 'horizontal', class: 'flex h-2.5 touch-none select-none p-0.5' },
						() => h(ScrollArea.Thumb, { class: 'rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' }),
					),
				],
			),
	}),
};
