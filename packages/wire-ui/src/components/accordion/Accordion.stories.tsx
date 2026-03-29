import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta = {
	title: 'Components/Accordion',
	component: Accordion.Root,
	tags: ['autodocs'],
	args: { type: 'single' as const },
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
		answer: 'wire-ui is a headless React 19 component library. It ships zero styles — you bring your own via className and data-attribute selectors.',
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

// ---------------------------------------------------------------------------
// Default — single, collapsible, bordered
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: () => (
		<Accordion.Root
			type='single'
			collapsible
			defaultValue='item-1'
			className='w-full max-w-lg divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white'>
			{faqs.map((faq) => (
				<Accordion.Item
					key={faq.value}
					value={faq.value}>
					<Accordion.Trigger className='flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 outline-none transition-colors hover:bg-gray-50 data-[state=open]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'>
						{faq.question}
						<svg
							className='size-4 shrink-0 text-gray-400 transition-transform duration-200 data-[state=open]:rotate-180'
							data-state='inherit'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</Accordion.Trigger>
					<Accordion.Content className='px-5 pb-4 text-sm leading-relaxed text-gray-600'>
						{faq.answer}
					</Accordion.Content>
				</Accordion.Item>
			))}
		</Accordion.Root>
	),
};

// ---------------------------------------------------------------------------
// Multiple — all can be open simultaneously
// ---------------------------------------------------------------------------

export const Multiple: Story = {
	render: () => (
		<Accordion.Root
			type='multiple'
			defaultValue={['item-1', 'item-3']}
			className='w-full max-w-lg divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white'>
			{faqs.map((faq) => (
				<Accordion.Item
					key={faq.value}
					value={faq.value}>
					<Accordion.Trigger className='flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 outline-none transition-colors hover:bg-gray-50 data-[state=open]:text-blue-600'>
						{faq.question}
						<svg
							className='size-4 shrink-0 text-gray-400 transition-transform duration-200 data-[state=open]:rotate-180'
							data-state='inherit'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</Accordion.Trigger>
					<Accordion.Content className='px-5 pb-4 text-sm leading-relaxed text-gray-600'>
						{faq.answer}
					</Accordion.Content>
				</Accordion.Item>
			))}
		</Accordion.Root>
	),
};

// ---------------------------------------------------------------------------
// Animated — smooth height transition via CSS grid trick + forceMount
// ---------------------------------------------------------------------------

export const Animated: Story = {
	render: () => (
		<Accordion.Root
			type='single'
			collapsible
			className='w-full max-w-lg divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white'>
			{faqs.map((faq) => (
				<Accordion.Item
					key={faq.value}
					value={faq.value}>
					<Accordion.Trigger className='flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 outline-none transition-colors hover:bg-gray-50 data-[state=open]:text-blue-600'>
						{faq.question}
						<svg
							className='size-4 shrink-0 text-gray-400 transition-transform duration-300 data-[state=open]:rotate-180'
							data-state='inherit'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</Accordion.Trigger>
					{/* forceMount keeps DOM mounted — CSS grid trick animates height */}
					<Accordion.Content
						forceMount
						className='grid transition-all duration-300 ease-in-out data-[state=open]:grid-rows-[1fr] data-[state=closed]:grid-rows-[0fr]'>
						<div className='overflow-hidden'>
							<p className='px-5 pb-4 text-sm leading-relaxed text-gray-600'>{faq.answer}</p>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			))}
		</Accordion.Root>
	),
};

// ---------------------------------------------------------------------------
// Flush — no outer border, full-width separators
// ---------------------------------------------------------------------------

export const Flush: Story = {
	render: () => (
		<Accordion.Root
			type='single'
			collapsible
			className='w-full max-w-lg divide-y divide-gray-200'>
			{faqs.map((faq) => (
				<Accordion.Item
					key={faq.value}
					value={faq.value}>
					<Accordion.Trigger className='flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 outline-none transition-colors hover:text-blue-600 data-[state=open]:text-blue-600'>
						{faq.question}
						<svg
							className='size-4 shrink-0 text-gray-400 transition-transform duration-200 data-[state=open]:rotate-180'
							data-state='inherit'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</Accordion.Trigger>
					<Accordion.Content className='pb-4 text-sm leading-relaxed text-gray-500'>
						{faq.answer}
					</Accordion.Content>
				</Accordion.Item>
			))}
		</Accordion.Root>
	),
};

// ---------------------------------------------------------------------------
// Disabled — one item disabled, whole group disabled
// ---------------------------------------------------------------------------

export const Disabled: Story = {
	render: () => (
		<div className='flex w-full max-w-lg flex-col gap-6'>
			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-400'>Single item disabled</p>
				<Accordion.Root
					type='single'
					collapsible
					className='divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white'>
					{faqs.slice(0, 3).map((faq, i) => (
						<Accordion.Item
							key={faq.value}
							value={faq.value}
							disabled={i === 1}>
							<Accordion.Trigger className='flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 outline-none hover:bg-gray-50 data-[state=open]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'>
								{faq.question}
							</Accordion.Trigger>
							<Accordion.Content className='px-5 pb-4 text-sm text-gray-600'>
								{faq.answer}
							</Accordion.Content>
						</Accordion.Item>
					))}
				</Accordion.Root>
			</div>

			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-400'>All disabled</p>
				<Accordion.Root
					type='single'
					disabled
					className='divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white opacity-60'>
					{faqs.slice(0, 3).map((faq) => (
						<Accordion.Item
							key={faq.value}
							value={faq.value}>
							<Accordion.Trigger className='flex w-full cursor-not-allowed items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 outline-none'>
								{faq.question}
							</Accordion.Trigger>
						</Accordion.Item>
					))}
				</Accordion.Root>
			</div>
		</div>
	),
};
