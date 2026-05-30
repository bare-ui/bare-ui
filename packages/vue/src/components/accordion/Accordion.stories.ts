import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Accordion } from '.';

const meta = {
	title: 'Layout/Accordion',
	component: Accordion.Root,
	subcomponents: {
		'Accordion.Item': Accordion.Item,
		'Accordion.Trigger': Accordion.Trigger,
		'Accordion.Content': Accordion.Content,
	},
	tags: ['autodocs'],
	args: { type: 'single' as const },
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
	{
		value: 'item-1',
		question: 'What is wire-ui?',
		answer: 'A headless component library. Zero styles shipped \u2014 you bring your own via className and data-attribute selectors.',
	},
	{
		value: 'item-2',
		question: 'How is it different from Headless UI?',
		answer: 'wire-ui uses the asChild pattern, exports useInteractiveState publicly, and uses data-focus-visible (keyboard only) instead of data-focus.',
	},
	{
		value: 'item-3',
		question: 'Does it support animations?',
		answer: 'Yes \u2014 pass forceMount to Accordion.Content and use CSS transitions on data-state. The grid-template-rows trick gives smooth height animations.',
	},
];

const multipleFaqs = [
	...faqs,
	{
		value: 'item-4',
		question: 'Can multiple items be open at once?',
		answer: 'Yes \u2014 use type="multiple" on Accordion.Root. With type="single" only one item is open at a time.',
	},
];

const richFaqs = [
	{
		value: 'item-1',
		icon: '\u{1F4E6}',
		question: 'Getting Started',
		description: 'Learn the basics of wire-ui',
		answer: 'Install the package, import your first component, and style it with Tailwind classes and data-attribute selectors.',
	},
	{
		value: 'item-2',
		icon: '\u{1F3A8}',
		question: 'Theming',
		description: 'Customize the look and feel',
		answer: 'wire-ui is headless \u2014 you own all the styles. Use CSS variables, Tailwind, or any styling solution you prefer.',
	},
	{
		value: 'item-3',
		icon: '\u26A1',
		question: 'Performance',
		description: 'Optimized for speed',
		answer: 'Tree-shakeable exports, zero runtime CSS, and minimal re-renders. Only ship what you use.',
	},
];

const containerCls =
	'w-full max-w-lg divide-y divide-black rounded-[20px] border border-black bg-white overflow-hidden';

const triggerCls =
	'flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black outline-none transition-colors hover:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50';

const ChevronDown = () =>
	h(
		'svg',
		{
			class: 'size-4 shrink-0 text-black transition-transform duration-200 data-[state=open]:rotate-180',
			'data-state': 'inherit',
			viewBox: '0 0 20 20',
			fill: 'currentColor',
		},
		[
			h('path', {
				'fill-rule': 'evenodd',
				d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
				'clip-rule': 'evenodd',
			}),
		],
	);

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Accordion.Root,
				{ type: 'single', collapsible: true, defaultValue: 'item-1', class: containerCls },
				() =>
					faqs.map((faq) =>
						h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
							h(Accordion.Trigger, { class: triggerCls }, () => [faq.question, h(ChevronDown)]),
							h(
								Accordion.Content,
								{ class: 'px-5 pb-4 text-sm leading-relaxed text-[#6b7280]' },
								() => faq.answer,
							),
						]),
					),
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', {}, [
				h(
					'style',
					{},
					'[data-state=closed] > .accordion-body { grid-template-rows: 0fr; } [data-state=open] > .accordion-body { grid-template-rows: 1fr; } .accordion-body { display: grid; transition: grid-template-rows 200ms; } .accordion-body > div { overflow: hidden; }',
				),
				h(
					Accordion.Root,
					{ type: 'multiple', defaultValue: ['item-1', 'item-2'], class: containerCls },
					() =>
						multipleFaqs.map((faq) =>
							h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
								h(Accordion.Trigger, { class: triggerCls }, () => [faq.question, h(ChevronDown)]),
								h(
									Accordion.Content,
									{
										forceMount: true,
										class: 'px-5 pb-4 text-sm leading-relaxed text-[#6b7280]',
									},
									() => [h('div', { class: 'accordion-body' }, [h('div', {}, faq.answer)])],
								),
							]),
						),
				),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Accordion.Root,
				{ type: 'single', collapsible: true, defaultValue: 'item-1', class: containerCls },
				() =>
					richFaqs.map((faq) =>
						h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
							h(
								Accordion.Trigger,
								{
									class: 'flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium text-black outline-none transition-colors hover:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
								},
								() => [
									h('span', { class: 'text-xl' }, faq.icon),
									h('div', { class: 'flex-1' }, [
										h('p', { class: 'text-sm font-medium text-black' }, faq.question),
										h('p', { class: 'text-xs text-[#6b7280] font-normal' }, faq.description),
									]),
									h(ChevronDown),
								],
							),
							h(
								Accordion.Content,
								{ class: 'px-5 pb-4 text-sm leading-relaxed text-[#6b7280]' },
								() => [
									h('p', { class: 'mb-2' }, faq.answer),
									h(
										'button',
										{ class: 'text-xs font-medium text-black hover:underline' },
										'Learn more \u2192',
									),
								],
							),
						]),
					),
			),
	}),
};
