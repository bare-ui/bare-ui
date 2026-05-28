import type { Meta, StoryObj } from '@storybook/react-vite';
import { Editable } from './Editable';

const meta = {
	title: 'Forms/Editable',
	component: Editable.Root,
	subcomponents: {
		'Editable.Preview': Editable.Preview,
		'Editable.Input': Editable.Input,
		'Editable.Area': Editable.Area,
		'Editable.EditTrigger': Editable.EditTrigger,
		'Editable.SubmitTrigger': Editable.SubmitTrigger,
		'Editable.CancelTrigger': Editable.CancelTrigger,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Inline text editing: click the preview to edit, Enter/blur to commit, Escape to discard. Pair with `Editable.Area` for multiline.',
			},
		},
	},
} satisfies Meta<typeof Editable.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const previewCls = 'cursor-text rounded-md px-2 py-1 text-sm text-black hover:bg-[#f3f4f6] data-[empty]:text-[#9ca3af]';
const inputCls = 'rounded-md border border-black px-2 py-1 text-sm text-black outline-none';

export const Default: Story = {
	render: () => (
		<Editable.Root
			defaultValue='Click to edit me'
			placeholder='Enter some text…'
			className='inline-flex'>
			<Editable.Preview className={previewCls} />
			<Editable.Input className={inputCls} />
		</Editable.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div className='flex flex-col gap-6'>
			<div className='space-y-1'>
				<p className='text-xs font-medium text-[#6b7280]'>With explicit controls</p>
				<Editable.Root
					defaultValue='Project title'
					submitOnBlur={false}
					className='flex items-center gap-2'>
					<Editable.Preview className={previewCls} />
					<Editable.Input className={inputCls} />
					<Editable.SubmitTrigger className='rounded-md bg-black px-2 py-1 text-xs text-white'>
						Save
					</Editable.SubmitTrigger>
					<Editable.CancelTrigger className='rounded-md border border-[#d1d5db] px-2 py-1 text-xs'>
						Cancel
					</Editable.CancelTrigger>
					<Editable.EditTrigger className='rounded-md border border-[#d1d5db] px-2 py-1 text-xs'>
						Edit
					</Editable.EditTrigger>
				</Editable.Root>
			</div>

			<div className='space-y-1'>
				<p className='text-xs font-medium text-[#6b7280]'>Multiline (Cmd/Ctrl+Enter to save)</p>
				<Editable.Root
					defaultValue='A longer description that spans multiple lines.'
					className='block w-80'>
					<Editable.Preview className='block cursor-text rounded-md p-2 text-sm leading-relaxed text-black hover:bg-[#f3f4f6]' />
					<Editable.Area
						rows={3}
						className='w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none'
					/>
				</Editable.Root>
			</div>

			<div className='space-y-1'>
				<p className='text-xs font-medium text-[#6b7280]'>Disabled</p>
				<Editable.Root
					defaultValue='Read-only value'
					disabled
					className='inline-flex'>
					<Editable.Preview className='cursor-not-allowed rounded-md px-2 py-1 text-sm text-[#9ca3af]' />
					<Editable.Input className={inputCls} />
				</Editable.Root>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div className='w-80 rounded-2xl border border-[#e5e7eb] bg-white p-5'>
			<div className='mb-4 flex items-center gap-3'>
				<div className='flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-lg font-semibold text-[#374151]'>
					JA
				</div>
				<div className='min-w-0 flex-1'>
					<Editable.Root
						defaultValue='Jerald Austero'
						className='block'>
						<Editable.Preview className='block w-full cursor-text rounded-md px-2 py-0.5 text-sm font-semibold text-black hover:bg-[#f3f4f6]' />
						<Editable.Input className='w-full rounded-md border border-black px-2 py-0.5 text-sm font-semibold outline-none' />
					</Editable.Root>
					<Editable.Root
						defaultValue='Product Designer'
						className='block'>
						<Editable.Preview className='block w-full cursor-text rounded-md px-2 py-0.5 text-xs text-[#6b7280] hover:bg-[#f3f4f6]' />
						<Editable.Input className='w-full rounded-md border border-black px-2 py-0.5 text-xs outline-none' />
					</Editable.Root>
				</div>
			</div>
			<label className='mb-1 block text-xs font-medium text-[#374151]'>Bio</label>
			<Editable.Root
				defaultValue='Designing accessible component systems.'
				placeholder='Add a short bio…'
				className='block'>
				<Editable.Preview className='block w-full cursor-text rounded-md border border-transparent p-2 text-sm leading-relaxed text-black hover:border-[#e5e7eb] data-[empty]:text-[#9ca3af]' />
				<Editable.Area
					rows={3}
					className='w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none'
				/>
			</Editable.Root>
		</div>
	),
};
