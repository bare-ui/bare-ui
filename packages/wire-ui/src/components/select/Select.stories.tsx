import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta = {
	title: 'Components/Select',
	component: Select.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Accessible select menu with groups, separators, and a custom trigger.',
			},
		},
	},
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls = [
	'flex w-full items-center justify-between gap-2 rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm outline-none transition',
	'data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1',
	'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
	'data-[hover]:bg-[#f5f5f5]',
].join(' ');

const contentCls =
	'absolute z-50 mt-1 w-full overflow-hidden rounded-[20px] border-[3px] border-black bg-white py-1 shadow-lg';

const itemCls = [
	'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-black outline-none transition',
	'data-[hover]:bg-[#f5f5f5]',
	'data-[selected]:font-medium',
	'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
].join(' ');

const ChevronIcon = () => (
	<svg
		className='size-4 shrink-0 text-black transition-transform data-[state=open]:rotate-180'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fillRule='evenodd'
			d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
			clipRule='evenodd'
		/>
	</svg>
);

const CheckIcon = () => (
	<svg className='size-4' viewBox='0 0 20 20' fill='currentColor'>
		<path
			fillRule='evenodd'
			d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
			clipRule='evenodd'
		/>
	</svg>
);

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Solid'];

export const Default: Story = {
	render: () => (
		<div className='w-64'>
			<Select.Root>
				<div className='relative'>
					<Select.Trigger className={triggerCls}>
						<Select.Value placeholder='Select a framework' className='data-[placeholder]:text-[#9ca3af]' />
						<ChevronIcon />
					</Select.Trigger>
					<Select.Content className={contentCls}>
						{frameworks.map((fw) => (
							<Select.Item key={fw} value={fw.toLowerCase()} className={itemCls}>
								{fw}
							</Select.Item>
						))}
					</Select.Content>
				</div>
			</Select.Root>
		</div>
	),
};

export const WithCheckmark: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<div className='w-64'>
				<Select.Root value={value} onChange={setValue}>
					<div className='relative'>
						<Select.Trigger className={triggerCls}>
							<Select.Value placeholder='Select a framework' className='data-[placeholder]:text-[#9ca3af]' />
							<ChevronIcon />
						</Select.Trigger>
						<Select.Content className={contentCls}>
							{frameworks.map((fw) => (
								<Select.Item key={fw} value={fw.toLowerCase()} className={itemCls}>
									<span className='flex-1'>{fw}</span>
									<span className='invisible text-black data-[selected]:visible'>
										<CheckIcon />
									</span>
								</Select.Item>
							))}
						</Select.Content>
					</div>
				</Select.Root>
			</div>
		);
	},
};

export const WithGroups: Story = {
	render: () => (
		<div className='w-64'>
			<Select.Root>
				<div className='relative'>
					<Select.Trigger className={triggerCls}>
						<Select.Value placeholder='Select a timezone' className='data-[placeholder]:text-[#9ca3af]' />
						<ChevronIcon />
					</Select.Trigger>
					<Select.Content className={contentCls}>
						<Select.Group>
							<Select.GroupLabel className='px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]'>
								North America
							</Select.GroupLabel>
							<Select.Item value='est' className={itemCls}>Eastern Time (EST)</Select.Item>
							<Select.Item value='cst' className={itemCls}>Central Time (CST)</Select.Item>
							<Select.Item value='pst' className={itemCls}>Pacific Time (PST)</Select.Item>
						</Select.Group>
						<Select.Separator className='my-1 border-[#d4d4d4]' />
						<Select.Group>
							<Select.GroupLabel className='px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]'>
								Europe
							</Select.GroupLabel>
							<Select.Item value='gmt' className={itemCls}>Greenwich Mean Time (GMT)</Select.Item>
							<Select.Item value='cet' className={itemCls}>Central European Time (CET)</Select.Item>
						</Select.Group>
					</Select.Content>
				</div>
			</Select.Root>
		</div>
	),
};

export const WithDisabledItems: Story = {
	render: () => (
		<div className='w-64'>
			<Select.Root>
				<div className='relative'>
					<Select.Trigger className={triggerCls}>
						<Select.Value placeholder='Select a plan' className='data-[placeholder]:text-[#9ca3af]' />
						<ChevronIcon />
					</Select.Trigger>
					<Select.Content className={contentCls}>
						<Select.Item value='free' className={itemCls}>Free</Select.Item>
						<Select.Item value='pro' className={itemCls}>Pro</Select.Item>
						<Select.Item value='enterprise' disabled className={itemCls}>
							Enterprise <span className='ml-auto text-xs text-[#9ca3af]'>Contact sales</span>
						</Select.Item>
					</Select.Content>
				</div>
			</Select.Root>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className='w-64'>
			<Select.Root defaultValue='react' disabled>
				<div className='relative'>
					<Select.Trigger className={triggerCls}>
						<Select.Value className='data-[placeholder]:text-[#9ca3af]' />
						<ChevronIcon />
					</Select.Trigger>
				</div>
			</Select.Root>
		</div>
	),
};

export const WithLabel: Story = {
	render: () => (
		<div className='flex w-64 flex-col gap-1.5'>
			<label className='text-sm font-medium text-black'>Framework</label>
			<Select.Root>
				<div className='relative'>
					<Select.Trigger className={triggerCls}>
						<Select.Value placeholder='Select a framework' className='data-[placeholder]:text-[#9ca3af]' />
						<ChevronIcon />
					</Select.Trigger>
					<Select.Content className={contentCls}>
						{frameworks.map((fw) => (
							<Select.Item key={fw} value={fw.toLowerCase()} className={itemCls}>
								{fw}
							</Select.Item>
						))}
					</Select.Content>
				</div>
			</Select.Root>
			<p className='text-xs text-[#9ca3af]'>Choose your preferred framework.</p>
		</div>
	),
};
