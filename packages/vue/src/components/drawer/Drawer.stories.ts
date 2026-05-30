import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Drawer } from '.';

const meta = {
	title: 'Overlays/Drawer',
	component: Drawer.Root,
	subcomponents: {
		'Drawer.Overlay': Drawer.Overlay,
		'Drawer.Content': Drawer.Content,
		'Drawer.Header': Drawer.Header,
		'Drawer.Close': Drawer.Close,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Side-panel overlay with portal rendering and close behaviours.',
			},
		},
	},
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const CloseIcon = () =>
	h('svg', { class: 'h-5 w-5', viewBox: '0 0 20 20', fill: 'currentColor' }, [
		h('path', {
			d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
		}),
	]);

export const Default: Story = {
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
						'Open Drawer',
					),
					h(Drawer.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () => [
						h(Drawer.Portal, () => [
							h(Drawer.Overlay, { class: 'fixed inset-0 z-50 bg-black/50' }, () => [
								h(
									Drawer.Content,
									{
										class: 'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r-[3px] border-black bg-white',
									},
									() => [
										h(
											Drawer.Header,
											{ class: 'flex items-center justify-between px-4 py-4' },
											() => [
												h('span', { class: 'text-lg font-bold text-black' }, 'Drawer Title'),
												h(
													Drawer.Close,
													{
														class: 'rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black',
													},
													() => h(CloseIcon),
												),
											],
										),
										h('div', { class: 'flex-1 px-4 py-2' }, [
											h(
												'p',
												{ class: 'text-sm text-[#6b7280]' },
												'This is a simple drawer with some content. You can place any text or elements here. Close it using the button above.',
											),
										]),
									],
								),
							]),
						]),
					]),
				]);
		},
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const open = ref(false);
			const active = ref('Dashboard');

			const navItems = [
				{ label: 'Dashboard', icon: '\u{1F3E0}' },
				{ label: 'Analytics', icon: '\u{1F4CA}' },
				{ label: 'Projects', icon: '\u{1F4C1}' },
				{ label: 'Team', icon: '\u{1F465}' },
				{ label: 'Messages', icon: '\u{1F4AC}' },
				{ label: 'Settings', icon: '\u2699\uFE0F' },
			];

			return () =>
				h('div', {}, [
					h(
						'button',
						{
							onClick: () => (open.value = true),
							class: 'inline-flex items-center gap-2 rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]',
						},
						'\u2630 Menu',
					),
					h(Drawer.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () => [
						h(Drawer.Portal, () => [
							h(Drawer.Overlay, { class: 'fixed inset-0 z-50 bg-black/50' }, () => [
								h(
									Drawer.Content,
									{
										class: 'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r-[3px] border-black bg-white',
									},
									() => [
										h(
											Drawer.Header,
											{ class: 'flex items-center justify-between px-4 py-4' },
											() => [
												h('span', { class: 'text-lg font-bold text-black' }, 'Navigation'),
												h(
													Drawer.Close,
													{
														class: 'rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black',
													},
													() => h(CloseIcon),
												),
											],
										),
										h(
											'nav',
											{ class: 'flex-1 overflow-y-auto px-2 py-2' },
											navItems.map(({ label, icon }) =>
												h(
													'button',
													{
														key: label,
														onClick: () => {
															active.value = label;
															open.value = false;
														},
														class: [
															'flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors',
															active.value === label
																? 'bg-black text-white'
																: 'text-black hover:bg-[#f5f5f5]',
														].join(' '),
													},
													[h('span', { class: 'text-base' }, icon), label],
												),
											),
										),
									],
								),
							]),
						]),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
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
					h(Drawer.Root, { open: open.value, onOpenChange: (v: boolean) => (open.value = v) }, () => [
						h(Drawer.Portal, () => [
							h(Drawer.Overlay, { class: 'fixed inset-0 z-50 bg-black/50' }, () => [
								h(
									Drawer.Content,
									{
										class: 'fixed left-0 top-0 z-50 flex h-full w-80 flex-col border-r-[3px] border-black bg-white',
									},
									() => [
										h(
											Drawer.Header,
											{ class: 'flex items-center justify-between border-b border-black px-4 py-4' },
											() => [
												h('span', { class: 'text-lg font-bold text-black' }, 'Edit Profile'),
												h(
													Drawer.Close,
													{
														class: 'rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black',
													},
													() => h(CloseIcon),
												),
											],
										),
										h('div', { class: 'flex-1 overflow-y-auto px-4 py-4' }, [
											h('div', { class: 'flex flex-col gap-4' }, [
												h('div', {}, [
													h(
														'label',
														{ class: 'mb-1 block text-sm font-medium text-black' },
														'First Name',
													),
													h('input', {
														type: 'text',
														placeholder: 'Jane',
														class: 'w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm',
													}),
												]),
												h('div', {}, [
													h(
														'label',
														{ class: 'mb-1 block text-sm font-medium text-black' },
														'Last Name',
													),
													h('input', {
														type: 'text',
														placeholder: 'Doe',
														class: 'w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm',
													}),
												]),
												h('div', {}, [
													h(
														'label',
														{ class: 'mb-1 block text-sm font-medium text-black' },
														'Email',
													),
													h('input', {
														type: 'email',
														placeholder: 'jane@example.com',
														class: 'w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm',
													}),
												]),
												h('div', {}, [
													h(
														'label',
														{ class: 'mb-1 block text-sm font-medium text-black' },
														'Notes',
													),
													h('textarea', {
														placeholder: 'Add notes...',
														rows: 4,
														class: 'w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm resize-none',
													}),
												]),
											]),
										]),
										h('div', { class: 'flex gap-3 border-t border-black px-4 py-4' }, [
											h(
												Drawer.Close,
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
							]),
						]),
					]),
				]);
		},
	}),
};
