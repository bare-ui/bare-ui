import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Accordion } from '.';

const meta = {
	title: 'Components/Accordion',
	component: Accordion.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Collapsible sections with single or multiple selection types.',
			},
		},
	},
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const faqs = [
	{ value: 'item-1', question: 'What is wire-ui?', answer: 'wire-ui is a headless component library.' },
	{ value: 'item-2', question: 'How is it different?', answer: 'wire-ui uses data-attribute selectors for styling.' },
	{ value: 'item-3', question: 'Does it support animations?', answer: 'Yes — via forceMount and CSS transitions.' },
];

const containerCls = 'w-full max-w-lg divide-y-2 divide-black rounded-[20px] border-[3px] border-black bg-white overflow-hidden';
const triggerCls = 'flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black outline-none transition-colors hover:bg-[#f5f5f5]';
const contentCls = 'px-5 pb-4 text-sm leading-relaxed text-[#9ca3af]';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Accordion.Root, { type: 'single', collapsible: true, defaultValue: 'item-1', class: containerCls }, () =>
				faqs.map((faq) =>
					h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
						h(Accordion.Trigger, { class: triggerCls }, () => faq.question),
						h(Accordion.Content, { class: contentCls }, () => faq.answer),
					]),
				),
			),
	}),
};

export const Multiple: Story = {
	render: () => ({
		setup: () => () =>
			h(Accordion.Root, { type: 'multiple', defaultValue: ['item-1', 'item-3'], class: containerCls }, () =>
				faqs.map((faq) =>
					h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
						h(Accordion.Trigger, { class: triggerCls }, () => faq.question),
						h(Accordion.Content, { class: contentCls }, () => faq.answer),
					]),
				),
			),
	}),
};
