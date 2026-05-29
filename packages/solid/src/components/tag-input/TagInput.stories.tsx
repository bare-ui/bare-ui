import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { TagInput } from './TagInput';
import { Tag } from '../tag/Tag';

const meta = {
	title: 'Forms/TagInput',
	component: TagInput.Root,
	subcomponents: {
		'TagInput.List': TagInput.List,
		'TagInput.Items': TagInput.Items,
		'TagInput.Field': TagInput.Field,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Multi-tag input. Press Enter or comma to add; Backspace at empty input removes the last tag.',
			},
		},
	},
} satisfies Meta<typeof TagInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperCls =
	'flex flex-wrap items-center gap-1.5 rounded-[8px] border border-black bg-white px-2 py-1.5 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-1 data-[disabled]:opacity-50';
const fieldCls =
	'flex-1 min-w-[100px] bg-transparent px-1 py-1 text-sm text-black outline-none placeholder:text-[#a3a3a3]';
const tagCls =
	'inline-flex items-center gap-1 rounded-full border border-black bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-black';
const removeCls = 'inline-flex size-4 items-center justify-center rounded-full text-black hover:bg-[#e5e5e5]';

export const Default: Story = {
	render: () => (
		<TagInput.Root
			defaultValue={['react', 'tailwind']}
			class={wrapperCls}>
			<TagInput.Items>
				{(tag, _i, remove) => (
					<Tag.Root class={tagCls}>
						<Tag.Label>{tag}</Tag.Label>
						<Tag.Remove
							class={removeCls}
							onClick={remove}>
							×
						</Tag.Remove>
					</Tag.Root>
				)}
			</TagInput.Items>
			<TagInput.Field
				placeholder='Add a tag…'
				class={fieldCls}
			/>
		</TagInput.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const [tags, setTags] = createSignal<string[]>(['design', 'typography']);
		return (
			<div class='flex flex-col gap-2'>
				<label class='text-sm font-medium text-black'>Topics</label>
				<TagInput.Root
					value={tags()}
					onChange={setTags}
					maxTags={5}
					class={wrapperCls}>
					<TagInput.Items>
						{(tag, _i, remove) => (
							<Tag.Root class={tagCls}>
								<Tag.Label>{tag}</Tag.Label>
								<Tag.Remove
									class={removeCls}
									onClick={remove}>
									×
								</Tag.Remove>
							</Tag.Root>
						)}
					</TagInput.Items>
					<TagInput.Field
						placeholder={tags().length >= 5 ? '' : 'Add up to 5 topics'}
						class={fieldCls}
					/>
				</TagInput.Root>
				<p class='text-xs text-[#6b7280]'>{tags().length}/5 — press Enter or comma to add</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [emails, setEmails] = createSignal<string[]>([]);
		const validate = (raw: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
		return (
			<div class='flex max-w-md flex-col gap-2'>
				<label class='text-sm font-medium text-black'>Invite teammates</label>
				<TagInput.Root
					value={emails()}
					onChange={setEmails}
					validate={validate}
					commitKeys={['Enter', ',', ' ']}
					class={wrapperCls}>
					<TagInput.Items>
						{(tag, _i, remove) => (
							<Tag.Root class={tagCls}>
								<Tag.Label>{tag}</Tag.Label>
								<Tag.Remove
									class={removeCls}
									onClick={remove}>
									×
								</Tag.Remove>
							</Tag.Root>
						)}
					</TagInput.Items>
					<TagInput.Field
						placeholder='name@company.com'
						class={fieldCls}
					/>
				</TagInput.Root>
				<p class='text-xs text-[#6b7280]'>
					Email-validated; commit on Enter, comma, or space. Invalid entries are silently rejected.
				</p>
			</div>
		);
	},
};
