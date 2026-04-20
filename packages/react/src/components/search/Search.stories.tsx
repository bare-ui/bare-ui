import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Search } from './Search';
import type { SearchOption } from './Search.types';

const meta = {
	title: 'Overlays/Search',
	component: Search.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Search input with filterable results and keyboard navigation.',
			},
		},
	},
} satisfies Meta<typeof Search.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const inputCls =
	'w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1';

const contentCls =
	'absolute left-0 top-full z-10 mt-1 w-full rounded-[20px] border border-black bg-white py-1';

const mockItems: SearchOption[] = [
	{ id: 1, title: 'React', subtitle: 'A JavaScript library for building user interfaces' },
	{ id: 2, title: 'Vue', subtitle: 'The progressive JavaScript framework' },
	{ id: 3, title: 'Angular', subtitle: 'Platform for building mobile and desktop apps' },
	{ id: 4, title: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
	{ id: 5, title: 'Next.js', subtitle: 'The React framework for production' },
];

export const Default: Story = {
	render: () => {
		const [query, setQuery] = useState('');
		const filtered = mockItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

		return (
			<Search.Root
				value={query}
				onSearchChange={setQuery}
				onSelect={(option) => alert('Selected: ' + option.title)}
				className='relative w-80'>
				<Search.Input placeholder='Search frameworks...' className={inputCls} />
				<Search.Content className={contentCls}>
					{filtered.map((item) => (
						<Search.Item
							key={item.id}
							option={item}
							className='cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]'>
							<div className='text-sm font-medium text-black'>{item.title}</div>
						</Search.Item>
					))}
				</Search.Content>
			</Search.Root>
		);
	},
};

export const Composed: Story = {
	render: () => {
		const [query, setQuery] = useState('');
		const filtered = mockItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

		return (
			<Search.Root
				value={query}
				onSearchChange={setQuery}
				onSelect={(option) => alert('Selected: ' + option.title)}
				className='relative w-80'>
				<Search.Input placeholder='Search frameworks...' className={inputCls} />
				<Search.Content className={contentCls}>
					{filtered.map((item) => (
						<Search.Item
							key={item.id}
							option={item}
							className='cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]'>
							<div className='text-sm font-medium text-black'>{item.title}</div>
							<div className='text-xs text-[#6b7280]'>{item.subtitle}</div>
						</Search.Item>
					))}
				</Search.Content>
			</Search.Root>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [query, setQuery] = useState('');
		const filtered = mockItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

		return (
			<Search.Root
				value={query}
				onSearchChange={setQuery}
				onSelect={(option) => alert('Selected: ' + option.title)}
				className='relative w-80'>
				<Search.Input placeholder='Search frameworks...' className={inputCls} />
				<Search.Content className={contentCls}>
					{filtered.map((item) => (
						<Search.Item
							key={item.id}
							option={item}
							className='cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]'>
							<div className='text-sm font-medium text-black'>{item.title}</div>
							<div className='text-xs text-[#6b7280]'>{item.subtitle}</div>
						</Search.Item>
					))}
					<Search.Empty className='px-3 py-4 text-center text-sm text-[#6b7280]'>No results found</Search.Empty>
				</Search.Content>
			</Search.Root>
		);
	},
};
