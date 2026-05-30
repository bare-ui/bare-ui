import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ScrollArea } from '.';

const meta = {
	title: 'Layout/ScrollArea',
	component: ScrollArea.Root,
	subcomponents: {
		'ScrollArea.Viewport': ScrollArea.Viewport,
		'ScrollArea.Scrollbar': ScrollArea.Scrollbar,
		'ScrollArea.Thumb': ScrollArea.Thumb,
	},
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

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(ScrollArea.Root, { class: 'h-72 w-56 rounded-xl border border-[#e5e7eb]' }, () => [
				h(ScrollArea.Viewport, { class: 'h-full w-full p-3' }, () =>
					h(
						'div',
						{ class: 'space-y-1' },
						tags.map((t) =>
							h('div', { key: t, class: 'rounded-md px-2 py-1.5 text-sm text-[#374151] hover:bg-[#f3f4f6]' }, t),
						),
					),
				),
				h(
					ScrollArea.Scrollbar,
					{ orientation: 'vertical', class: 'flex w-2.5 touch-none select-none p-0.5' },
					() => h(ScrollArea.Thumb, { class: 'flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' }),
				),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-8' }, [
				h('div', null, [
					h('p', { class: 'mb-2 text-sm font-medium text-[#374151]' }, 'Horizontal'),
					h(ScrollArea.Root, { class: 'w-96 rounded-xl border border-[#e5e7eb]' }, () => [
						h(ScrollArea.Viewport, { class: 'w-full p-3' }, () =>
							h(
								'div',
								{ class: 'flex gap-3' },
								tags.map((t) =>
									h(
										'div',
										{
											key: t,
											class: 'flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-sm text-[#374151]',
										},
										t,
									),
								),
							),
						),
						h(
							ScrollArea.Scrollbar,
							{ orientation: 'horizontal', class: 'flex h-2.5 touch-none select-none p-0.5' },
							() => h(ScrollArea.Thumb, { class: 'rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' }),
						),
					]),
				]),
				h('div', null, [
					h('p', { class: 'mb-2 text-sm font-medium text-[#374151]' }, 'Both axes'),
					h(ScrollArea.Root, { class: 'h-64 w-80 rounded-xl border border-[#e5e7eb]' }, () => [
						h(ScrollArea.Viewport, { class: 'h-full w-full p-3' }, () =>
							h(
								'div',
								{ class: 'grid w-[640px] grid-cols-8 gap-2' },
								Array.from({ length: 64 }, (_, i) =>
									h(
										'div',
										{
											key: i,
											class: 'flex h-16 items-center justify-center rounded-lg bg-[#f3f4f6] text-xs text-[#6b7280]',
										},
										String(i + 1),
									),
								),
							),
						),
						h(
							ScrollArea.Scrollbar,
							{ orientation: 'vertical', class: 'flex w-2.5 touch-none select-none p-0.5' },
							() => h(ScrollArea.Thumb, { class: 'flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' }),
						),
						h(
							ScrollArea.Scrollbar,
							{ orientation: 'horizontal', class: 'flex h-2.5 touch-none select-none p-0.5' },
							() => h(ScrollArea.Thumb, { class: 'rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' }),
						),
					]),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const notifications = Array.from({ length: 24 }, (_, i) => ({
				id: i,
				who: ['Maya Chen', 'Leo Park', 'Ravi Singh', 'Tess Doyle'][i % 4],
				text: ['mentioned you in a comment', 'requested your review', 'assigned you a task', 'shared a document'][
					i % 4
				],
				when: `${i + 1}m ago`,
			}));

			return () =>
				h('div', { class: 'w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white' }, [
					h('div', { class: 'flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3' }, [
						h('p', { class: 'text-sm font-semibold text-black' }, 'Notifications'),
						h('span', { class: 'rounded-full bg-black px-2 py-0.5 text-xs text-white' }, '24'),
					]),
					h(ScrollArea.Root, { class: 'h-72' }, () => [
						h(ScrollArea.Viewport, { class: 'h-full w-full' }, () =>
							h(
								'ul',
								{ class: 'divide-y divide-[#f3f4f6]' },
								notifications.map((n) =>
									h(
										'li',
										{ key: n.id, class: 'flex items-start gap-3 px-4 py-3 hover:bg-[#f5f5f5]' },
										[
											h(
												'span',
												{
													class: 'flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-[#374151]',
												},
												n.who
													.split(' ')
													.map((p) => p[0])
													.join(''),
											),
											h('div', { class: 'min-w-0 text-sm' }, [
												h('p', { class: 'text-black' }, [
													h('span', { class: 'font-medium' }, n.who),
													` ${n.text}`,
												]),
												h('p', { class: 'text-xs text-[#9ca3af]' }, n.when),
											]),
										],
									),
								),
							),
						),
						h(
							ScrollArea.Scrollbar,
							{ orientation: 'vertical', class: 'flex w-2.5 touch-none select-none p-0.5' },
							() => h(ScrollArea.Thumb, { class: 'flex-1 rounded-full bg-[#d1d5db] hover:bg-[#9ca3af]' }),
						),
					]),
				]);
		},
	}),
};
