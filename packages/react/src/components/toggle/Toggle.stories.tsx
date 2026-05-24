import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle, ToggleGroup } from './Toggle';

const meta = {
	title: 'Forms/Toggle',
	component: Toggle,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A two-state pressable button (`aria-pressed`, `data-state="on"|"off"`). Use it standalone, or drop several inside `ToggleGroup.Root` (single or multiple selection) for a segmented control / formatting pill bar. Distinct from `Switch`, which is a settings on/off control.',
			},
		},
	},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const toggleCls =
	'flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm text-[#374151] hover:bg-[#f3f4f6] data-[state=on]:bg-black data-[state=on]:text-white data-[disabled]:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-black';

export const Standalone: Story = {
	render: () => (
		<Toggle
			className={toggleCls}
			aria-label='Toggle italic'>
			<i>I</i>
		</Toggle>
	),
};

const groupCls = 'inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1';

export const SingleSelect: Story = {
	render: () => {
		const [value, setValue] = useState<string | null>('center');
		return (
			<div className='space-y-2'>
				<ToggleGroup.Root
					type='single'
					value={value}
					onChange={setValue}
					className={groupCls}
					aria-label='Text alignment'>
					<Toggle
						value='left'
						className={toggleCls}
						aria-label='Align left'>
						⬅
					</Toggle>
					<Toggle
						value='center'
						className={toggleCls}
						aria-label='Align center'>
						↔
					</Toggle>
					<Toggle
						value='right'
						className={toggleCls}
						aria-label='Align right'>
						➡
					</Toggle>
				</ToggleGroup.Root>
				<p className='text-xs text-[#6b7280]'>Selected: {value ?? 'none'}</p>
			</div>
		);
	},
};

export const MultiSelect: Story = {
	render: () => {
		const [value, setValue] = useState<string[]>(['bold']);
		return (
			<div className='space-y-2'>
				<ToggleGroup.Root
					type='multiple'
					value={value}
					onChange={setValue}
					className={groupCls}
					aria-label='Text formatting'>
					<Toggle
						value='bold'
						className={toggleCls}
						aria-label='Bold'>
						<b>B</b>
					</Toggle>
					<Toggle
						value='italic'
						className={toggleCls}
						aria-label='Italic'>
						<i>I</i>
					</Toggle>
					<Toggle
						value='underline'
						className={`${toggleCls} underline`}
						aria-label='Underline'>
						U
					</Toggle>
				</ToggleGroup.Root>
				<p className='text-xs text-[#6b7280]'>Active: {value.join(', ') || 'none'}</p>
			</div>
		);
	},
};
