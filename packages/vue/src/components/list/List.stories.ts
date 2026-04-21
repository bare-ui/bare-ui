import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { List } from '.';

const meta = {
	title: 'Layout/List',
	component: List,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Semantic list element with no opinions about styling.',
			},
		},
	},
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				List,
				{
					class: 'w-72 divide-y divide-black overflow-hidden rounded-[8px] border border-black bg-white',
				},
				() =>
					['Profile settings', 'Notifications', 'Privacy controls', 'Help center'].map((item) =>
						h('li', { key: item, class: 'px-4 py-3 text-sm text-black' }, item),
					),
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				List,
				{
					class: 'w-72 divide-y divide-[#2a2a2a] overflow-hidden rounded-[8px] border border-black bg-white',
				},
				() =>
					[
						{ label: 'Profile', icon: '\u{1F464}', desc: 'Manage your account' },
						{ label: 'Notifications', icon: '\u{1F514}', desc: 'Configure alerts' },
						{ label: 'Privacy', icon: '\u{1F512}', desc: 'Control your data' },
						{ label: 'Help', icon: '\u2753', desc: 'Get support' },
					].map(({ label, icon, desc }) =>
						h(
							'li',
							{
								key: label,
								class: 'flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-black hover:bg-[#f5f5f5]',
							},
							[
								h('span', { class: 'text-xl' }, icon),
								h('div', {}, [
									h('p', { class: 'text-sm font-medium text-black' }, label),
									h('p', { class: 'text-xs text-[#6b7280]' }, desc),
								]),
								h(
									'svg',
									{
										class: 'ml-auto h-4 w-4 text-[#6b7280]',
										viewBox: '0 0 20 20',
										fill: 'currentColor',
									},
									[
										h('path', {
											'fill-rule': 'evenodd',
											d: 'M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z',
											'clip-rule': 'evenodd',
										}),
									],
								),
							],
						),
					),
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(
				List,
				{ class: 'w-64 space-y-2' },
				() =>
					[
						{ label: 'Design mockups', done: true },
						{ label: 'Write unit tests', done: true },
						{ label: 'Implement API', done: false },
						{ label: 'Deploy to staging', done: false },
					].map(({ label, done }) =>
						h('li', { key: label, class: 'flex items-center gap-2.5 text-sm' }, [
							h(
								'span',
								{
									class: [
										'flex h-5 w-5 items-center justify-center rounded-full border',
										done ? 'border-black bg-black text-white' : 'border-black bg-white',
									].join(' '),
								},
								done
									? [
											h(
												'svg',
												{ class: 'h-3 w-3', viewBox: '0 0 12 12', fill: 'currentColor' },
												[
													h('path', {
														d: 'M3.5 6L5.5 8L8.5 4.5',
														stroke: 'white',
														'stroke-width': '1.5',
														fill: 'none',
														'stroke-linecap': 'round',
														'stroke-linejoin': 'round',
													}),
												],
											),
										]
									: [],
							),
							h('span', { class: done ? 'text-[#6b7280] line-through' : 'text-black' }, label),
						]),
					),
			),
	}),
};
