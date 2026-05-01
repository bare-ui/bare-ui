import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from './NumberInput';

const meta = {
	title: 'Forms/NumberInput',
	component: NumberInput.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Number input with increment/decrement controls, min/max clamping, and full keyboard support.',
			},
		},
	},
} satisfies Meta<typeof NumberInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperCls = 'inline-flex w-fit self-start items-stretch overflow-hidden rounded-[8px] border border-black';
const fieldCls = 'w-16 bg-white px-2 py-2 text-center text-sm text-black outline-none focus:bg-[#f5f5f5]';
const stepBtnCls =
	'cursor-pointer bg-white px-3 text-sm text-black hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40';

export const Default: Story = {
	render: () => (
		<NumberInput.Root defaultValue={1} min={0} max={99} className={wrapperCls}>
			<NumberInput.Decrement className={`${stepBtnCls} border-r border-black`}>−</NumberInput.Decrement>
			<NumberInput.Field aria-label='Quantity' className={fieldCls} />
			<NumberInput.Increment className={`${stepBtnCls} border-l border-black`}>+</NumberInput.Increment>
		</NumberInput.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const [value, setValue] = useState<number | null>(0.5);
		return (
			<div className='flex flex-col gap-3'>
				<NumberInput.Root
					value={value}
					onChange={setValue}
					min={0}
					max={1}
					step={0.05}
					className={wrapperCls}>
					<NumberInput.Decrement className={`${stepBtnCls} border-r border-black`}>−</NumberInput.Decrement>
					<NumberInput.Field aria-label='Opacity' className={`${fieldCls} w-20`} />
					<NumberInput.Increment className={`${stepBtnCls} border-l border-black`}>+</NumberInput.Increment>
				</NumberInput.Root>
				<p className='text-xs text-[#6b7280]'>
					Step 0.05 — value: <span className='font-medium text-black'>{value ?? '∅'}</span>
				</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [qty, setQty] = useState<number | null>(2);
		const price = 19.99;
		const subtotal = (qty ?? 0) * price;

		return (
			<div className='flex max-w-sm flex-col gap-4 rounded-[20px] border border-black bg-white p-5'>
				<div>
					<p className='text-sm font-medium text-black'>Wireframe T-Shirt</p>
					<p className='text-xs text-[#6b7280]'>${price.toFixed(2)} each</p>
				</div>
				<div className='flex items-center justify-between'>
					<label className='text-sm font-medium text-black'>Quantity</label>
					<NumberInput.Root
						value={qty}
						onChange={setQty}
						min={1}
						max={10}
						className={wrapperCls}>
						<NumberInput.Decrement className={`${stepBtnCls} border-r border-black`}>−</NumberInput.Decrement>
						<NumberInput.Field aria-label='Quantity' className={fieldCls} />
						<NumberInput.Increment className={`${stepBtnCls} border-l border-black`}>+</NumberInput.Increment>
					</NumberInput.Root>
				</div>
				<div className='flex items-center justify-between border-t border-black pt-3 text-sm'>
					<span className='font-medium text-black'>Subtotal</span>
					<span className='font-bold text-black'>${subtotal.toFixed(2)}</span>
				</div>
			</div>
		);
	},
};
