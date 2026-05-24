import type { Meta, StoryObj } from '@storybook/react-vite';
import { Editable } from './Editable';

const meta = {
	title: 'Forms/Editable',
	component: Editable.Root,
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

const previewCls =
	'cursor-text rounded-md px-2 py-1 text-sm text-black hover:bg-[#f3f4f6] data-[empty]:text-[#9ca3af]';
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

export const WithControls: Story = {
	render: () => (
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
	),
};

export const Multiline: Story = {
	render: () => (
		<Editable.Root
			defaultValue='A longer description that spans multiple lines. Press Cmd/Ctrl+Enter to save.'
			className='block w-80'>
			<Editable.Preview className='block cursor-text rounded-md p-2 text-sm leading-relaxed text-black hover:bg-[#f3f4f6]' />
			<Editable.Area
				rows={3}
				className='w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none'
			/>
		</Editable.Root>
	),
};
