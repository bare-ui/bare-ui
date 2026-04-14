import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Rating } from '.';

const meta = {
	title: 'Components/Rating',
	component: Rating,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Star rating with hover preview, read-only, and disabled modes.',
			},
		},
	},
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

const starCls =
	'size-6 cursor-pointer text-[#e5e5e5] outline-none transition-colors data-[highlighted]:text-black data-[filled]:text-black hover:scale-110 data-[disabled]:cursor-default data-[disabled]:opacity-50';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Rating, {
				defaultValue: 3,
				onChange: (v: number) => console.log('rating:', v),
				class: 'flex gap-0.5',
				starClassName: starCls,
			}),
	}),
};

export const ReadOnly: Story = {
	render: () => ({
		setup: () => () =>
			h(Rating, {
				value: 4,
				readOnly: true,
				class: 'flex gap-0.5',
				starClassName: 'size-6 cursor-default text-[#e5e5e5] data-[filled]:text-black',
			}),
	}),
};

export const Disabled: Story = {
	render: () => ({
		setup: () => () =>
			h(Rating, {
				defaultValue: 2,
				disabled: true,
				class: 'flex gap-0.5',
				starClassName: 'size-6 cursor-default text-[#e5e5e5] data-[filled]:text-black data-[disabled]:opacity-40',
			}),
	}),
};
