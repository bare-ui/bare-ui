import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Sheet } from '.';

const meta = {
	title: 'Overlays/Sheet',
	component: Sheet.Root,
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

const overlayCls = 'fixed inset-0 z-40 bg-black/40';
const contentBaseCls =
	'z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out data-[dragging]:transition-none';

export const BottomSnap: Story = {
	render: () => ({
		setup() {
			return () =>
				h('div', { class: 'flex h-[500px] items-center justify-center bg-[#f3f4f6]' }, [
					h(Sheet.Root, { snapPoints: [0.3, 0.6, 0.9] }, () => [
						h(
							Sheet.Trigger,
							{ class: 'rounded-lg bg-black px-4 py-2 text-sm font-medium text-white' },
							() => 'Open sheet',
						),
						h(Sheet.Portal, null, () => [
							h(Sheet.Overlay, { class: overlayCls }),
							h(Sheet.Content, { class: `${contentBaseCls} rounded-t-2xl` }, () => [
								h(Sheet.Handle, {
									class: 'mx-auto mt-3 h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-[#d1d5db] active:cursor-grabbing',
								}),
								h('div', { class: 'overflow-auto p-5' }, [
									h(
										Sheet.Title,
										{ class: 'text-lg font-semibold text-black' },
										() => 'Bottom sheet',
									),
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
									h(
										Sheet.Close,
										{ class: 'mt-4 w-full rounded-lg border border-[#d1d5db] py-2 text-sm font-medium' },
										() => 'Done',
									),
								]),
							]),
						]),
					]),
				]);
		},
	}),
};

export const TopSheet: Story = {
	render: () => ({
		setup() {
			return () =>
				h('div', { class: 'flex h-[500px] items-center justify-center bg-[#f3f4f6]' }, [
					h(Sheet.Root, { side: 'top', snapPoints: [0.4] }, () => [
						h(
							Sheet.Trigger,
							{ class: 'rounded-lg bg-black px-4 py-2 text-sm font-medium text-white' },
							() => 'Open notification',
						),
						h(Sheet.Portal, null, () => [
							h(Sheet.Overlay, { class: overlayCls }),
							h(Sheet.Content, { class: `${contentBaseCls} rounded-b-2xl` }, () => [
								h('div', { class: 'p-5' }, [
									h(
										Sheet.Title,
										{ class: 'text-lg font-semibold text-black' },
										() => 'Heads up',
									),
									h(
										Sheet.Description,
										{ class: 'mt-1 text-sm text-[#6b7280]' },
										() => 'A sheet that drops in from the top — drag the handle up to dismiss.',
									),
									h(
										Sheet.Close,
										{ class: 'mt-4 w-full rounded-lg border border-[#d1d5db] py-2 text-sm font-medium' },
										() => 'Dismiss',
									),
								]),
								h(Sheet.Handle, {
									class: 'mx-auto mb-3 h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-[#d1d5db]',
								}),
							]),
						]),
					]),
				]);
		},
	}),
};
