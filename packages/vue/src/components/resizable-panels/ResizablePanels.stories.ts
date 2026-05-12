import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { ResizablePanels } from '.';

const meta = {
	title: 'Layout/ResizablePanels',
	component: ResizablePanels.Group,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Drag-to-resize panel layout. Horizontal or vertical, with min/max size constraints per panel.',
			},
		},
	},
} satisfies Meta<typeof ResizablePanels.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelCls = 'flex items-center justify-center bg-[#f5f5f5] text-sm font-medium text-black';
const handleHCls = 'w-px bg-black hover:w-1 hover:bg-black transition-all';
const handleVCls = 'h-px bg-black hover:h-1 hover:bg-black transition-all';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{
					style: { width: '100%', height: '250px' },
					class: 'border border-black rounded-[8px] overflow-hidden',
				},
				[
					h(ResizablePanels.Group, { orientation: 'horizontal' }, () => [
						h(ResizablePanels.Panel, { defaultSize: 50, class: panelCls }, () => 'Left'),
						h(ResizablePanels.Handle, { class: handleHCls }),
						h(ResizablePanels.Panel, { defaultSize: 50, class: panelCls }, () => 'Right'),
					]),
				],
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{
					style: { width: '100%', height: '250px' },
					class: 'border border-black rounded-[8px] overflow-hidden',
				},
				[
					h(ResizablePanels.Group, { orientation: 'vertical' }, () => [
						h(ResizablePanels.Panel, { defaultSize: 30, class: panelCls }, () => 'Top'),
						h(ResizablePanels.Handle, { class: handleVCls }),
						h(ResizablePanels.Panel, { defaultSize: 70, class: panelCls }, () => 'Bottom'),
					]),
				],
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{
					style: { width: '100%', height: '320px' },
					class: 'border border-black rounded-[8px] overflow-hidden',
				},
				[
					h(ResizablePanels.Group, { orientation: 'horizontal' }, () => [
						h(
							ResizablePanels.Panel,
							{
								defaultSize: 20,
								minSize: 10,
								maxSize: 40,
								class: `${panelCls} flex-col items-start gap-1 p-3`,
							},
							() => [
								h(
									'p',
									{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280]' },
									'Sidebar',
								),
								h('p', { class: 'text-xs text-black' }, 'Files'),
								h('p', { class: 'text-xs text-black' }, 'Search'),
								h('p', { class: 'text-xs text-black' }, 'Git'),
							],
						),
						h(ResizablePanels.Handle, { class: handleHCls }),
						h(ResizablePanels.Panel, { defaultSize: 80 }, () => [
							h(ResizablePanels.Group, { orientation: 'vertical' }, () => [
								h(
									ResizablePanels.Panel,
									{ defaultSize: 70, minSize: 30, class: `${panelCls} text-xs` },
									() => 'Editor',
								),
								h(ResizablePanels.Handle, { class: handleVCls }),
								h(
									ResizablePanels.Panel,
									{ defaultSize: 30, minSize: 10, class: `${panelCls} text-xs` },
									() => 'Terminal',
								),
							]),
						]),
					]),
				],
			),
	}),
};
