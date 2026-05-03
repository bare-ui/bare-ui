import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { NumberInput } from '.';

const meta = {
	title: 'Forms/NumberInput',
	component: NumberInput.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Number input with increment/decrement controls, min/max clamping, and full keyboard support.',
			},
		},
	},
} satisfies Meta<typeof NumberInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperCls =
	'inline-flex w-fit self-start items-stretch overflow-hidden rounded-[8px] border border-black';
const fieldCls = 'w-16 bg-white px-2 py-2 text-center text-sm text-black outline-none focus:bg-[#f5f5f5]';
const stepBtnCls =
	'cursor-pointer bg-white px-3 text-sm text-black hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(NumberInput.Root, { defaultValue: 1, min: 0, max: 99, class: wrapperCls }, () => [
				h(NumberInput.Decrement, { class: `${stepBtnCls} border-r border-black` }, () => '−'),
				h(NumberInput.Field, { 'aria-label': 'Quantity', class: fieldCls }),
				h(NumberInput.Increment, { class: `${stepBtnCls} border-l border-black` }, () => '+'),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const value = ref<number | null>(0.5);
			return () =>
				h('div', { class: 'flex flex-col gap-3' }, [
					h(
						NumberInput.Root,
						{
							value: value.value,
							onChange: (v: number | null) => (value.value = v),
							min: 0,
							max: 1,
							step: 0.05,
							class: wrapperCls,
						},
						() => [
							h(NumberInput.Decrement, { class: `${stepBtnCls} border-r border-black` }, () => '−'),
							h(NumberInput.Field, { 'aria-label': 'Opacity', class: `${fieldCls} w-20` }),
							h(NumberInput.Increment, { class: `${stepBtnCls} border-l border-black` }, () => '+'),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, [
						'Step 0.05 — value: ',
						h('span', { class: 'font-medium text-black' }, value.value ?? '∅'),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const qty = ref<number | null>(2);
			const price = 19.99;
			return () => {
				const subtotal = (qty.value ?? 0) * price;
				return h(
					'div',
					{
						class: 'flex max-w-sm flex-col gap-4 rounded-[20px] border border-black bg-white p-5',
					},
					[
						h('div', {}, [
							h('p', { class: 'text-sm font-medium text-black' }, 'Wireframe T-Shirt'),
							h('p', { class: 'text-xs text-[#6b7280]' }, `$${price.toFixed(2)} each`),
						]),
						h('div', { class: 'flex items-center justify-between' }, [
							h('label', { class: 'text-sm font-medium text-black' }, 'Quantity'),
							h(
								NumberInput.Root,
								{
									value: qty.value,
									onChange: (v: number | null) => (qty.value = v),
									min: 1,
									max: 10,
									class: wrapperCls,
								},
								() => [
									h(
										NumberInput.Decrement,
										{ class: `${stepBtnCls} border-r border-black` },
										() => '−',
									),
									h(NumberInput.Field, { 'aria-label': 'Quantity', class: fieldCls }),
									h(
										NumberInput.Increment,
										{ class: `${stepBtnCls} border-l border-black` },
										() => '+',
									),
								],
							),
						]),
						h(
							'div',
							{ class: 'flex items-center justify-between border-t border-black pt-3 text-sm' },
							[
								h('span', { class: 'font-medium text-black' }, 'Subtotal'),
								h('span', { class: 'font-bold text-black' }, `$${subtotal.toFixed(2)}`),
							],
						),
					],
				);
			};
		},
	}),
};
