import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Combobox } from '.';
import type { ComboboxOption } from './Combobox.types';

const meta = {
	title: 'Forms/Combobox',
	component: Combobox.Root,
	subcomponents: {
		'Combobox.Input': Combobox.Input,
		'Combobox.Trigger': Combobox.Trigger,
		'Combobox.Content': Combobox.Content,
		'Combobox.Items': Combobox.Items,
		'Combobox.Empty': Combobox.Empty,
	},
	tags: ['autodocs'],
	args: { options: [] },
	parameters: {
		docs: {
			description: {
				component:
					'Filterable autocomplete with full keyboard navigation, ARIA listbox semantics, and a render-prop items API.',
			},
		},
	},
} satisfies Meta<typeof Combobox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const frameworks: ComboboxOption[] = [
	{ value: 'react', label: 'React', subtitle: 'A JS library for UIs' },
	{ value: 'vue', label: 'Vue', subtitle: 'The progressive JS framework' },
	{ value: 'angular', label: 'Angular', subtitle: 'Platform for web apps' },
	{ value: 'svelte', label: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
	{ value: 'solid', label: 'Solid', subtitle: 'Reactive UI library', disabled: true },
	{ value: 'next', label: 'Next.js', subtitle: 'The React framework' },
	{ value: 'nuxt', label: 'Nuxt', subtitle: 'The Vue framework' },
];

const inputCls =
	'w-full rounded-[8px] border border-black bg-white px-3 py-2 pr-10 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1';
const triggerCls =
	'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[#6b7280] [data-state=open]:rotate-180 transition-transform';
const contentCls =
	'absolute left-0 top-full z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-[20px] border border-black bg-white py-1';
const itemCls =
	'cursor-pointer px-3 py-2 text-sm text-black group-data-[highlighted]:bg-[#f5f5f5] group-data-[selected]:font-semibold group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-40';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Combobox.Root, { options: frameworks, class: 'relative w-72' }, () => [
				h(Combobox.Input, { placeholder: 'Search frameworks…', class: inputCls }),
				h(Combobox.Trigger, { class: triggerCls }, () => '▾'),
				h(Combobox.Content, { class: contentCls }, () => [
					h(
						Combobox.Items,
						{},
						{
							default: ({ option }: { option: ComboboxOption }) =>
								h('div', { class: itemCls }, option.label),
						},
					),
					h(
						Combobox.Empty,
						{ class: 'px-3 py-3 text-center text-sm text-[#6b7280]' },
						() => 'No frameworks match',
					),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const value = ref<string | null>('react');
			return () =>
				h('div', { class: 'flex flex-col gap-2' }, [
					h(
						Combobox.Root,
						{
							options: frameworks,
							value: value.value,
							onChange: (v: string | null) => (value.value = v),
							class: 'relative w-72',
						},
						() => [
							h(Combobox.Input, { placeholder: 'Pick a framework…', class: inputCls }),
							h(Combobox.Trigger, { class: triggerCls }, () => '▾'),
							h(Combobox.Content, { class: contentCls }, () => [
								h(
									Combobox.Items,
									{},
									{
										default: ({
											option,
											selected,
										}: {
											option: ComboboxOption;
											selected: boolean;
										}) =>
											h('div', { class: itemCls }, [
												h('div', { class: 'flex items-center justify-between' }, [
													h('span', {}, option.label),
													selected ? h('span', { class: 'text-black' }, '✓') : null,
												]),
												option.subtitle ?
													h('p', { class: 'text-xs text-[#6b7280]' }, option.subtitle)
												:	null,
											]),
									},
								),
								h(
									Combobox.Empty,
									{ class: 'px-3 py-3 text-center text-sm text-[#6b7280]' },
									() => 'No frameworks match',
								),
							]),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, [
						'Selected: ',
						h('span', { class: 'font-medium text-black' }, value.value ?? '∅'),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () => {
			const filter = (option: ComboboxOption, input: string) => {
				const q = input.toLowerCase();
				return option.label.toLowerCase().includes(q) || (option.subtitle ?? '').toLowerCase().includes(q);
			};
			return h('div', { class: 'w-80' }, [
				h('label', { class: 'mb-1 block text-sm font-medium text-black' }, 'Framework'),
				h(Combobox.Root, { options: frameworks, filter, class: 'relative' }, () => [
					h(Combobox.Input, {
						placeholder: 'Type to search by name or description…',
						class: inputCls,
					}),
					h(Combobox.Trigger, { class: triggerCls }, () => '▾'),
					h(Combobox.Content, { class: contentCls }, () => [
						h(
							Combobox.Items,
							{},
							{
								default: ({
									option,
									highlighted,
									selected,
								}: {
									option: ComboboxOption;
									highlighted: boolean;
									selected: boolean;
								}) =>
									h('div', { class: itemCls }, [
										h('div', { class: 'flex items-center justify-between' }, [
											h('span', { class: selected ? 'font-semibold' : '' }, option.label),
											highlighted ? h('span', { class: 'text-xs text-[#6b7280]' }, '↵') : null,
										]),
										option.subtitle ?
											h('p', { class: 'text-xs text-[#6b7280]' }, option.subtitle)
										:	null,
									]),
							},
						),
						h(
							Combobox.Empty,
							{ class: 'px-3 py-3 text-center text-sm text-[#6b7280]' },
							() => 'Nothing found',
						),
					]),
				]),
				h('p', { class: 'mt-2 text-xs text-[#6b7280]' }, '↑/↓ to navigate · ↵ to select · Esc to close'),
			]);
		},
	}),
};
