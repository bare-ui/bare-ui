import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Toggle, ToggleGroup } from '.';

const meta = {
	title: 'Forms/Toggle',
	component: Toggle,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A two-state pressable button (`aria-pressed`, `data-state="on"|"off"`). Use it standalone, or drop several inside `ToggleGroup.Root` (single or multiple selection) for a segmented control / formatting pill bar. Distinct from `Switch`, which is a settings on/off control.',
			},
		},
	},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const toggleCls =
	'flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm text-[#374151] hover:bg-[#f3f4f6] data-[state=on]:bg-black data-[state=on]:text-white data-[disabled]:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-black';

export const Standalone: Story = {
	render: () => ({
		setup: () => () =>
			h(Toggle, { class: toggleCls, 'aria-label': 'Toggle italic' }, () => h('i', null, 'I')),
	}),
};

const groupCls = 'inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1';

export const SingleSelect: Story = {
	render: () => ({
		setup() {
			const value = ref<string | null>('center');
			return () =>
				h('div', { class: 'space-y-2' }, [
					h(
						ToggleGroup.Root,
						{
							type: 'single',
							value: value.value,
							onChange: (v: string | null) => { value.value = v; },
							class: groupCls,
							'aria-label': 'Text alignment',
						},
						() => [
							h(Toggle, { value: 'left', class: toggleCls, 'aria-label': 'Align left' }, () => '⬅'),
							h(Toggle, { value: 'center', class: toggleCls, 'aria-label': 'Align center' }, () => '↔'),
							h(Toggle, { value: 'right', class: toggleCls, 'aria-label': 'Align right' }, () => '➡'),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, `Selected: ${value.value ?? 'none'}`),
				]);
		},
	}),
};

export const MultiSelect: Story = {
	render: () => ({
		setup() {
			const value = ref<string[]>(['bold']);
			return () =>
				h('div', { class: 'space-y-2' }, [
					h(
						ToggleGroup.Root,
						{
							type: 'multiple',
							value: value.value,
							onChange: (v: string[]) => { value.value = v; },
							class: groupCls,
							'aria-label': 'Text formatting',
						},
						() => [
							h(Toggle, { value: 'bold', class: toggleCls, 'aria-label': 'Bold' }, () => h('b', null, 'B')),
							h(Toggle, { value: 'italic', class: toggleCls, 'aria-label': 'Italic' }, () => h('i', null, 'I')),
							h(Toggle, { value: 'underline', class: `${toggleCls} underline`, 'aria-label': 'Underline' }, () => 'U'),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, `Active: ${value.value.join(', ') || 'none'}`),
				]);
		},
	}),
};
