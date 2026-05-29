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

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-6'>
			<div class='space-y-1'>
				<p class='text-xs font-medium text-[#6b7280]'>With explicit controls</p>
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
			</div>

			<div class='space-y-1'>
				<p class='text-xs font-medium text-[#6b7280]'>Multiline (Cmd/Ctrl+Enter to save)</p>
				<Editable.Root
					defaultValue='A longer description that spans multiple lines.'
					class='block w-80'>
					<Editable.Preview class='block cursor-text rounded-md p-2 text-sm leading-relaxed text-black hover:bg-[#f3f4f6]' />
					<Editable.Area
						rows={3}
						class='w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none'
					/>
				</Editable.Root>
			</div>

			<div class='space-y-1'>
				<p class='text-xs font-medium text-[#6b7280]'>Disabled</p>
				<Editable.Root
					defaultValue='Read-only value'
					disabled
					class='inline-flex'>
					<Editable.Preview class='cursor-not-allowed rounded-md px-2 py-1 text-sm text-[#9ca3af]' />
					<Editable.Input class={inputCls} />
				</Editable.Root>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='w-80 rounded-2xl border border-[#e5e7eb] bg-white p-5'>
			<div class='mb-4 flex items-center gap-3'>
				<div class='flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-lg font-semibold text-[#374151]'>
					JA
				</div>
				<div class='min-w-0 flex-1'>
					<Editable.Root
						defaultValue='Jerald Austero'
						class='block'>
						<Editable.Preview class='block w-full cursor-text rounded-md px-2 py-0.5 text-sm font-semibold text-black hover:bg-[#f3f4f6]' />
						<Editable.Input class='w-full rounded-md border border-black px-2 py-0.5 text-sm font-semibold outline-none' />
					</Editable.Root>
					<Editable.Root
						defaultValue='Product Designer'
						class='block'>
						<Editable.Preview class='block w-full cursor-text rounded-md px-2 py-0.5 text-xs text-[#6b7280] hover:bg-[#f3f4f6]' />
						<Editable.Input class='w-full rounded-md border border-black px-2 py-0.5 text-xs outline-none' />
					</Editable.Root>
				</div>
			</div>
			<label class='mb-1 block text-xs font-medium text-[#374151]'>Bio</label>
			<Editable.Root
				defaultValue='Designing accessible component systems.'
				placeholder='Add a short bio…'
				class='block'>
				<Editable.Preview class='block w-full cursor-text rounded-md border border-transparent p-2 text-sm leading-relaxed text-black hover:border-[#e5e7eb] data-[empty]:text-[#9ca3af]' />
				<Editable.Area
					rows={3}
					class='w-full resize-none rounded-md border border-black p-2 text-sm leading-relaxed outline-none'
				/>
			</Editable.Root>
		</div>
	),
};
