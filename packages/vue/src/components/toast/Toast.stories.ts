import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, h } from 'vue';
import { Toast, useToast } from '.';
import type { ToastData } from './Toast.types';

const meta = {
	title: 'Feedback/Toast',
	component: Toast.Provider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Imperative notification system. Wrap your app in <Toast.Provider>, render <Toast.Viewport>, and call useToast().toast(...) from anywhere.',
			},
		},
	},
} satisfies Meta<typeof Toast.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls =
	'inline-flex cursor-pointer items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const toastCls =
	'flex items-start gap-3 rounded-[8px] border border-black bg-white px-4 py-3 shadow-sm w-80 data-[status=success]:bg-[#f5f5f5] data-[status=warning]:bg-[#f5f5f5] data-[status=danger]:bg-[#f5f5f5]';

const closeCls =
	'shrink-0 rounded-[8px] p-1 text-black hover:bg-[#e5e5e5] [data-focus-visible]:ring-2 [data-focus-visible]:ring-black';

const viewportCls = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';

const Demo = defineComponent({
	name: 'ToastDemo',
	setup() {
		const { toast } = useToast();
		return () =>
			h('div', { class: 'flex flex-wrap gap-2' }, [
				h(
					'button',
					{
						class: triggerCls,
						onClick: () =>
							toast({ title: 'Saved', description: 'Your changes are saved.', status: 'success' }),
					},
					'Show success',
				),
				h(
					'button',
					{
						class: triggerCls,
						onClick: () =>
							toast({
								title: 'Heads up',
								description: 'You have unsaved changes.',
								status: 'warning',
							}),
					},
					'Show warning',
				),
				h(
					'button',
					{
						class: triggerCls,
						onClick: () =>
							toast({
								title: 'Error',
								description: 'Something went wrong.',
								status: 'danger',
							}),
					},
					'Show error',
				),
			]);
	},
});

const PersistentDemo = defineComponent({
	name: 'PersistentDemo',
	setup() {
		const { toast } = useToast();
		return () =>
			h(
				'button',
				{
					class: triggerCls,
					onClick: () =>
						toast({
							id: 'persistent',
							title: 'Persistent',
							description: 'This toast stays until dismissed.',
							duration: 0,
						}),
				},
				'Show persistent',
			);
	},
});

const StackingDemo = defineComponent({
	name: 'StackingDemo',
	setup() {
		const { toast } = useToast();
		return () =>
			h(
				'button',
				{
					class: triggerCls,
					onClick: () => {
						toast({ title: 'Uploaded', description: 'design-mock.png', status: 'success' });
						setTimeout(() => toast({ title: 'Synced', description: 'All changes pushed.' }), 250);
						setTimeout(
							() => toast({ title: 'Reminder', description: 'You have a meeting in 10 min.' }),
							500,
						);
					},
				},
				'Stack 3 toasts',
			);
	},
});

function renderToastUI({
	title,
	description,
	dismiss,
}: {
	title?: string
	description?: string
	dismiss: () => void
}) {
	return h(Toast.Root, { class: toastCls }, () => [
		h('div', { class: 'flex-1' }, [
			title ? h(Toast.Title, { class: 'text-sm font-semibold text-black' }, () => title) : null,
			description
				? h(Toast.Description, { class: 'mt-0.5 text-sm text-[#6b7280]' }, () => description)
				: null,
		]),
		h(Toast.Close, { class: closeCls, onClick: dismiss }, () => '×'),
	]);
}

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Toast.Provider, {}, () => [
				h(Demo),
				h(
					Toast.Viewport,
					{ class: viewportCls },
					{
						default: ({ toast: t, dismiss }: { toast: ToastData; dismiss: () => void }) =>
							renderToastUI({ title: t.title, description: t.description, dismiss }),
					},
				),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(Toast.Provider, { defaultDuration: 3000 }, () => [
				h(PersistentDemo),
				h(
					'p',
					{ class: 'mt-3 text-xs text-[#6b7280]' },
					'Default toasts auto-dismiss after 3s. Persistent toast stays until you close it.',
				),
				h(
					Toast.Viewport,
					{ class: viewportCls },
					{
						default: ({ toast: t, dismiss }: { toast: ToastData; dismiss: () => void }) =>
							renderToastUI({ title: t.title, description: t.description, dismiss }),
					},
				),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(Toast.Provider, { defaultDuration: 5000 }, () => [
				h(StackingDemo),
				h(
					Toast.Viewport,
					{ class: viewportCls },
					{
						default: ({ toast: t, dismiss }: { toast: ToastData; dismiss: () => void }) =>
							h(Toast.Root, { class: toastCls }, () => [
								h('div', { class: 'flex-1' }, [
									h('div', { class: 'flex items-center gap-2' }, [
										h('span', {
											class: 'inline-block size-2 rounded-full data-[status=success]:bg-black data-[status=warning]:bg-black data-[status=danger]:bg-black',
											'data-status': t.status ?? 'default',
										}),
										h(
											Toast.Title,
											{ class: 'text-sm font-semibold text-black' },
											() => t.title,
										),
									]),
									t.description
										? h(
												Toast.Description,
												{ class: 'mt-1 text-sm text-[#6b7280]' },
												() => t.description,
											)
										: null,
								]),
								h(Toast.Close, { class: closeCls, onClick: dismiss }, () => '×'),
							]),
					},
				),
			]),
	}),
};
