import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ColorPicker } from '.';

const meta = {
	title: 'Forms/ColorPicker',
	component: ColorPicker.Root,
	subcomponents: {
		'ColorPicker.Area': ColorPicker.Area,
		'ColorPicker.AreaThumb': ColorPicker.AreaThumb,
		'ColorPicker.Hue': ColorPicker.Hue,
		'ColorPicker.HueThumb': ColorPicker.HueThumb,
		'ColorPicker.Alpha': ColorPicker.Alpha,
		'ColorPicker.AlphaThumb': ColorPicker.AlphaThumb,
		'ColorPicker.Swatch': ColorPicker.Swatch,
		'ColorPicker.Input': ColorPicker.Input,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A headless HSVA color picker: a saturation/value area, hue and alpha sliders, a swatch and a hex input. Pointer-draggable and keyboard-accessible; emits hex strings.',
			},
		},
	},
} satisfies Meta<typeof ColorPicker.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const thumbCls = 'size-3.5 rounded-full border-2 border-white shadow ring-1 ring-black/20';
const inputCls =
	'mt-3 w-full rounded-md border border-[#d1d5db] px-2 py-1 font-mono text-sm uppercase outline-none focus:border-black';

export const Default: Story = {
	render: () => ({
		setup() {
			const color = ref('#6d28d9');
			return () =>
				h('div', { class: 'w-64 space-y-3 rounded-xl border border-[#e5e7eb] bg-white p-3' }, [
					h(
						ColorPicker.Root,
						{ value: color.value, onChange: (v: string) => { color.value = v; } },
						() => [
							h(ColorPicker.Area, { class: 'relative mb-3 h-40 w-full rounded-lg' }, () =>
								h(ColorPicker.AreaThumb, { class: thumbCls }),
							),
							h('div', { class: 'flex items-center gap-3' }, [
								h(ColorPicker.Swatch, { class: 'size-9 shrink-0 rounded-full ring-1 ring-black/10' }),
								h('div', { class: 'flex-1 space-y-2' }, [
									h(ColorPicker.Hue, { class: 'relative h-3 w-full rounded-full' }, () =>
										h(ColorPicker.HueThumb, { class: thumbCls }),
									),
									h(ColorPicker.Alpha, { class: 'relative h-3 w-full rounded-full' }, () =>
										h(ColorPicker.AlphaThumb, { class: thumbCls }),
									),
								]),
							]),
							h(ColorPicker.Input, {
								class: 'mt-3 w-full rounded-md border border-[#d1d5db] px-2 py-1 font-mono text-sm uppercase outline-none focus:border-black',
							}),
						],
					),
					h('p', { class: 'text-center text-xs text-[#6b7280]' }, color.value),
				]);
		},
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-start gap-6' }, [
				h('div', { class: 'w-64 space-y-2 rounded-xl border border-[#e5e7eb] bg-white p-3' }, [
					h('p', { class: 'text-xs font-medium text-[#374151]' }, 'With alpha'),
					h(
						ColorPicker.Root,
						{ defaultValue: '#0ea5e9cc' },
						() => [
							h(ColorPicker.Area, { class: 'relative mb-3 h-32 w-full rounded-lg' }, () =>
								h(ColorPicker.AreaThumb, { class: thumbCls }),
							),
							h('div', { class: 'flex items-center gap-3' }, [
								h(ColorPicker.Swatch, { class: 'size-9 shrink-0 rounded-full ring-1 ring-black/10' }),
								h('div', { class: 'flex-1 space-y-2' }, [
									h(ColorPicker.Hue, { class: 'relative h-3 w-full rounded-full' }, () =>
										h(ColorPicker.HueThumb, { class: thumbCls }),
									),
									h(ColorPicker.Alpha, { class: 'relative h-3 w-full rounded-full' }, () =>
										h(ColorPicker.AlphaThumb, { class: thumbCls }),
									),
								]),
							]),
							h(ColorPicker.Input, { class: inputCls }),
						],
					),
				]),
				h('div', { class: 'w-64 space-y-2 rounded-xl border border-[#e5e7eb] bg-white p-3' }, [
					h('p', { class: 'text-xs font-medium text-[#374151]' }, 'Solid only'),
					h(
						ColorPicker.Root,
						{ defaultValue: '#0ea5e9', alpha: false },
						() => [
							h(ColorPicker.Area, { class: 'relative mb-3 h-32 w-full rounded-lg' }, () =>
								h(ColorPicker.AreaThumb, { class: thumbCls }),
							),
							h('div', { class: 'flex items-center gap-3' }, [
								h(ColorPicker.Swatch, { class: 'size-9 shrink-0 rounded-full ring-1 ring-black/10' }),
								h(ColorPicker.Hue, { class: 'relative h-3 flex-1 rounded-full' }, () =>
									h(ColorPicker.HueThumb, { class: thumbCls }),
								),
							]),
							h(ColorPicker.Input, { class: inputCls }),
						],
					),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const presets = ['#000000', '#ef4444', '#f59e0b', '#10b981', '#0ea5e9', '#6d28d9'];
			const color = ref('#0ea5e9');
			return () =>
				h('div', { class: 'w-72 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm' }, [
					h('div', { class: 'mb-3 flex items-center justify-between' }, [
						h('span', { class: 'text-sm font-semibold text-black' }, 'Brand color'),
						h('span', {
							class: 'size-6 rounded-full ring-1 ring-black/10',
							style: { backgroundColor: color.value },
						}),
					]),
					h(
						ColorPicker.Root,
						{ value: color.value, onChange: (v: string) => { color.value = v; } },
						() => [
							h(ColorPicker.Area, { class: 'relative mb-3 h-36 w-full rounded-lg' }, () =>
								h(ColorPicker.AreaThumb, { class: thumbCls }),
							),
							h('div', { class: 'flex items-center gap-3' }, [
								h(ColorPicker.Swatch, { class: 'size-9 shrink-0 rounded-full ring-1 ring-black/10' }),
								h('div', { class: 'flex-1 space-y-2' }, [
									h(ColorPicker.Hue, { class: 'relative h-3 w-full rounded-full' }, () =>
										h(ColorPicker.HueThumb, { class: thumbCls }),
									),
									h(ColorPicker.Alpha, { class: 'relative h-3 w-full rounded-full' }, () =>
										h(ColorPicker.AlphaThumb, { class: thumbCls }),
									),
								]),
							]),
							h(ColorPicker.Input, { class: inputCls }),
						],
					),
					h('div', { class: 'mt-4' }, [
						h('p', { class: 'mb-2 text-xs font-medium text-[#374151]' }, 'Presets'),
						h(
							'div',
							{ class: 'flex gap-2' },
							presets.map((p) =>
								h('button', {
									key: p,
									type: 'button',
									onClick: () => { color.value = p; },
									class: 'size-7 rounded-full ring-1 ring-black/10 transition hover:scale-110',
									style: { backgroundColor: p },
									'aria-label': `Use ${p}`,
								}),
							),
						),
					]),
				]);
		},
	}),
};
