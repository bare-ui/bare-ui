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
const groupCls = 'inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1';

export const Default: Story = {
	render: () => (
		<Toggle
			className={toggleCls}
			aria-label='Toggle italic'>
			<i>I</i>
		</Toggle>
	),
};

export const Composed: Story = {
	render: () => {
		const [single, setSingle] = useState<string | null>('center');
		const [multi, setMulti] = useState<string[]>(['bold']);
		return (
			<div className='space-y-6'>
				<div className='space-y-2'>
					<p className='text-xs font-medium text-[#6b7280]'>Single select (alignment)</p>
					<ToggleGroup.Root
						type='single'
						value={single}
						onChange={setSingle}
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
					<p className='text-xs text-[#6b7280]'>Selected: {single ?? 'none'}</p>
				</div>

				<div className='space-y-2'>
					<p className='text-xs font-medium text-[#6b7280]'>Multiple select (formatting)</p>
					<ToggleGroup.Root
						type='multiple'
						value={multi}
						onChange={setMulti}
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
					<p className='text-xs text-[#6b7280]'>Active: {multi.join(', ') || 'none'}</p>
				</div>

				<div className='space-y-2'>
					<p className='text-xs font-medium text-[#6b7280]'>Vertical, disabled</p>
					<ToggleGroup.Root
						type='single'
						defaultValue='grid'
						orientation='vertical'
						disabled
						className={`${groupCls} flex-col items-stretch`}
						aria-label='Layout'>
						<Toggle
							value='list'
							className={toggleCls}>
							List
						</Toggle>
						<Toggle
							value='grid'
							className={toggleCls}>
							Grid
						</Toggle>
					</ToggleGroup.Root>
				</div>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [marks, setMarks] = useState<string[]>(['bold']);
		const [align, setAlign] = useState<string | null>('left');
		return (
			<div className='w-[30rem] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white'>
				<div className='flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-[#f5f5f5] px-3 py-2'>
					<ToggleGroup.Root
						type='multiple'
						value={marks}
						onChange={setMarks}
						className='inline-flex items-center gap-1'
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

					<span className='mx-1 h-5 w-px bg-[#e5e7eb]' />

					<ToggleGroup.Root
						type='single'
						value={align}
						onChange={setAlign}
						className='inline-flex items-center gap-1'
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

					<span className='mx-1 h-5 w-px bg-[#e5e7eb]' />

					<Toggle
						className={toggleCls}
						aria-label='Toggle code block'>
						{'</>'}
					</Toggle>
				</div>
				<p
					className='p-4 text-sm leading-relaxed text-black'
					style={{
						fontWeight: marks.includes('bold') ? 700 : 400,
						fontStyle: marks.includes('italic') ? 'italic' : 'normal',
						textDecoration: marks.includes('underline') ? 'underline' : 'none',
						textAlign: (align ?? 'left') as 'left' | 'center' | 'right',
					}}>
					The quick brown fox jumps over the lazy dog. Toggle the controls above to format this text.
				</p>
			</div>
		);
	},
};
