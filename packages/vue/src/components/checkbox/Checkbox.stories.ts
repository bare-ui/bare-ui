import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Checkbox } from '.';

const meta = {
	title: 'Forms/Checkbox',
	component: Checkbox.Root,
	subcomponents: {
		'Checkbox.Item': Checkbox.Item,
		'Checkbox.Indicator': Checkbox.Indicator,
		'Checkbox.Label': Checkbox.Label,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Multi-select checkbox group with controlled state.',
			},
		},
	},
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkSvg = () =>
	h('svg', { class: 'h-3 w-3', viewBox: '0 0 12 12', fill: 'none' }, [
		h('path', { d: 'M2 6l3 3 5-5', stroke: 'currentColor', 'stroke-width': '2' }),
	]);

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Checkbox.Root,
				{ name: 'fruits', class: 'flex flex-col gap-3' },
				() =>
					['Apple', 'Banana', 'Cherry'].map((fruit) =>
						h(
							Checkbox.Item,
							{
								key: fruit,
								value: fruit.toLowerCase(),
								class: 'group flex cursor-pointer items-center gap-2',
							},
							() => [
								h(
									'span',
									{
										class: 'flex h-5 w-5 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black',
									},
									[h(Checkbox.Indicator, null, () => [checkSvg()])],
								),
								h(Checkbox.Label, { class: 'select-none text-sm text-black' }, () => fruit),
							],
						),
					),
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => {
			const composedItems = [
				{ value: 'terms', label: 'Terms of Service', desc: 'You agree to our terms' },
				{ value: 'privacy', label: 'Privacy Policy', desc: 'You accept our privacy policy' },
				{ value: 'newsletter', label: 'Newsletter', desc: 'Receive weekly updates' },
			];

			return () =>
				h(
					Checkbox.Root,
					{ name: 'agreements', class: 'flex flex-col gap-4' },
					() =>
						composedItems.map((item) =>
							h(
								Checkbox.Item,
								{
									key: item.value,
									value: item.value,
									class: 'group flex cursor-pointer items-start gap-3',
								},
								() => [
									h(
										'span',
										{
											class: 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black',
										},
										[h(Checkbox.Indicator, null, () => [checkSvg()])],
									),
									h('div', { class: 'flex flex-col' }, [
										h(
											Checkbox.Label,
											{ class: 'select-none text-sm font-medium text-black' },
											() => item.label,
										),
										h('span', { class: 'text-xs text-[#6b7280]' }, item.desc),
									]),
								],
							),
						),
				);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => {
			const settingsItems = [
				{ value: 'notifications', label: 'Push Notifications' },
				{ value: 'emails', label: 'Email Updates' },
				{ value: 'analytics', label: 'Usage Analytics' },
			];

			return () =>
				h('div', { class: 'w-full max-w-sm rounded-[20px] border border-black bg-white' }, [
					h('div', { class: 'px-5 py-4' }, [
						h('p', { class: 'text-sm font-medium text-black' }, 'Settings'),
					]),
					h(
						Checkbox.Root,
						{ name: 'settings', class: 'flex flex-col divide-y divide-black/10' },
						() =>
							settingsItems.map((item) =>
								h(
									Checkbox.Item,
									{
										key: item.value,
										value: item.value,
										class: 'group flex cursor-pointer items-center justify-between px-5 py-4',
									},
									() => [
										h(Checkbox.Label, { class: 'select-none text-sm text-black' }, () => item.label),
										h(
											'span',
											{
												class: 'flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black',
											},
											[h(Checkbox.Indicator, null, () => [checkSvg()])],
										),
									],
								),
							),
					),
				]);
		},
	}),
};
