import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { ColorPicker } from './ColorPicker';

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

export const Default: Story = {
	render: () => {
		const [color, setColor] = createSignal('#6d28d9');
		return (
			<div class='w-64 space-y-3 rounded-xl border border-[#e5e7eb] bg-white p-3'>
				<ColorPicker.Root
					value={color()}
					onChange={setColor}>
					<ColorPicker.Area class='relative mb-3 h-40 w-full rounded-lg'>
						<ColorPicker.AreaThumb class={thumbCls} />
					</ColorPicker.Area>
					<div class='flex items-center gap-3'>
						<ColorPicker.Swatch class='size-9 shrink-0 rounded-full ring-1 ring-black/10' />
						<div class='flex-1 space-y-2'>
							<ColorPicker.Hue class='relative h-3 w-full rounded-full'>
								<ColorPicker.HueThumb class={thumbCls} />
							</ColorPicker.Hue>
							<ColorPicker.Alpha class='relative h-3 w-full rounded-full'>
								<ColorPicker.AlphaThumb class={thumbCls} />
							</ColorPicker.Alpha>
						</div>
					</div>
					<ColorPicker.Input class='mt-3 w-full rounded-md border border-[#d1d5db] px-2 py-1 font-mono text-sm uppercase outline-none focus:border-black' />
				</ColorPicker.Root>
				<p class='text-center text-xs text-[#6b7280]'>{color()}</p>
			</div>
		);
	},
};

export const NoAlpha: Story = {
	render: () => (
		<div class='w-64 space-y-3 rounded-xl border border-[#e5e7eb] bg-white p-3'>
			<ColorPicker.Root
				defaultValue='#0ea5e9'
				alpha={false}>
				<ColorPicker.Area class='relative mb-3 h-40 w-full rounded-lg'>
					<ColorPicker.AreaThumb class={thumbCls} />
				</ColorPicker.Area>
				<div class='flex items-center gap-3'>
					<ColorPicker.Swatch class='size-9 shrink-0 rounded-full ring-1 ring-black/10' />
					<ColorPicker.Hue class='relative h-3 flex-1 rounded-full'>
						<ColorPicker.HueThumb class={thumbCls} />
					</ColorPicker.Hue>
				</div>
				<ColorPicker.Input class='mt-3 w-full rounded-md border border-[#d1d5db] px-2 py-1 font-mono text-sm uppercase outline-none focus:border-black' />
			</ColorPicker.Root>
		</div>
	),
};
