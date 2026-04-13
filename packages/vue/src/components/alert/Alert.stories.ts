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
				component: 'Alert component with title, description, and dismiss functionality.',
			},
		},
	},
} satisfies Meta<typeof Alert.Root>;

export default meta;

const alertCls = 'flex items-start gap-3 rounded-[20px] border-[3px] border-black bg-white p-4';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Alert.Root, { class: alertCls }, () => [
				h(Alert.Title, { class: 'text-sm font-bold' }, () => 'Information'),
				h(Alert.Description, { class: 'text-sm text-[#9ca3af]' }, () => 'This is an informational alert.'),
			]),
	}),
};

export const Dismissible: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Alert.Root, { status: 'warning', class: alertCls }, () => [
				h('div', { class: 'flex-1' }, [
					h(Alert.Title, { class: 'text-sm font-bold' }, () => 'Warning'),
					h(Alert.Description, { class: 'text-sm text-[#9ca3af]' }, () => 'This can be dismissed.'),
				]),
				h(Alert.Dismiss, { class: 'text-sm font-bold cursor-pointer' }, () => '×'),
			]),
	}),
};
