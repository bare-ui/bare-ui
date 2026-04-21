import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Select } from '.';

const meta = {
	title: 'Forms/Select',
	component: Select.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Custom select dropdown with keyboard navigation and groups.',
			},
		},
	},
} satisfies Meta<typeof Select.Root>;

export default meta;

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Solid'];

const triggerCls =
	'flex w-full items-center justify-between gap-2 rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none transition data-[state=open]:ring-2 data-[state=open]:ring-black data-[state=open]:ring-offset-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[hover]:bg-[#f5f5f5]';

const contentCls =
	'absolute z-50 mt-1 w-full overflow-hidden rounded-[20px] border border-black bg-white py-1';

const itemCls =
	'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-black outline-none transition data-[hover]:bg-[#f5f5f5] data-[selected]:font-medium data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';

const ChevronIcon = () =>
	h(
		'svg',
		{
			class: 'size-4 shrink-0 text-[#6b7280] transition-transform data-[state=open]:rotate-180',
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

const CheckIcon = () =>
	h('svg', { class: 'size-4', viewBox: '0 0 20 20', fill: 'currentColor' }, [
		h('path', {
			'fill-rule': 'evenodd',
			d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
			'clip-rule': 'evenodd',
		}),
	]);

export const Default: StoryObj = {
	render: () => ({
		setup() {
			const value = ref('');
			return () =>
				h('div', { class: 'w-64' }, [
					h(Select.Root, { value: value.value, onChange: (v: string) => (value.value = v) }, () => [
						h('div', { class: 'relative' }, [
							h(Select.Trigger, { class: triggerCls }, () => [
								h(Select.Value, {
									placeholder: 'Select a framework',
									class: 'data-[placeholder]:text-[#6b7280]',
								}),
								ChevronIcon(),
							]),
							h(
								Select.Content,
								{ class: contentCls },
								() =>
									frameworks.map((fw) =>
										h(
											Select.Item,
											{ key: fw, value: fw.toLowerCase(), class: itemCls },
											() => [h('span', { class: 'flex-1' }, fw)],
										),
									),
							),
						]),
					]),
				]);
		},
	}),
};

export const Composed: StoryObj = {
	render: () => ({
		setup() {
			const value = ref('');
			return () =>
				h('div', { class: 'w-64' }, [
					h(Select.Root, { value: value.value, onChange: (v: string) => (value.value = v) }, () => [
						h('div', { class: 'relative' }, [
							h(Select.Trigger, { class: triggerCls }, () => [
								h(Select.Value, {
									placeholder: 'Select a framework',
									class: 'data-[placeholder]:text-[#6b7280]',
								}),
								ChevronIcon(),
							]),
							h(
								Select.Content,
								{ class: contentCls },
								() =>
									frameworks.map((fw) =>
										h(Select.Item, { key: fw, value: fw.toLowerCase(), class: itemCls }, () => [
											h('span', { class: 'flex-1' }, fw),
											h('span', { class: 'invisible text-black data-[selected]:visible' }, [
												CheckIcon(),
											]),
										]),
									),
							),
						]),
					]),
				]);
		},
	}),
};

export const Complex: StoryObj = {
	render: () => ({
		setup() {
			const value = ref('');
			return () =>
				h('div', { class: 'w-64' }, [
					h(Select.Root, { value: value.value, onChange: (v: string) => (value.value = v) }, () => [
						h('div', { class: 'relative' }, [
							h(Select.Trigger, { class: triggerCls }, () => [
								h(Select.Value, {
									placeholder: 'Select a framework',
									class: 'data-[placeholder]:text-[#6b7280]',
								}),
								ChevronIcon(),
							]),
							h(Select.Content, { class: contentCls }, () => [
								h(Select.Group, null, () => [
									h(
										Select.GroupLabel,
										{ class: 'px-3 py-1.5 text-xs font-semibold text-[#6b7280]' },
										() => 'Frontend',
									),
									h(Select.Item, { value: 'react', class: itemCls }, () => [
										h('span', { class: 'flex-1' }, 'React'),
										h('span', { class: 'invisible text-black data-[selected]:visible' }, [
											CheckIcon(),
										]),
									]),
									h(Select.Item, { value: 'vue', class: itemCls }, () => [
										h('span', { class: 'flex-1' }, 'Vue'),
										h('span', { class: 'invisible text-black data-[selected]:visible' }, [
											CheckIcon(),
										]),
									]),
									h(Select.Item, { value: 'angular', class: itemCls }, () => [
										h('span', { class: 'flex-1' }, 'Angular'),
										h('span', { class: 'invisible text-black data-[selected]:visible' }, [
											CheckIcon(),
										]),
									]),
								]),
								h(Select.Separator, { class: 'my-1 h-px bg-black' }),
								h(Select.Group, null, () => [
									h(
										Select.GroupLabel,
										{ class: 'px-3 py-1.5 text-xs font-semibold text-[#6b7280]' },
										() => 'Other',
									),
									h(Select.Item, { value: 'svelte', class: itemCls }, () => [
										h('span', { class: 'flex-1' }, 'Svelte'),
										h('span', { class: 'invisible text-black data-[selected]:visible' }, [
											CheckIcon(),
										]),
									]),
									h(Select.Item, { value: 'solid', disabled: true, class: itemCls }, () => [
										h('span', { class: 'flex-1' }, 'Solid'),
										h('span', { class: 'invisible text-black data-[selected]:visible' }, [
											CheckIcon(),
										]),
									]),
								]),
							]),
						]),
					]),
				]);
		},
	}),
};
