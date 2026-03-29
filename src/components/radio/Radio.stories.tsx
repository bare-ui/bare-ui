import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta = {
	title: 'Components/Radio',
	component: Radio.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Radio.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
	{
		value: 'startup',
		label: 'Startup',
		description: 'Up to 5 active job postings',
		ram: '12GB',
		cpus: '6 CPUs',
		disk: '160 GB SSD disk',
	},
	{
		value: 'business',
		label: 'Business',
		description: 'Up to 25 active job postings',
		ram: '16GB',
		cpus: '8 CPUs',
		disk: '512 GB SSD disk',
	},
	{
		value: 'enterprise',
		label: 'Enterprise',
		description: 'Unlimited active job postings',
		ram: '32GB',
		cpus: '12 CPUs',
		disk: '1024 GB SSD disk',
	},
];

export const Plain: Story = {
	render: () => (
		<Radio.Root
			name='color'
			className='flex flex-col gap-2'>
			{['Red', 'Green', 'Blue'].map((color) => (
				<Radio.Item
					key={color}
					value={color.toLowerCase()}
					className='group flex cursor-pointer items-center gap-2'>
					<span className='flex size-4 items-center justify-center rounded-full border-2 border-gray-400 group-data-[checked]:border-blue-600'>
						<Radio.Indicator className='size-2 rounded-full bg-blue-600' />
					</span>
					<Radio.Label className='select-none text-sm text-gray-700'>{color}</Radio.Label>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};

export const Default: Story = {
	render: () => (
		<Radio.Root
			name='plan'
			className='space-y-2'>
			{plans.map((plan) => (
				<Radio.Item
					key={plan.value}
					value={plan.value}
					className='group relative flex cursor-pointer rounded-lg border border-transparent bg-white/5 px-5 py-4 text-white shadow-md transition focus:outline-none data-[checked]:border-white/30 data-[checked]:bg-white/10'>
					<div className='flex w-full items-center justify-between'>
						<div className='text-sm'>
							<Radio.Label className='block font-medium text-gray-900 group-data-[checked]:text-blue-600'>
								{plan.label}
							</Radio.Label>
							<p className='text-gray-500'>{plan.description}</p>
						</div>
						<div className='shrink-0'>
							<span className='flex size-5 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition group-data-[checked]:border-blue-600 group-data-[checked]:bg-blue-600'>
								<Radio.Indicator className='size-2 rounded-full bg-white' />
							</span>
						</div>
					</div>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};

export const WithSpecs: Story = {
	render: () => (
		<Radio.Root
			name='plan-specs'
			className='space-y-2'>
			{plans.map((plan) => (
				<Radio.Item
					key={plan.value}
					value={plan.value}
					className='group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm transition focus:outline-none data-[checked]:border-blue-500 data-[checked]:ring-2 data-[checked]:ring-blue-500/30'>
					<div className='flex w-full items-center justify-between gap-4'>
						<div className='flex items-center gap-3'>
							<span className='flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition group-data-[checked]:border-blue-600 group-data-[checked]:bg-blue-600'>
								<Radio.Indicator className='size-2 rounded-full bg-white' />
							</span>
							<div>
								<Radio.Label className='block text-sm font-medium text-gray-900'>
									{plan.label}
								</Radio.Label>
								<p className='text-xs text-gray-500'>{plan.description}</p>
							</div>
						</div>
						<div className='flex shrink-0 gap-4 text-xs text-gray-500 group-data-[checked]:text-blue-600'>
							<span>{plan.ram}</span>
							<span>{plan.cpus}</span>
							<span>{plan.disk}</span>
						</div>
					</div>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};

export const Disabled: Story = {
	render: () => (
		<Radio.Root
			name='plan-disabled'
			className='space-y-2'>
			{plans.map((plan, i) => (
				<Radio.Item
					key={plan.value}
					value={plan.value}
					disabled={i === 1}
					className='group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm transition focus:outline-none data-[checked]:border-blue-500 data-[checked]:ring-2 data-[checked]:ring-blue-500/30 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'>
					<div className='flex w-full items-center justify-between'>
						<div className='flex items-center gap-3'>
							<span className='flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition group-data-[checked]:border-blue-600 group-data-[checked]:bg-blue-600 group-data-[disabled]:bg-gray-100'>
								<Radio.Indicator className='size-2 rounded-full bg-white' />
							</span>
							<Radio.Label className='text-sm font-medium text-gray-900'>{plan.label}</Radio.Label>
						</div>
						<span className='text-xs text-gray-400'>{plan.description}</span>
					</div>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};

export const Inline: Story = {
	render: () => (
		<Radio.Root
			name='size'
			className='flex gap-3'>
			{['XS', 'S', 'M', 'L', 'XL'].map((size) => (
				<Radio.Item
					key={size}
					value={size.toLowerCase()}
					className='group flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm transition data-[checked]:border-blue-500 data-[checked]:bg-blue-500 data-[checked]:text-white'>
					<Radio.Label className='select-none'>{size}</Radio.Label>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};
