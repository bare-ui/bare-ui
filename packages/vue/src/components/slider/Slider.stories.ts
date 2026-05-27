import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Slider } from '.';

const meta = {
	title: 'Forms/Slider',
	component: Slider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Single-value or two-thumb range slider with drag + full keyboard support (arrows, Home/End, PageUp/PageDown).',
			},
		},
	},
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shared part-selectors target the inner span elements rendered by Slider.
const sliderCls = [
	'h-6 w-80',
	'[&_[data-part=track]]:top-1/2 [&_[data-part=track]]:-translate-y-1/2 [&_[data-part=track]]:h-1 [&_[data-part=track]]:rounded-full [&_[data-part=track]]:bg-[#e5e5e5]',
	'[&_[data-part=fill]]:top-1/2 [&_[data-part=fill]]:-translate-y-1/2 [&_[data-part=fill]]:h-1 [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:bg-black',
	'[&_[data-part=thumb]]:size-4 [&_[data-part=thumb]]:rounded-full [&_[data-part=thumb]]:border [&_[data-part=thumb]]:border-black [&_[data-part=thumb]]:bg-white',
	'[&_[data-part=thumb]]:cursor-grab [&_[data-part=thumb]]:outline-none',
	'[&_[data-part=thumb]:focus-visible]:ring-2 [&_[data-part=thumb]:focus-visible]:ring-black [&_[data-part=thumb]:focus-visible]:ring-offset-1',
	'[&_[data-part=thumb]:active]:cursor-grabbing',
].join(' ');

export const Default: Story = {
	render: () => ({
		setup() {
			const value = ref(40);
			return () =>
				h('div', { class: 'flex flex-col gap-3' }, [
					h(Slider, {
						value: value.value,
						onChange: (v: number) => { value.value = v; },
						min: 0,
						max: 100,
						step: 1,
						'aria-label': 'Volume',
						class: sliderCls,
					}),
					h('p', { class: 'text-sm text-[#6b7280]' }, [
						'Value: ',
						h('span', { class: 'font-medium text-black' }, value.value),
					]),
				]);
		},
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const range = ref<[number, number]>([20, 80]);
			return () =>
				h('div', { class: 'flex flex-col gap-3' }, [
					h(Slider, {
						range: true,
						value: range.value,
						onChange: (v: [number, number]) => { range.value = v; },
						min: 0,
						max: 100,
						step: 5,
						'aria-label': 'Price range',
						class: sliderCls,
					}),
					h('p', { class: 'text-sm text-[#6b7280]' }, [
						'Range: ',
						h('span', { class: 'font-medium text-black' }, `$${range.value[0]}`),
						' – ',
						h('span', { class: 'font-medium text-black' }, `$${range.value[1]}`),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const volume = ref(60);
			const brightness = ref(75);
			const temp = ref<[number, number]>([18, 24]);

			const labeledSlider = (label: string, readout: string, slider: ReturnType<typeof h>) =>
				h('div', null, [
					h('div', { class: 'flex justify-between text-sm mb-2' }, [
						h('span', { class: 'font-medium text-black' }, label),
						h('span', { class: 'text-[#6b7280]' }, readout),
					]),
					slider,
				]);

			return () =>
				h('div', { class: 'flex max-w-md flex-col gap-6 rounded-[20px] border border-black bg-white p-5' }, [
					labeledSlider(
						'Volume',
						`${volume.value}%`,
						h(Slider, { value: volume.value, onChange: (v: number) => { volume.value = v; }, min: 0, max: 100, step: 1, 'aria-label': 'Volume', class: sliderCls }),
					),
					labeledSlider(
						'Brightness',
						`${brightness.value}%`,
						h(Slider, { value: brightness.value, onChange: (v: number) => { brightness.value = v; }, min: 0, max: 100, step: 5, 'aria-label': 'Brightness', class: sliderCls }),
					),
					labeledSlider(
						'Temperature',
						`${temp.value[0]}°C – ${temp.value[1]}°C`,
						h(Slider, { range: true, value: temp.value, onChange: (v: [number, number]) => { temp.value = v; }, min: 10, max: 30, step: 0.5, 'aria-label': 'Temperature range', class: sliderCls }),
					),
					h('div', null, [
						h('p', { class: 'text-sm font-medium text-black mb-2' }, 'Disabled'),
						h(Slider, { defaultValue: 50, disabled: true, 'aria-label': 'Disabled', class: `${sliderCls} opacity-50` }),
					]),
				]);
		},
	}),
};
