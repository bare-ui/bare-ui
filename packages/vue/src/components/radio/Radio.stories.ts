import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Radio } from '.';

const meta = {
	title: 'Forms/Radio',
	component: Radio.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Single-select radio group with compound item pattern.',
			},
		},
	},
} satisfies Meta<typeof Radio.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
	{
		value: 'startup',
		label: 'Startup',
		description: 'Up to 5 active job postings',
		ram: '12GB',
		cpus: '6 CPUs',
		disk: '160 GB SSD disk',
	},
	{
		value: 'business',
		label: 'Business',
		description: 'Up to 25 active job postings',
		ram: '16GB',
		cpus: '8 CPUs',
		disk: '512 GB SSD disk',
	},
	{
		value: 'enterprise',
		label: 'Enterprise',
		description: 'Unlimited active job postings',
		ram: '32GB',
		cpus: '12 CPUs',
		disk: '1024 GB SSD disk',
	},
];

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Radio.Root,
				{ name: 'plan-basic', class: 'space-y-2' },
				() =>
					plans.map((plan) =>
						h(
							Radio.Item,
							{
								key: plan.value,
								value: plan.value,
								class: 'group relative flex cursor-pointer rounded-[8px] border border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]',
							},
							() => [
								h('div', { class: 'flex w-full items-center gap-3' }, [
									h(
										'span',
										{
											class: 'flex size-5 shrink-0 items-center justify-center rounded-full border border-black bg-white transition group-data-[checked]:bg-black',
										},
										[h(Radio.Indicator, { class: 'size-2 rounded-full bg-white' })],
									),
									h(Radio.Label, { class: 'text-sm font-medium text-black' }, () => plan.label),
								]),
							],
						),
					),
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Radio.Root,
				{ name: 'plan-composed', class: 'space-y-2' },
				() =>
					plans.map((plan) =>
						h(
							Radio.Item,
							{
								key: plan.value,
								value: plan.value,
								class: 'group relative flex cursor-pointer rounded-[8px] border border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]',
							},
							() => [
								h('div', { class: 'flex w-full items-center gap-3' }, [
									h(
										'span',
										{
											class: 'flex size-5 shrink-0 items-center justify-center rounded-full border border-black bg-white transition group-data-[checked]:bg-black',
										},
										[h(Radio.Indicator, { class: 'size-2 rounded-full bg-white' })],
									),
									h('div', null, [
										h(Radio.Label, { class: 'block text-sm font-medium text-black' }, () => plan.label),
										h('p', { class: 'text-xs text-[#6b7280]' }, plan.description),
									]),
								]),
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
				Radio.Root,
				{ name: 'plan-complex', class: 'space-y-2' },
				() =>
					plans.map((plan) =>
						h(
							Radio.Item,
							{
								key: plan.value,
								value: plan.value,
								class: 'group relative flex cursor-pointer rounded-[8px] border border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]',
							},
							() => [
								h('div', { class: 'flex w-full items-center justify-between gap-4' }, [
									h('div', { class: 'flex items-center gap-3' }, [
										h(
											'span',
											{
												class: 'flex size-5 shrink-0 items-center justify-center rounded-full border border-black bg-white transition group-data-[checked]:border-black group-data-[checked]:bg-black',
											},
											[h(Radio.Indicator, { class: 'size-2 rounded-full bg-white' })],
										),
										h('div', null, [
											h(
												Radio.Label,
												{ class: 'block text-sm font-medium text-black' },
												() => plan.label,
											),
											h('p', { class: 'text-xs text-[#6b7280]' }, plan.description),
										]),
									]),
									h(
										'div',
										{
											class: 'flex shrink-0 gap-4 text-xs text-[#6b7280] group-data-[checked]:text-black',
										},
										[
											h('span', null, plan.ram),
											h('span', null, plan.cpus),
											h('span', null, plan.disk),
										],
									),
								]),
							],
						),
					),
			),
	}),
};
