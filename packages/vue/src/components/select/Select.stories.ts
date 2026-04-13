import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Select } from '.';

const meta = {
	title: 'Components/Select',
	component: Select.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A headless select dropdown with keyboard navigation and accessibility.',
			},
		},
	},
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const rootCls = 'relative w-64';
const triggerCls =
	'flex w-full items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm font-medium outline-none transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-200';
const contentCls =
	'absolute z-10 mt-1 w-full rounded-xl border-2 border-black bg-white py-1 shadow-lg';
const itemCls =
	'cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-gray-100 data-[selected]:bg-blue-50 data-[selected]:font-semibold';

const fruits = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry' },
	{ value: 'grape', label: 'Grape' },
	{ value: 'mango', label: 'Mango' },
];

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Select.Root, { class: rootCls }, () => [
				h(Select.Trigger, { class: triggerCls }, () => [
					h(Select.Value, { placeholder: 'Choose a fruit' }),
					h('span', { 'aria-hidden': 'true' }, '\u25BE'),
				]),
				h(Select.Content, { class: contentCls }, () =>
					fruits.map((fruit) =>
						h(
							Select.Item,
							{ key: fruit.value, value: fruit.value, textValue: fruit.label, class: itemCls },
							() => fruit.label,
						),
					),
				),
			]),
	}),
};
