import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Sheet } from '.';

const meta = {
	title: 'Overlays/Sheet',
	component: Sheet.Root,
	subcomponents: {
		'Sheet.Trigger': Sheet.Trigger,
		'Sheet.Overlay': Sheet.Overlay,
		'Sheet.Content': Sheet.Content,
		'Sheet.Handle': Sheet.Handle,
		'Sheet.Title': Sheet.Title,
		'Sheet.Description': Sheet.Description,
		'Sheet.Close': Sheet.Close,
	},
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A Drawer-adjacent panel that slides from any edge, with iOS-style snap points: drag the handle to rest at configured heights, or past the smallest snap to dismiss. Modal by default (focus trap + scroll lock).',
			},
		},
	},
} satisfies Meta<typeof Sheet.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls = 'rounded-lg bg-black px-4 py-2 text-sm font-medium text-white';
const overlayCls = 'fixed inset-0 z-40 bg-black/40';
const contentBaseCls =
	'z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out data-[dragging]:transition-none';
const handleCls = 'mx-auto mt-3 h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-[#d1d5db] active:cursor-grabbing';
const closeCls = 'mt-4 w-full rounded-lg border border-[#d1d5db] py-2 text-sm font-medium';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex h-[500px] items-center justify-center bg-[#f3f4f6]' }, [
				h(Sheet.Root, { snapPoints: [0.4] }, () => [
					h(Sheet.Trigger, { class: triggerCls }, () => 'Open sheet'),
					h(Sheet.Portal, null, () => [
						h(Sheet.Overlay, { class: overlayCls }),
						h(Sheet.Content, { class: `${contentBaseCls} rounded-t-2xl` }, () => [
							h(Sheet.Handle, { class: handleCls }),
							h('div', { class: 'p-5' }, [
								h(Sheet.Title, { class: 'text-lg font-semibold text-black' }, () => 'Bottom sheet'),
								h(
									Sheet.Description,
									{ class: 'mt-1 text-sm text-[#6b7280]' },
									() => 'Slides up from the bottom edge. Drag the handle down or tap the overlay to dismiss.',
								),
								h(Sheet.Close, { class: closeCls }, () => 'Done'),
							]),
						]),
					]),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex h-[500px] items-center justify-center gap-4 bg-[#f3f4f6]' }, [
				h(Sheet.Root, { snapPoints: [0.3, 0.6, 0.9] }, () => [
					h(Sheet.Trigger, { class: triggerCls }, () => 'Snap points'),
					h(Sheet.Portal, null, () => [
						h(Sheet.Overlay, { class: overlayCls }),
						h(Sheet.Content, { class: `${contentBaseCls} rounded-t-2xl` }, () => [
							h(Sheet.Handle, { class: handleCls }),
							h('div', { class: 'overflow-auto p-5' }, [
								h(Sheet.Title, { class: 'text-lg font-semibold text-black' }, () => 'Snap heights'),
								h(
									Sheet.Description,
									{ class: 'mt-1 text-sm text-[#6b7280]' },
									() => 'Drag the handle to snap between 30%, 60% and 90% — or flick down to dismiss.',
								),
								h(
									'div',
									{ class: 'mt-4 space-y-2' },
									Array.from({ length: 12 }, (_, i) =>
										h(
											'div',
											{ key: i, class: 'rounded-lg bg-[#f3f4f6] p-3 text-sm text-[#374151]' },
											`Row ${i + 1}`,
										),
									),
								),
								h(Sheet.Close, { class: closeCls }, () => 'Done'),
							]),
						]),
					]),
				]),
				h(Sheet.Root, { side: 'top', snapPoints: [0.4] }, () => [
					h(Sheet.Trigger, { class: triggerCls }, () => 'Top sheet'),
					h(Sheet.Portal, null, () => [
						h(Sheet.Overlay, { class: overlayCls }),
						h(Sheet.Content, { class: `${contentBaseCls} rounded-b-2xl` }, () => [
							h('div', { class: 'p-5' }, [
								h(Sheet.Title, { class: 'text-lg font-semibold text-black' }, () => 'Heads up'),
								h(
									Sheet.Description,
									{ class: 'mt-1 text-sm text-[#6b7280]' },
									() => 'A sheet that drops in from the top — drag the handle up to dismiss.',
								),
								h(Sheet.Close, { class: closeCls }, () => 'Dismiss'),
							]),
							h(Sheet.Handle, {
								class: 'mx-auto mb-3 h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-[#d1d5db]',
							}),
						]),
					]),
				]),
			]),
	}),
};

const sortOptions = ['Relevance', 'Newest', 'Price: low to high', 'Price: high to low', 'Top rated'];

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex h-[500px] items-center justify-center bg-[#f3f4f6]' }, [
				h(Sheet.Root, { snapPoints: [0.5, 0.85] }, () => [
					h(
						Sheet.Trigger,
						{
							class: 'flex items-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-black',
						},
						() => 'Filters',
					),
					h(Sheet.Portal, null, () => [
						h(Sheet.Overlay, { class: overlayCls }),
						h(Sheet.Content, { class: `${contentBaseCls} rounded-t-2xl` }, () => [
							h(Sheet.Handle, { class: handleCls }),
							h('div', { class: 'flex items-center justify-between border-b border-[#f3f4f6] px-5 py-3' }, [
								h(Sheet.Title, { class: 'text-base font-semibold text-black' }, () => 'Sort & filter'),
								h(Sheet.Close, { class: 'text-sm font-medium text-[#6b7280]' }, () => 'Reset'),
							]),
							h('div', { class: 'flex-1 overflow-auto p-5' }, [
								h(Sheet.Description, { class: 'text-sm text-[#6b7280]' }, () => 'Choose how results are ordered.'),
								h(
									'div',
									{ class: 'mt-3 space-y-1' },
									sortOptions.map((opt, i) =>
										h(
											'label',
											{
												key: opt,
												class: 'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#374151] hover:bg-[#f5f5f5]',
											},
											[
												h('input', {
													type: 'radio',
													name: 'sort',
													checked: i === 0,
													class: 'accent-black',
												}),
												opt,
											],
										),
									),
								),
							]),
							h('div', { class: 'border-t border-[#f3f4f6] p-4' }, [
								h(
									Sheet.Close,
									{ class: 'w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white' },
									() => 'Apply',
								),
							]),
						]),
					]),
				]),
			]),
	}),
};
