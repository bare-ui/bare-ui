import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

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
	// Track
	'[&_[data-part=track]]:top-1/2 [&_[data-part=track]]:-translate-y-1/2 [&_[data-part=track]]:h-1 [&_[data-part=track]]:rounded-full [&_[data-part=track]]:bg-[#e5e5e5]',
	// Fill
	'[&_[data-part=fill]]:top-1/2 [&_[data-part=fill]]:-translate-y-1/2 [&_[data-part=fill]]:h-1 [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:bg-black',
	// Thumb
	'[&_[data-part=thumb]]:size-4 [&_[data-part=thumb]]:rounded-full [&_[data-part=thumb]]:border [&_[data-part=thumb]]:border-black [&_[data-part=thumb]]:bg-white',
	'[&_[data-part=thumb]]:cursor-grab [&_[data-part=thumb]]:outline-none',
	'[&_[data-part=thumb]:focus-visible]:ring-2 [&_[data-part=thumb]:focus-visible]:ring-black [&_[data-part=thumb]:focus-visible]:ring-offset-1',
	'[&_[data-part=thumb]:active]:cursor-grabbing',
].join(' ');

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState(40);
		return (
			<div className='flex flex-col gap-3'>
				<Slider
					value={value}
					onChange={setValue}
					min={0}
					max={100}
					step={1}
					aria-label='Volume'
					className={sliderCls}
				/>
				<p className='text-sm text-[#6b7280]'>
					Value: <span className='font-medium text-black'>{value}</span>
				</p>
			</div>
		);
	},
};

export const Composed: Story = {
	render: () => {
		const [range, setRange] = useState<[number, number]>([20, 80]);
		return (
			<div className='flex flex-col gap-3'>
				<Slider
					range
					value={range}
					onChange={setRange}
					min={0}
					max={100}
					step={5}
					aria-label='Price range'
					className={sliderCls}
				/>
				<p className='text-sm text-[#6b7280]'>
					Range: <span className='font-medium text-black'>${range[0]}</span> –{' '}
					<span className='font-medium text-black'>${range[1]}</span>
				</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [volume, setVolume] = useState(60);
		const [brightness, setBrightness] = useState(75);
		const [temp, setTemp] = useState<[number, number]>([18, 24]);

		return (
			<div className='flex max-w-md flex-col gap-6 rounded-[20px] border border-black bg-white p-5'>
				<div>
					<div className='flex justify-between text-sm mb-2'>
						<span className='font-medium text-black'>Volume</span>
						<span className='text-[#6b7280]'>{volume}%</span>
					</div>
					<Slider
						value={volume}
						onChange={setVolume}
						min={0}
						max={100}
						step={1}
						aria-label='Volume'
						className={sliderCls}
					/>
				</div>

				<div>
					<div className='flex justify-between text-sm mb-2'>
						<span className='font-medium text-black'>Brightness</span>
						<span className='text-[#6b7280]'>{brightness}%</span>
					</div>
					<Slider
						value={brightness}
						onChange={setBrightness}
						min={0}
						max={100}
						step={5}
						aria-label='Brightness'
						className={sliderCls}
					/>
				</div>

				<div>
					<div className='flex justify-between text-sm mb-2'>
						<span className='font-medium text-black'>Temperature</span>
						<span className='text-[#6b7280]'>
							{temp[0]}°C – {temp[1]}°C
						</span>
					</div>
					<Slider
						range
						value={temp}
						onChange={setTemp}
						min={10}
						max={30}
						step={0.5}
						aria-label='Temperature range'
						className={sliderCls}
					/>
				</div>

				<div>
					<p className='text-sm font-medium text-black mb-2'>Disabled</p>
					<Slider
						defaultValue={50}
						disabled
						aria-label='Disabled'
						className={`${sliderCls} opacity-50`}
					/>
				</div>
			</div>
		);
	},
};
