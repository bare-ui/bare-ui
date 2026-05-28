import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mention } from './Mention';
import type { MentionOption } from './Mention.types';

const meta = {
	title: 'AI/Mention',
	component: Mention.Root,
	subcomponents: {
		'Mention.Input': Mention.Input,
		'Mention.Content': Mention.Content,
		'Mention.Items': Mention.Items,
		'Mention.Empty': Mention.Empty,
	},
	tags: ['autodocs'],
	args: { options: [] },
	parameters: {
		docs: {
			description: {
				component:
					'Inline `@`-mention primitive: a combobox that tracks the caret inside a textarea, filters as you type, and inserts the chosen token. The trigger character, options and filtering are all configurable.',
			},
		},
	},
} satisfies Meta<typeof Mention.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const people: MentionOption[] = [
	{ id: 1, label: 'Ada Lovelace' },
	{ id: 2, label: 'Alan Turing' },
	{ id: 3, label: 'Grace Hopper' },
	{ id: 4, label: 'Katherine Johnson' },
	{ id: 5, label: 'Linus Torvalds', disabled: true },
];

const inputCls =
	'w-full resize-none rounded-lg border border-[#d1d5db] p-3 text-sm text-black outline-none focus:border-black';
const contentCls =
	'z-10 mt-1 max-h-56 w-56 overflow-auto rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-lg';
const itemCls =
	'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-black data-[active]:bg-[#f3f4f6] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';

export const Default: Story = {
	render: () => (
		<Mention.Root
			options={people}
			defaultValue='Hey '
			className='relative w-full max-w-md'>
			<Mention.Input
				aria-label='Comment'
				rows={4}
				placeholder='Type @ to mention someone…'
				className={inputCls}
			/>
			<Mention.Content className={contentCls}>
				<Mention.Items>
					{({ option }) => (
						<div className={itemCls}>
							<span className='flex size-6 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-[#4338ca]'>
								{option.label.charAt(0)}
							</span>
							{option.label}
						</div>
					)}
				</Mention.Items>
				<Mention.Empty className='px-2 py-1.5 text-sm text-[#9ca3af]'>No people found</Mention.Empty>
			</Mention.Content>
		</Mention.Root>
	),
};

const channels: MentionOption[] = [
	{ id: 'general', label: 'general' },
	{ id: 'random', label: 'random' },
	{ id: 'engineering', label: 'engineering' },
	{ id: 'design', label: 'design' },
];

/** A custom trigger character — here `#` for channels instead of `@`. */
export const CustomTrigger: Story = {
	render: () => (
		<Mention.Root
			options={channels}
			trigger='#'
			className='relative w-full max-w-md'>
			<Mention.Input
				aria-label='Message'
				rows={3}
				placeholder='Reference a #channel…'
				className={inputCls}
			/>
			<Mention.Content className={contentCls}>
				<Mention.Items>
					{({ option }) => (
						<div className={itemCls}>
							<span className='text-[#9ca3af]'>#</span>
							{option.label}
						</div>
					)}
				</Mention.Items>
				<Mention.Empty className='px-2 py-1.5 text-sm text-[#9ca3af]'>No channels</Mention.Empty>
			</Mention.Content>
		</Mention.Root>
	),
};
