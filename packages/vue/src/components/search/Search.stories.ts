import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Search } from '.';
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
	'w-full rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1';

const contentCls =
	'absolute left-0 top-full z-10 mt-1 w-full rounded-[20px] border-[3px] border-black bg-white py-1';

const mockItems: SearchOption[] = [
	{ id: 1, title: 'React', subtitle: 'A JavaScript library for building user interfaces' },
	{ id: 2, title: 'Vue', subtitle: 'The progressive JavaScript framework' },
	{ id: 3, title: 'Angular', subtitle: 'Platform for building mobile and desktop apps' },
	{ id: 4, title: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
	{ id: 5, title: 'Next.js', subtitle: 'The React framework for production' },
];

export const Default: Story = {
	render: () => ({
		setup() {
			const query = ref('');
			return () => {
				const filtered = mockItems.filter((item) =>
					item.title.toLowerCase().includes(query.value.toLowerCase()),
				);
				return h(
					Search.Root,
					{
						value: query.value,
						onSearchChange: (v: string) => (query.value = v),
						onSelect: (option: SearchOption) => alert('Selected: ' + option.title),
						class: 'relative w-80',
					},
					() => [
						h(Search.Input, { placeholder: 'Search frameworks...', class: inputCls }),
						h(Search.Content, { class: contentCls }, () =>
							filtered.map((item) =>
								h(
									Search.Item,
									{
										key: item.id,
										option: item,
										class: 'cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]',
									},
									() => [h('div', { class: 'text-sm font-medium text-black' }, item.title)],
								),
							),
						),
					],
				);
			};
		},
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const query = ref('');
			return () => {
				const filtered = mockItems.filter((item) =>
					item.title.toLowerCase().includes(query.value.toLowerCase()),
				);
				return h(
					Search.Root,
					{
						value: query.value,
						onSearchChange: (v: string) => (query.value = v),
						onSelect: (option: SearchOption) => alert('Selected: ' + option.title),
						class: 'relative w-80',
					},
					() => [
						h(Search.Input, { placeholder: 'Search frameworks...', class: inputCls }),
						h(Search.Content, { class: contentCls }, () =>
							filtered.map((item) =>
								h(
									Search.Item,
									{
										key: item.id,
										option: item,
										class: 'cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]',
									},
									() => [
										h('div', { class: 'text-sm font-medium text-black' }, item.title),
										h('div', { class: 'text-xs text-[#6b7280]' }, item.subtitle),
									],
								),
							),
						),
					],
				);
			};
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const query = ref('');
			return () => {
				const filtered = mockItems.filter((item) =>
					item.title.toLowerCase().includes(query.value.toLowerCase()),
				);
				return h(
					Search.Root,
					{
						value: query.value,
						onSearchChange: (v: string) => (query.value = v),
						onSelect: (option: SearchOption) => alert('Selected: ' + option.title),
						class: 'relative w-80',
					},
					() => [
						h(Search.Input, { placeholder: 'Search frameworks...', class: inputCls }),
						h(Search.Content, { class: contentCls }, () => [
							...filtered.map((item) =>
								h(
									Search.Item,
									{
										key: item.id,
										option: item,
										class: 'cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]',
									},
									() => [
										h('div', { class: 'text-sm font-medium text-black' }, item.title),
										h('div', { class: 'text-xs text-[#6b7280]' }, item.subtitle),
									],
								),
							),
							h(
								Search.Empty,
								{ class: 'px-3 py-4 text-center text-sm text-[#6b7280]' },
								() => 'No results found',
							),
						]),
					],
				);
			};
		},
	}),
};
