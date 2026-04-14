import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Alert } from '.';

const meta = {
	title: 'Components/Alert',
	component: Alert.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Dismissible alert with auto-dismiss support.',
			},
		},
	},
} satisfies Meta<typeof Alert.Root>;

export default meta;

const alertCls = 'flex items-start gap-3 rounded-[8px] border-2 border-black bg-[#f5f5f5] px-4 py-3 text-black';

const dismissCls = [
	'ml-auto flex size-6 cursor-pointer items-center justify-center rounded-[8px]',
	'text-current opacity-60 outline-none',
	'[data-hover]:opacity-100',
	'[data-focus-visible]:ring-2 [data-focus-visible]:ring-black [data-focus-visible]:ring-offset-1',
	'[data-active]:scale-90',
].join(' ');

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Alert.Root, { class: alertCls }, () => [
				h('div', { class: 'flex-1' }, [
					h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Notice'),
					h(Alert.Description, { class: 'mt-0.5 text-sm' }, () => 'This is a default informational alert.'),
				]),
			]),
	}),
};

export const Success: Story = {
	render: () => ({
		setup: () => () =>
			h(Alert.Root, { status: 'success', class: alertCls }, () => [
				h('div', { class: 'flex-1' }, [
					h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Success'),
					h(
						Alert.Description,
						{ class: 'mt-0.5 text-sm' },
						() => 'Your changes have been saved successfully.',
					),
				]),
			]),
	}),
};

export const Warning: Story = {
	render: () => ({
		setup: () => () =>
			h(Alert.Root, { status: 'warning', class: alertCls }, () => [
				h('div', { class: 'flex-1' }, [
					h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Warning'),
					h(
						Alert.Description,
						{ class: 'mt-0.5 text-sm' },
						() => 'Please review the information before proceeding.',
					),
				]),
			]),
	}),
};

export const Danger: Story = {
	render: () => ({
		setup: () => () =>
			h(Alert.Root, { status: 'danger', class: alertCls }, () => [
				h('div', { class: 'flex-1' }, [
					h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Error'),
					h(Alert.Description, { class: 'mt-0.5 text-sm' }, () => 'Something went wrong. Please try again.'),
				]),
			]),
	}),
};

export const Dismissible: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Alert.Root,
				{
					status: 'success',
					isAutoDismissable: true,
					onDismiss: () => console.log('dismissed'),
					class: alertCls,
				},
				() => [
					h('div', { class: 'flex-1' }, [
						h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Dismissible Alert'),
						h(
							Alert.Description,
							{ class: 'mt-0.5 text-sm' },
							() => 'Click the \u00d7 button to dismiss this alert.',
						),
					]),
					h(Alert.Dismiss, { class: dismissCls }, () => '\u00d7'),
				],
			),
	}),
};

export const AutoDismiss: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Alert.Root,
				{ status: 'warning', isAutoDismissable: true, dismissCountdown: 3000, class: alertCls },
				() => [
					h('div', { class: 'flex-1' }, [
						h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Auto-dismiss in 3s'),
						h(
							Alert.Description,
							{ class: 'mt-0.5 text-sm' },
							() => 'This alert will disappear automatically.',
						),
					]),
				],
			),
	}),
};

export const AllStatuses: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{ class: 'flex flex-col gap-3' },
				[
					{ status: undefined, label: 'Default' },
					{ status: 'success' as const, label: 'Success' },
					{ status: 'warning' as const, label: 'Warning' },
					{ status: 'danger' as const, label: 'Error' },
				].map(({ status, label }) =>
					h(Alert.Root, { key: label, status, class: alertCls }, () => [
						h('div', { class: 'flex-1' }, [
							h(Alert.Title, { class: 'text-sm font-semibold' }, () => label),
							h(
								Alert.Description,
								{ class: 'mt-0.5 text-sm' },
								() => `This is a ${label.toLowerCase()} alert message.`,
							),
						]),
					]),
				),
			),
	}),
};
