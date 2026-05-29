import type { Meta, StoryObj } from 'storybook-solidjs-vite';
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

const previewCls =
	'cursor-text rounded-md px-2 py-1 text-sm text-black hover:bg-[#f3f4f6] data-[empty]:text-[#9ca3af]';
const inputCls = 'rounded-md border border-black px-2 py-1 text-sm text-black outline-none';

export const Default: Story = {
	render: () => (
		<Editable.Root
			defaultValue='Click to edit me'
			placeholder='Enter some text…'
			class='inline-flex'>
			<Editable.Preview class={previewCls} />
			<Editable.Input class={inputCls} />
		</Editable.Root>
	),
};

export const WithControls: Story = {
	render: () => (
		<Editable.Root
			defaultValue='Project title'
			submitOnBlur={false}
			class='flex items-center gap-2'>
			<Editable.Preview class={previewCls} />
			<Editable.Input class={inputCls} />
			<Editable.SubmitTrigger class='rounded-md bg-black px-2 py-1 text-xs text-white'>
				Save
			</Editable.SubmitTrigger>
			<Editable.CancelTrigger class='rounded-md border border-[#d1d5db] px-2 py-1 text-xs'>
				Cancel
			</Editable.CancelTrigger>
			<Editable.EditTrigger class='rounded-md border border-[#d1d5db] px-2 py-1 text-xs'>
				Edit
			</Editable.EditTrigger>
		</Editable.Root>
	),
};

export const Multiline: Story = {
	render: () => (
		<Editable.Root
			defaultValue='A longer description that spans multiple lines. Press Cmd/Ctrl+Enter to save.'
			class='block w-80'>
			<Editable.Preview class='block cursor-text rounded-md p-2 text-sm leading-relaxed text-black hover:bg-[#f3f4f6]' />
			<Editable.Area
				rows={3}
				class='w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none'
			/>
		</Editable.Root>
	),
};
