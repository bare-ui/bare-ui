import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Alert } from '.';

const meta = {
	title: 'Feedback/Alert',
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

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-3 max-w-lg' }, [
				h(Alert.Root, { class: alertCls }, () => [
					h('div', { class: 'flex-1' }, [
						h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Heads up'),
						h(
							Alert.Description,
							{ class: 'mt-0.5 text-sm' },
							() => 'This is a default informational alert.',
						),
					]),
				]),
			]),
	}),
};

export const Composed: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-3 max-w-lg' }, [
				h(Alert.Root, { class: alertCls }, () => [
					h('div', { class: 'flex-1' }, [
						h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Default'),
						h(
							Alert.Description,
							{ class: 'mt-0.5 text-sm' },
							() => 'This is a default informational alert.',
						),
					]),
				]),
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
				h(Alert.Root, { status: 'danger', class: alertCls }, () => [
					h('div', { class: 'flex-1' }, [
						h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Error'),
						h(
							Alert.Description,
							{ class: 'mt-0.5 text-sm' },
							() => 'Something went wrong. Please try again.',
						),
					]),
				]),
			]),
	}),
};

export const Complex: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-3 max-w-lg' }, [
				h(Alert.Root, { status: 'warning', class: alertCls }, () => [
					h(
						'svg',
						{
							class: 'h-5 w-5 shrink-0 mt-0.5',
							fill: 'none',
							viewBox: '0 0 24 24',
							stroke: 'currentColor',
						},
						[
							h('path', {
								'stroke-linecap': 'round',
								'stroke-linejoin': 'round',
								'stroke-width': '2',
								d: 'M12 9v2m0 4h.01M10.29 3.86l-8.4 14.31A1.5 1.5 0 003.18 20h17.64a1.5 1.5 0 001.29-2.23l-8.4-14.31a1.5 1.5 0 00-2.58 0z',
							}),
						],
					),
					h('div', { class: 'flex-1' }, [
						h(Alert.Title, { class: 'text-sm font-semibold' }, () => 'Warning'),
						h(
							Alert.Description,
							{ class: 'mt-0.5 text-sm' },
							() => 'Your session is about to expire. Please save your work.',
						),
					]),
					h(
						Alert.Dismiss,
						{
							class: 'shrink-0 rounded-[8px] p-1 text-black hover:bg-[#e5e5e5] transition-colors',
						},
						() =>
							h(
								'svg',
								{
									class: 'h-4 w-4',
									fill: 'none',
									viewBox: '0 0 24 24',
									stroke: 'currentColor',
								},
								[
									h('path', {
										'stroke-linecap': 'round',
										'stroke-linejoin': 'round',
										'stroke-width': '2',
										d: 'M6 18L18 6M6 6l12 12',
									}),
								],
							),
					),
				]),
			]),
	}),
};
