import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Drawer } from '.';

const meta = {
	title: 'Components/Drawer',
	component: Drawer.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Slide-out panel with portal rendering, overlay-click and Escape key close.',
			},
		},
	},
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerBtnCls =
	'inline-flex items-center rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const outlineBtnCls =
	'inline-flex items-center rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]';

export const Default: Story = {
	render: () => ({
		setup: () => {
			const open = ref(false);

			return () =>
				h('div', null, [
					h(
						'button',
						{ class: triggerBtnCls, onClick: () => (open.value = true) },
						'Open Drawer',
					),
					h(Drawer.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () =>
						h(Drawer.Portal, null, () =>
							h(
								Drawer.Overlay,
								{ class: 'fixed inset-0 z-50 flex justify-end bg-black/50' },
								() =>
									h(
										Drawer.Content,
										{ class: 'h-full w-full max-w-sm border-l-[3px] border-black bg-white' },
										() => [
											h(
												Drawer.Header,
												{ class: 'flex items-center justify-between border-b border-[#d4d4d4] px-6 py-4' },
												() => [
													h('h2', { class: 'text-base font-semibold text-black' }, 'Drawer Title'),
													h(
														Drawer.Close,
														{ class: 'rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black' },
														() => '\u00D7',
													),
												],
											),
											h('div', { class: 'p-6' }, [
												h(
													'p',
													{ class: 'mb-6 text-sm text-[#9ca3af]' },
													'This is a basic drawer panel. Press Escape or click outside to close.',
												),
												h('div', { class: 'flex gap-3' }, [
													h(Drawer.Close, { class: outlineBtnCls }, () => 'Close'),
												]),
											]),
										],
									),
							),
						),
					),
				]);
		},
	}),
};
