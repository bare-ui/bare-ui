import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Divider } from '.';

const meta = {
	title: 'Layout/Divider',
	component: Divider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Horizontal or vertical separator line.',
			},
		},
	},
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-8' }, [
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'Horizontal',
					),
					h('div', { class: 'flex flex-col gap-3' }, [
						h('p', { class: 'text-sm text-black' }, 'Item one'),
						h(Divider, { class: 'h-[2px] w-full bg-black' }),
						h('p', { class: 'text-sm text-black' }, 'Item two'),
						h(Divider, { class: 'h-[2px] w-full bg-black' }),
						h('p', { class: 'text-sm text-black' }, 'Item three'),
					]),
				]),
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'Vertical',
					),
					h('div', { class: 'flex h-6 items-center gap-3' }, [
						h('span', { class: 'text-sm text-black' }, 'Home'),
						h(Divider, { orientation: 'vertical', class: 'h-full w-[2px] bg-black' }),
						h('span', { class: 'text-sm text-black' }, 'About'),
						h(Divider, { orientation: 'vertical', class: 'h-full w-[2px] bg-black' }),
						h('span', { class: 'text-sm text-black' }, 'Contact'),
					]),
				]),
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'With label',
					),
					h('div', { class: 'flex w-64 items-center gap-3' }, [
						h(Divider, { class: 'h-[2px] flex-1 bg-black' }),
						h('span', { class: 'text-xs font-medium text-[#6b7280]' }, 'OR'),
						h(Divider, { class: 'h-[2px] flex-1 bg-black' }),
					]),
				]),
			]),
	}),
};
