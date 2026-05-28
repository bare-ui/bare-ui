import { useState } from 'react';
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

const channels: MentionOption[] = [
	{ id: 'general', label: 'general' },
	{ id: 'random', label: 'random' },
	{ id: 'engineering', label: 'engineering' },
	{ id: 'design', label: 'design' },
];

const inputCls =
	'w-full resize-none rounded-lg border border-[#d1d5db] p-3 text-sm text-black outline-none focus:border-black';
const contentCls = 'z-10 mt-1 max-h-56 w-56 overflow-auto rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-lg';
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

export const Composed: Story = {
	render: () => (
		<div className='flex w-full max-w-md flex-col gap-8'>
			<div>
				<p className='mb-1.5 text-xs font-medium text-[#6b7280]'>@ mention people</p>
				<Mention.Root
					options={people}
					className='relative'>
					<Mention.Input
						aria-label='Mention people'
						rows={3}
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
			</div>

			<div>
				<p className='mb-1.5 text-xs font-medium text-[#6b7280]'># reference channels</p>
				<Mention.Root
					options={channels}
					trigger='#'
					className='relative'>
					<Mention.Input
						aria-label='Reference channel'
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
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className='w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm'>
				<div className='flex items-start gap-3'>
					<div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white'>
						You
					</div>
					<div className='relative flex-1'>
						<Mention.Root
							options={people}
							value={value}
							onChange={setValue}
							className='relative'>
							<Mention.Input
								aria-label='Write a comment'
								rows={3}
								placeholder='Add a comment… use @ to notify a teammate'
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
								<Mention.Empty className='px-2 py-1.5 text-sm text-[#9ca3af]'>
									No people found
								</Mention.Empty>
							</Mention.Content>
						</Mention.Root>
					</div>
				</div>
				<div className='mt-3 flex items-center justify-end gap-2'>
					<button className='rounded-lg px-3 py-1.5 text-sm font-medium text-[#6b7280] hover:bg-[#f5f5f5]'>
						Cancel
					</button>
					<button
						disabled={value.trim().length === 0}
						className='rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40'>
						Comment
					</button>
				</div>
			</div>
		);
	},
};
