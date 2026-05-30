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

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex w-64 flex-col gap-6' }, [
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'Thin',
					),
					h(Divider, { class: 'h-px w-full bg-[#e5e7eb]' }),
				]),
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'Thick',
					),
					h(Divider, { class: 'h-1 w-full rounded-full bg-black' }),
				]),
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'Dashed',
					),
					h(Divider, { class: 'w-full border-t border-dashed border-[#9ca3af]' }),
				]),
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'Inset',
					),
					h(Divider, { class: 'ml-8 h-px w-[calc(100%-2rem)] bg-black' }),
				]),
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3' },
						'Semantic (separator role)',
					),
					h(Divider, { decorative: false, class: 'h-px w-full bg-black' }),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white' }, [
				h('div', { class: 'p-4' }, [
					h('p', { class: 'text-sm font-semibold text-black' }, 'Account'),
					h('p', { class: 'text-xs text-[#6b7280]' }, 'jane@example.com'),
				]),
				h(Divider, { class: 'h-px w-full bg-[#e5e7eb]' }),
				h(
					'nav',
					{ class: 'flex flex-col py-1' },
					['Profile', 'Billing', 'Notifications'].map((item) =>
						h(
							'a',
							{
								key: item,
								href: '#',
								onClick: (e: Event) => e.preventDefault(),
								class: 'px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]',
							},
							item,
						),
					),
				),
				h(Divider, { class: 'h-px w-full bg-[#e5e7eb]' }),
				h('div', { class: 'flex items-center justify-between p-3' }, [
					h('div', { class: 'flex h-5 items-center gap-3 text-xs text-[#6b7280]' }, [
						h(
							'a',
							{ href: '#', onClick: (e: Event) => e.preventDefault(), class: 'hover:text-black' },
							'Help',
						),
						h(Divider, { orientation: 'vertical', class: 'h-full w-px bg-[#d1d5db]' }),
						h(
							'a',
							{ href: '#', onClick: (e: Event) => e.preventDefault(), class: 'hover:text-black' },
							'Privacy',
						),
						h(Divider, { orientation: 'vertical', class: 'h-full w-px bg-[#d1d5db]' }),
						h(
							'a',
							{ href: '#', onClick: (e: Event) => e.preventDefault(), class: 'hover:text-black' },
							'Terms',
						),
					]),
					h(
						'button',
						{ class: 'text-xs font-medium text-black hover:underline' },
						'Sign out',
					),
				]),
			]),
	}),
};
