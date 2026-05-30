import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Modal } from '.';

const meta = {
	title: 'Overlays/Modal',
	component: Modal.Root,
	subcomponents: {
		'Modal.Overlay': Modal.Overlay,
		'Modal.Content': Modal.Content,
		'Modal.Close': Modal.Close,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Accessible dialog overlay with portal rendering.',
			},
		},
	},
} satisfies Meta<typeof Modal.Root>;

export default meta;

const CloseIcon = () =>
	h('svg', { class: 'h-5 w-5', viewBox: '0 0 20 20', fill: 'currentColor' }, [
		h('path', {
			d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
		}),
	]);

export const Default: StoryObj = {
	render: () => ({
		setup() {
			const open = ref(false);

			return () =>
				h('div', {}, [
					h(
						'button',
						{
							onClick: () => (open.value = true),
							class: 'inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]',
						},
						'Show Notification',
					),
					h(Modal.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () => [
						h(Modal.Portal, () => [
							h(
								Modal.Overlay,
								{
									class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
								},
								() => [
									h(
										Modal.Content,
										{
											class: 'w-full max-w-md overflow-hidden rounded-[20px] border border-black bg-white p-6',
										},
										() => [
											h('h2', { class: 'mb-2 text-base font-semibold text-black' }, 'Notification'),
											h(
												'p',
												{ class: 'mb-6 text-sm text-[#6b7280]' },
												'Your changes have been saved successfully. You can continue working or close this dialog.',
											),
											h(
												Modal.Close,
												{
													class: 'w-full rounded-[8px] border border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]',
												},
												() => 'Close',
											),
										],
									),
								],
							),
						]),
					]),
				]);
		},
	}),
};

export const Composed: StoryObj = {
	render: () => ({
		setup() {
			const open = ref(false);

			return () =>
				h('div', {}, [
					h(
						'button',
						{
							onClick: () => (open.value = true),
							class: 'inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]',
						},
						'Delete Account',
					),
					h(Modal.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () => [
						h(Modal.Portal, () => [
							h(
								Modal.Overlay,
								{
									class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
								},
								() => [
									h(
										Modal.Content,
										{
											class: 'w-full max-w-md overflow-hidden rounded-[20px] border border-black bg-white p-6',
										},
										() => [
											h(
												'div',
												{
													class: 'mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5]',
												},
												[
													h(
														'svg',
														{
															class: 'h-6 w-6 text-black',
															fill: 'none',
															viewBox: '0 0 24 24',
															stroke: 'currentColor',
														},
														[
															h('path', {
																'stroke-linecap': 'round',
																'stroke-linejoin': 'round',
																'stroke-width': '2',
																d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
															}),
														],
													),
												],
											),
											h('h2', { class: 'mb-2 text-base font-semibold text-black' }, 'Delete Account'),
											h(
												'p',
												{ class: 'mb-6 text-sm text-[#6b7280]' },
												'Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.',
											),
											h('div', { class: 'flex gap-3' }, [
												h(
													Modal.Close,
													{
														class: 'flex-1 rounded-[8px] border border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]',
													},
													() => 'Cancel',
												),
												h(
													'button',
													{
														onClick: () => (open.value = false),
														class: 'flex-1 rounded-[8px] border border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]',
													},
													'Delete',
												),
											]),
										],
									),
								],
							),
						]),
					]),
				]);
		},
	}),
};

export const Complex: StoryObj = {
	render: () => ({
		setup() {
			const open = ref(false);

			return () =>
				h('div', {}, [
					h(
						'button',
						{
							onClick: () => (open.value = true),
							class: 'inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]',
						},
						'Edit Profile',
					),
					h(Modal.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () => [
						h(Modal.Portal, () => [
							h(
								Modal.Overlay,
								{
									class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
								},
								() => [
									h(
										Modal.Content,
										{
											class: 'w-full max-w-md overflow-hidden rounded-[20px] border border-black bg-white',
										},
										() => [
											h(
												'div',
												{ class: 'flex items-center justify-between border-b border-black px-6 py-4' },
												[
													h('h2', { class: 'text-base font-semibold text-black' }, 'Edit Profile'),
													h(
														Modal.Close,
														{
															class: 'rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black',
														},
														() => h(CloseIcon),
													),
												],
											),
											h('div', { class: 'flex flex-col gap-4 px-6 py-4' }, [
												h('div', {}, [
													h('label', { class: 'mb-1 block text-sm font-medium text-black' }, 'Name'),
													h('input', {
														type: 'text',
														placeholder: 'Jane Doe',
														class: 'w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm',
													}),
												]),
												h('div', {}, [
													h('label', { class: 'mb-1 block text-sm font-medium text-black' }, 'Email'),
													h('input', {
														type: 'email',
														placeholder: 'jane@example.com',
														class: 'w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm',
													}),
												]),
											]),
											h('div', { class: 'flex gap-3 border-t border-black px-6 py-4' }, [
												h(
													Modal.Close,
													{
														class: 'flex-1 rounded-[8px] border border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]',
													},
													() => 'Cancel',
												),
												h(
													'button',
													{
														onClick: () => (open.value = false),
														class: 'flex-1 rounded-[8px] border border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]',
													},
													'Save',
												),
											]),
										],
									),
								],
							),
						]),
					]),
				]);
		},
	}),
};
