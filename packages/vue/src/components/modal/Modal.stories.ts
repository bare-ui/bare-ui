import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Modal } from '.';

const meta = {
	title: 'Components/Modal',
	component: Modal.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Dialog with portal rendering, overlay-click and Escape key close.',
			},
		},
	},
} satisfies Meta<typeof Modal.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const contentCls = 'w-full max-w-md overflow-hidden rounded-[20px] border-[3px] border-black bg-white';

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
						'Open Modal',
					),
					h(Modal.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () =>
						h(Modal.Portal, null, () =>
							h(
								Modal.Overlay,
								{ class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' },
								() =>
									h(Modal.Content, { class: contentCls }, () =>
										h('div', { class: 'p-6' }, [
											h('div', { class: 'mb-4 flex items-start justify-between' }, [
												h('h2', { class: 'text-lg font-semibold text-black' }, 'Modal Title'),
												h(
													Modal.Close,
													{ class: 'rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black' },
													() => '\u00D7',
												),
											]),
											h(
												'p',
												{ class: 'mb-6 text-sm text-[#9ca3af]' },
												'This is a basic modal dialog. Press Escape or click outside to close.',
											),
											h('div', { class: 'flex justify-end gap-3' }, [
												h(Modal.Close, { class: outlineBtnCls }, () => 'Close'),
											]),
										]),
									),
							),
						),
					),
				]);
		},
	}),
};
