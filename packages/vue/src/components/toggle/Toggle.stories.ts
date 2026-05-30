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
const groupCls = 'inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Toggle, { class: toggleCls, 'aria-label': 'Toggle italic' }, () => h('i', null, 'I')),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const single = ref<string | null>('center');
			const multi = ref<string[]>(['bold']);
			return () =>
				h('div', { class: 'space-y-6' }, [
					h('div', { class: 'space-y-2' }, [
						h('p', { class: 'text-xs font-medium text-[#6b7280]' }, 'Single select (alignment)'),
						h(
							ToggleGroup.Root,
							{
								type: 'single',
								value: single.value,
								onChange: (v: string | null) => {
									single.value = v;
								},
								class: groupCls,
								'aria-label': 'Text alignment',
							},
							() => [
								h(Toggle, { value: 'left', class: toggleCls, 'aria-label': 'Align left' }, () => '⬅'),
								h(Toggle, { value: 'center', class: toggleCls, 'aria-label': 'Align center' }, () => '↔'),
								h(Toggle, { value: 'right', class: toggleCls, 'aria-label': 'Align right' }, () => '➡'),
							],
						),
						h('p', { class: 'text-xs text-[#6b7280]' }, `Selected: ${single.value ?? 'none'}`),
					]),
					h('div', { class: 'space-y-2' }, [
						h('p', { class: 'text-xs font-medium text-[#6b7280]' }, 'Multiple select (formatting)'),
						h(
							ToggleGroup.Root,
							{
								type: 'multiple',
								value: multi.value,
								onChange: (v: string[]) => {
									multi.value = v;
								},
								class: groupCls,
								'aria-label': 'Text formatting',
							},
							() => [
								h(Toggle, { value: 'bold', class: toggleCls, 'aria-label': 'Bold' }, () => h('b', null, 'B')),
								h(Toggle, { value: 'italic', class: toggleCls, 'aria-label': 'Italic' }, () => h('i', null, 'I')),
								h(Toggle, { value: 'underline', class: `${toggleCls} underline`, 'aria-label': 'Underline' }, () => 'U'),
							],
						),
						h('p', { class: 'text-xs text-[#6b7280]' }, `Active: ${multi.value.join(', ') || 'none'}`),
					]),
					h('div', { class: 'space-y-2' }, [
						h('p', { class: 'text-xs font-medium text-[#6b7280]' }, 'Vertical, disabled'),
						h(
							ToggleGroup.Root,
							{
								type: 'single',
								defaultValue: 'grid',
								orientation: 'vertical',
								disabled: true,
								class: `${groupCls} flex-col items-stretch`,
								'aria-label': 'Layout',
							},
							() => [
								h(Toggle, { value: 'list', class: toggleCls }, () => 'List'),
								h(Toggle, { value: 'grid', class: toggleCls }, () => 'Grid'),
							],
						),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const marks = ref<string[]>(['bold']);
			const align = ref<string | null>('left');
			return () =>
				h('div', { class: 'w-[30rem] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white' }, [
					h('div', { class: 'flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-[#f5f5f5] px-3 py-2' }, [
						h(
							ToggleGroup.Root,
							{
								type: 'multiple',
								value: marks.value,
								onChange: (v: string[]) => {
									marks.value = v;
								},
								class: 'inline-flex items-center gap-1',
								'aria-label': 'Text formatting',
							},
							() => [
								h(Toggle, { value: 'bold', class: toggleCls, 'aria-label': 'Bold' }, () => h('b', null, 'B')),
								h(Toggle, { value: 'italic', class: toggleCls, 'aria-label': 'Italic' }, () => h('i', null, 'I')),
								h(Toggle, { value: 'underline', class: `${toggleCls} underline`, 'aria-label': 'Underline' }, () => 'U'),
							],
						),
						h('span', { class: 'mx-1 h-5 w-px bg-[#e5e7eb]' }),
						h(
							ToggleGroup.Root,
							{
								type: 'single',
								value: align.value,
								onChange: (v: string | null) => {
									align.value = v;
								},
								class: 'inline-flex items-center gap-1',
								'aria-label': 'Text alignment',
							},
							() => [
								h(Toggle, { value: 'left', class: toggleCls, 'aria-label': 'Align left' }, () => '⬅'),
								h(Toggle, { value: 'center', class: toggleCls, 'aria-label': 'Align center' }, () => '↔'),
								h(Toggle, { value: 'right', class: toggleCls, 'aria-label': 'Align right' }, () => '➡'),
							],
						),
						h('span', { class: 'mx-1 h-5 w-px bg-[#e5e7eb]' }),
						h(Toggle, { class: toggleCls, 'aria-label': 'Toggle code block' }, () => '</>'),
					]),
					h(
						'p',
						{
							class: 'p-4 text-sm leading-relaxed text-black',
							style: {
								fontWeight: marks.value.includes('bold') ? 700 : 400,
								fontStyle: marks.value.includes('italic') ? 'italic' : 'normal',
								textDecoration: marks.value.includes('underline') ? 'underline' : 'none',
								textAlign: (align.value ?? 'left') as 'left' | 'center' | 'right',
							},
						},
						'The quick brown fox jumps over the lazy dog. Toggle the controls above to format this text.',
					),
				]);
		},
	}),
};
