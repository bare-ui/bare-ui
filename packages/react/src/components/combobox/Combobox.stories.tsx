import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from './Combobox';
import type { ComboboxOption } from './Combobox.types';

const meta = {
	title: 'Forms/Combobox',
	component: Combobox.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Filterable autocomplete with full keyboard navigation, ARIA listbox semantics, and a render-prop items API.',
			},
		},
	},
} satisfies Meta<typeof Combobox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const frameworks: ComboboxOption[] = [
	{ value: 'react', label: 'React', subtitle: 'A JS library for UIs' },
	{ value: 'vue', label: 'Vue', subtitle: 'The progressive JS framework' },
	{ value: 'angular', label: 'Angular', subtitle: 'Platform for web apps' },
	{ value: 'svelte', label: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
	{ value: 'solid', label: 'Solid', subtitle: 'Reactive UI library', disabled: true },
	{ value: 'next', label: 'Next.js', subtitle: 'The React framework' },
	{ value: 'nuxt', label: 'Nuxt', subtitle: 'The Vue framework' },
];

const inputCls =
	'w-full rounded-[8px] border border-black bg-white px-3 py-2 pr-10 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1';
const triggerCls =
	'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[#6b7280] [data-state=open]:rotate-180 transition-transform';
const contentCls =
	'absolute left-0 top-full z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-[20px] border border-black bg-white py-1';
const itemCls =
	'cursor-pointer px-3 py-2 text-sm text-black group-data-[highlighted]:bg-[#f5f5f5] group-data-[selected]:font-semibold group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-40';

export const Default: Story = {
	render: () => (
		<Combobox.Root options={frameworks} className='relative w-72'>
			<Combobox.Input placeholder='Search frameworks…' className={inputCls} />
			<Combobox.Trigger className={triggerCls}>▾</Combobox.Trigger>
			<Combobox.Content className={contentCls}>
				<Combobox.Items>
					{({ option }) => (
						<div className={itemCls}>{option.label}</div>
					)}
				</Combobox.Items>
				<Combobox.Empty className='px-3 py-3 text-center text-sm text-[#6b7280]'>
					No frameworks match
				</Combobox.Empty>
			</Combobox.Content>
		</Combobox.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const [value, setValue] = useState<string | null>('react');
		return (
			<div className='flex flex-col gap-2'>
				<Combobox.Root options={frameworks} value={value} onChange={setValue} className='relative w-72'>
					<Combobox.Input placeholder='Pick a framework…' className={inputCls} />
					<Combobox.Trigger className={triggerCls}>▾</Combobox.Trigger>
					<Combobox.Content className={contentCls}>
						<Combobox.Items>
							{({ option, selected }) => (
								<div className={itemCls}>
									<div className='flex items-center justify-between'>
										<span>{option.label}</span>
										{selected && <span className='text-black'>✓</span>}
									</div>
									{option.subtitle && (
										<p className='text-xs text-[#6b7280]'>{option.subtitle}</p>
									)}
								</div>
							)}
						</Combobox.Items>
						<Combobox.Empty className='px-3 py-3 text-center text-sm text-[#6b7280]'>
							No frameworks match
						</Combobox.Empty>
					</Combobox.Content>
				</Combobox.Root>
				<p className='text-xs text-[#6b7280]'>
					Selected: <span className='font-medium text-black'>{value ?? '∅'}</span>
				</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		// Custom filter: match label or subtitle, fuzzy
		const filter = (option: ComboboxOption, input: string) => {
			const q = input.toLowerCase();
			return (
				option.label.toLowerCase().includes(q) ||
				(option.subtitle ?? '').toLowerCase().includes(q)
			);
		};
		return (
			<div className='w-80'>
				<label className='mb-1 block text-sm font-medium text-black'>Framework</label>
				<Combobox.Root options={frameworks} filter={filter} className='relative'>
					<Combobox.Input placeholder='Type to search by name or description…' className={inputCls} />
					<Combobox.Trigger className={triggerCls}>▾</Combobox.Trigger>
					<Combobox.Content className={contentCls}>
						<Combobox.Items>
							{({ option, highlighted, selected }) => (
								<div className={itemCls}>
									<div className='flex items-center justify-between'>
										<span className={selected ? 'font-semibold' : ''}>{option.label}</span>
										{highlighted && <span className='text-xs text-[#6b7280]'>↵</span>}
									</div>
									{option.subtitle && (
										<p className='text-xs text-[#6b7280]'>{option.subtitle}</p>
									)}
								</div>
							)}
						</Combobox.Items>
						<Combobox.Empty className='px-3 py-3 text-center text-sm text-[#6b7280]'>
							Nothing found
						</Combobox.Empty>
					</Combobox.Content>
				</Combobox.Root>
				<p className='mt-2 text-xs text-[#6b7280]'>↑/↓ to navigate · ↵ to select · Esc to close</p>
			</div>
		);
	},
};
