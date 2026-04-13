import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Search } from '.';
import type { SearchOption } from './Search.types';

const meta = {
	title: 'Components/Search',
	component: Search.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless search input with dropdown results, keyboard navigation, and typing delay.',
			},
		},
	},
} satisfies Meta<typeof Search.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const rootCls = 'relative w-80';
const inputCls =
	'w-full rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-200';
const contentCls =
	'absolute z-10 mt-1 w-full rounded-xl border-2 border-black bg-white py-1 shadow-lg';
const itemCls =
	'cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-gray-100 data-[highlighted]:bg-blue-50';
const emptyCls = 'px-4 py-3 text-sm text-gray-400';

const allOptions: SearchOption[] = [
	{ id: 1, title: 'React', subtitle: 'A JavaScript library for building user interfaces' },
	{ id: 2, title: 'Vue', subtitle: 'The Progressive JavaScript Framework' },
	{ id: 3, title: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
	{ id: 4, title: 'Angular', subtitle: 'The modern web developer\'s platform' },
	{ id: 5, title: 'Solid', subtitle: 'Simple and performant reactivity' },
];

export const Default: Story = {
	render: () => ({
		setup() {
			const results = ref<SearchOption[]>(allOptions);
			const loading = ref(false);
			const searchValue = ref('');

			const handleSearchChange = (value: string) => {
				searchValue.value = value;
				loading.value = true;
				results.value = allOptions.filter((opt) =>
					opt.title.toLowerCase().includes(value.toLowerCase()),
				);
				loading.value = false;
			};

			const handleSelect = (option: SearchOption) => {
				searchValue.value = '';
			};

			return () =>
				h(
					Search.Root,
					{
						class: rootCls,
						value: searchValue.value,
						onSearchChange: handleSearchChange,
						onSelect: handleSelect,
						loading: loading.value,
						searchDelay: 300,
					},
					() => [
						h(Search.Input, { class: inputCls, placeholder: 'Search frameworks...' }),
						h(Search.Content, { class: contentCls }, () => [
							...results.value.map((opt) =>
								h(Search.Item, { key: opt.id, option: opt, class: itemCls }, () => [
									h('div', { class: 'font-medium' }, opt.title),
									opt.subtitle ? h('div', { class: 'text-xs text-gray-400' }, opt.subtitle) : null,
								]),
							),
							h(Search.Empty, { class: emptyCls }, () => 'No frameworks found'),
						]),
					],
				);
		},
	}),
};
