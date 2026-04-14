import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Rating } from '.';

const meta = {
	title: 'Feedback/Rating',
	component: Rating,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Interactive star rating with read-only and disabled states.',
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
		setup: () => () => h(Rating, { defaultValue: 3, class: 'flex gap-0.5', starClassName: starCls }),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const value = ref(0);
			const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];

			return () =>
				h('div', { class: 'flex flex-col items-start gap-2' }, [
					h(Rating, {
						value: value.value,
						onChange: (v: number) => {
							value.value = v;
						},
						class: 'flex gap-0.5',
						starClassName: starCls,
					}),
					h(
						'p',
						{ class: 'text-sm text-[#6b7280]' },
						value.value > 0
							? [h('span', { class: 'font-medium text-black' }, labels[value.value])]
							: 'Select a rating',
					),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-6 items-center' }, [
				h('div', { class: 'flex items-center gap-2' }, [
					h(Rating, {
						value: 4,
						readOnly: true,
						class: 'flex gap-0.5',
						starClassName: 'size-4 cursor-default text-[#e5e5e5] data-[filled]:text-black',
					}),
					h('span', { class: 'text-sm font-medium text-black' }, '4.0'),
					h('span', { class: 'text-sm text-[#6b7280]' }, '(128 reviews)'),
				]),
				h('div', { class: 'flex flex-col gap-4' }, [
					h('div', { class: 'flex items-center gap-3' }, [
						h('span', { class: 'w-12 text-xs text-[#6b7280]' }, 'Small'),
						h(Rating, {
							defaultValue: 3,
							class: 'flex gap-0.5',
							starClassName:
								'size-4 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black',
						}),
					]),
					h('div', { class: 'flex items-center gap-3' }, [
						h('span', { class: 'w-12 text-xs text-[#6b7280]' }, 'Medium'),
						h(Rating, { defaultValue: 3, class: 'flex gap-0.5', starClassName: starCls }),
					]),
					h('div', { class: 'flex items-center gap-3' }, [
						h('span', { class: 'w-12 text-xs text-[#6b7280]' }, 'Large'),
						h(Rating, {
							defaultValue: 3,
							class: 'flex gap-0.5',
							starClassName:
								'size-9 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black',
						}),
					]),
				]),
			]),
	}),
};
