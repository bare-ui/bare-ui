import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Virtualizer } from '.';

const meta = {
	title: 'Layout/Virtualizer',
	component: Virtualizer.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A windowing primitive: renders only the items in view (plus overscan), measuring real sizes as they appear. Pairs with `List` and `Chat.List`. Supports vertical and horizontal axes.',
			},
		},
	},
} satisfies Meta<typeof Virtualizer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Virtualizer.Root,
				{
					count: 10000,
					estimateSize: 44,
					class: 'h-80 w-72 rounded-xl border border-[#e5e7eb]',
				},
				{
					default: ({ index }: { index: number }) =>
						h('div', { class: 'flex items-center gap-3 border-b border-[#f3f4f6] px-4 py-3 text-sm' }, [
							h(
								'span',
								{ class: 'flex size-7 items-center justify-center rounded-full bg-[#f3f4f6] text-xs text-[#6b7280]' },
								String(index),
							),
							h('span', { class: 'text-black' }, `Item number ${index}`),
						]),
				},
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-8' }, [
				h('div', null, [
					h('p', { class: 'mb-2 text-sm font-medium text-[#374151]' }, 'Horizontal'),
					h(
						Virtualizer.Root,
						{
							count: 5000,
							estimateSize: 120,
							orientation: 'horizontal',
							class: 'h-32 w-full max-w-2xl rounded-xl border border-[#e5e7eb]',
						},
						{
							default: ({ index }: { index: number }) =>
								h(
									'div',
									{
										class: 'flex h-full w-[120px] flex-col items-center justify-center border-r border-[#f3f4f6] text-sm',
									},
									[h('span', { class: 'text-2xl' }, '🗂️'), h('span', { class: 'text-black' }, `#${index}`)],
								),
						},
					),
				]),
				h('div', null, [
					h('p', { class: 'mb-2 text-sm font-medium text-[#374151]' }, 'Variable heights (measured)'),
					h(
						Virtualizer.Root,
						{
							count: 1000,
							estimateSize: 80,
							class: 'h-80 w-80 rounded-xl border border-[#e5e7eb]',
						},
						{
							default: ({ index }: { index: number }) =>
								h('div', { class: 'border-b border-[#f3f4f6] px-4 py-3 text-sm text-[#374151]' }, [
									h('p', { class: 'font-semibold text-black' }, `Row ${index}`),
									h('p', null, 'Variable height content. '.repeat((index % 4) + 1)),
								]),
						},
					),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const first = ['Maya', 'Leo', 'Ravi', 'Tess', 'Ana', 'Sam', 'Iris', 'Theo'];
			const last = ['Chen', 'Park', 'Singh', 'Doyle', 'Ortiz', 'Wells', 'Kane', 'Voss'];

			return () =>
				h('div', { class: 'w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white' }, [
					h('div', { class: 'flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3' }, [
						h('p', { class: 'text-sm font-semibold text-black' }, 'Contacts'),
						h('span', { class: 'text-xs text-[#9ca3af]' }, '20,000'),
					]),
					h(
						Virtualizer.Root,
						{
							count: 20000,
							estimateSize: 56,
							overscan: 6,
							class: 'h-96',
						},
						{
							default: ({ index }: { index: number }) => {
								const name = `${first[index % first.length]} ${last[(index >> 3) % last.length]}`;
								const initials = name
									.split(' ')
									.map((p) => p[0])
									.join('');
								return h(
									'div',
									{ class: 'flex items-center gap-3 border-b border-[#f3f4f6] px-4 py-2.5 hover:bg-[#f5f5f5]' },
									[
										h(
											'span',
											{
												class: 'flex size-9 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-[#374151]',
											},
											initials,
										),
										h('div', { class: 'min-w-0 text-sm' }, [
											h('p', { class: 'truncate text-black' }, name),
											h(
												'p',
												{ class: 'truncate text-xs text-[#9ca3af]' },
												`${name.toLowerCase().replace(' ', '.')}@example.com`,
											),
										]),
									],
								);
							},
						},
					),
				]);
		},
	}),
};
