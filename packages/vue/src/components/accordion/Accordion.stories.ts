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

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const faqs = [
	{
		value: 'item-1',
		question: 'What is wire-ui?',
		answer: 'wire-ui is a headless Vue 3 component library. It ships zero styles — you bring your own via class and data-attribute selectors.',
	},
	{
		value: 'item-2',
		question: 'How is it different from Headless UI?',
		answer: 'wire-ui uses the asChild pattern instead of the as prop, exports useInteractiveState publicly, and uses data-focus-visible (keyboard only) instead of data-focus.',
	},
	{
		value: 'item-3',
		question: 'Does it support animations?',
		answer: 'Yes — pass forceMount to Accordion.Content and use CSS transitions on data-state. The grid-template-rows trick gives smooth height animations with pure Tailwind.',
	},
	{
		value: 'item-4',
		question: 'Can multiple items be open at once?',
		answer: 'Yes — use type="multiple" on Accordion.Root. With type="single" only one item is open at a time.',
	},
];

const containerCls =
	'w-full max-w-lg divide-y-2 divide-black rounded-[20px] border-[3px] border-black bg-white overflow-hidden';

const triggerCls =
	'flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black outline-none transition-colors hover:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50';

const chevronCls = 'size-4 shrink-0 text-black transition-transform duration-200 data-[state=open]:rotate-180';

const contentCls = 'px-5 pb-4 text-sm leading-relaxed text-[#9ca3af]';

const ChevronDown = () =>
	h(
		'svg',
		{
			class: chevronCls,
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

// ---------------------------------------------------------------------------
// Default — single, collapsible, bordered
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Accordion.Root, { type: 'single', collapsible: true, defaultValue: 'item-1', class: containerCls }, () =>
				faqs.map((faq) =>
					h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
						h(Accordion.Trigger, { class: triggerCls }, () => [faq.question, ChevronDown()]),
						h(Accordion.Content, { class: contentCls }, () => faq.answer),
					]),
				),
			),
	}),
};

// ---------------------------------------------------------------------------
// Multiple — all can be open simultaneously
// ---------------------------------------------------------------------------

export const Multiple: Story = {
	render: () => ({
		setup: () => () =>
			h(Accordion.Root, { type: 'multiple', defaultValue: ['item-1', 'item-3'], class: containerCls }, () =>
				faqs.map((faq) =>
					h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
						h(Accordion.Trigger, { class: triggerCls }, () => [faq.question, ChevronDown()]),
						h(Accordion.Content, { class: contentCls }, () => faq.answer),
					]),
				),
			),
	}),
};

// ---------------------------------------------------------------------------
// Animated — smooth height transition via CSS grid trick + forceMount
// ---------------------------------------------------------------------------

export const Animated: Story = {
	render: () => ({
		setup: () => () =>
			h(Accordion.Root, { type: 'single', collapsible: true, class: containerCls }, () =>
				faqs.map((faq) =>
					h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
						h(Accordion.Trigger, { class: triggerCls }, () => [faq.question, ChevronDown()]),
						h(
							Accordion.Content,
							{
								forceMount: true,
								class: 'grid transition-all duration-300 ease-in-out data-[state=open]:grid-rows-[1fr] data-[state=closed]:grid-rows-[0fr]',
							},
							() =>
								h('div', { class: 'overflow-hidden' }, [
									h('p', { class: 'px-5 pb-4 text-sm leading-relaxed text-[#9ca3af]' }, faq.answer),
								]),
						),
					]),
				),
			),
	}),
};

// ---------------------------------------------------------------------------
// Flush — no outer border, full-width separators
// ---------------------------------------------------------------------------

export const Flush: Story = {
	render: () => ({
		setup: () => () =>
			h(Accordion.Root, { type: 'single', collapsible: true, class: 'w-full max-w-lg divide-y-2 divide-black' }, () =>
				faqs.map((faq) =>
					h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
						h(
							Accordion.Trigger,
							{
								class: 'flex w-full items-center justify-between py-4 text-left text-sm font-medium text-black outline-none transition-colors hover:text-black data-[state=open]:text-black',
							},
							() => [faq.question, ChevronDown()],
						),
						h(
							Accordion.Content,
							{ class: 'pb-4 text-sm leading-relaxed text-[#9ca3af]' },
							() => faq.answer,
						),
					]),
				),
			),
	}),
};

// ---------------------------------------------------------------------------
// Disabled — one item disabled, whole group disabled
// ---------------------------------------------------------------------------

export const Disabled: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex w-full max-w-lg flex-col gap-6' }, [
				h('div', {}, [
					h('p', { class: 'mb-2 text-xs font-medium uppercase tracking-wide text-[#9ca3af]' }, 'Single item disabled'),
					h(Accordion.Root, { type: 'single', collapsible: true, class: containerCls }, () =>
						faqs.slice(0, 3).map((faq, i) =>
							h(Accordion.Item, { key: faq.value, value: faq.value, disabled: i === 1 }, () => [
								h(
									Accordion.Trigger,
									{
										class: 'flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black outline-none hover:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
									},
									() => faq.question,
								),
								h(Accordion.Content, { class: 'px-5 pb-4 text-sm text-[#9ca3af]' }, () => faq.answer),
							]),
						),
					),
				]),
				h('div', {}, [
					h('p', { class: 'mb-2 text-xs font-medium uppercase tracking-wide text-[#9ca3af]' }, 'All disabled'),
					h(
						Accordion.Root,
						{ type: 'single', disabled: true, class: [containerCls, 'opacity-60'].join(' ') },
						() =>
							faqs.slice(0, 3).map((faq) =>
								h(Accordion.Item, { key: faq.value, value: faq.value }, () => [
									h(
										Accordion.Trigger,
										{
											class: 'flex w-full cursor-not-allowed items-center justify-between px-5 py-4 text-left text-sm font-medium text-black outline-none',
										},
										() => faq.question,
									),
								]),
							),
					),
				]),
			]),
	}),
};
