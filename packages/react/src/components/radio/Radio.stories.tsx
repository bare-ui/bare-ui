import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta = {
	title: 'Components/Radio',
	component: Radio.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Single-selection radio group.',
			},
		},
	},
} satisfies Meta<typeof Radio.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
	{ value: 'startup', label: 'Startup', description: 'Up to 5 active job postings', ram: '12GB', cpus: '6 CPUs', disk: '160 GB SSD disk' },
	{ value: 'business', label: 'Business', description: 'Up to 25 active job postings', ram: '16GB', cpus: '8 CPUs', disk: '512 GB SSD disk' },
	{ value: 'enterprise', label: 'Enterprise', description: 'Unlimited active job postings', ram: '32GB', cpus: '12 CPUs', disk: '1024 GB SSD disk' },
];

export const Plain: Story = {
	render: () => (
		<Radio.Root name='color' className='flex flex-col gap-2'>
			{['Red', 'Green', 'Blue'].map((color) => (
				<Radio.Item
					key={color}
					value={color.toLowerCase()}
					className='group flex cursor-pointer items-center gap-2'>
					<span className='flex size-4 items-center justify-center rounded-full border-2 border-black group-data-[checked]:border-black'>
						<Radio.Indicator className='size-2 rounded-full bg-black' />
					</span>
					<Radio.Label className='select-none text-sm text-black'>{color}</Radio.Label>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};

export const Default: Story = {
	render: () => (
		<Radio.Root name='plan' className='space-y-2'>
			{plans.map((plan) => (
				<Radio.Item
					key={plan.value}
					value={plan.value}
					className='group relative flex cursor-pointer rounded-[8px] border-2 border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]'>
					<div className='flex w-full items-center justify-between'>
						<div className='text-sm'>
							<Radio.Label className='block font-medium text-black'>{plan.label}</Radio.Label>
							<p className='text-[#9ca3af]'>{plan.description}</p>
						</div>
						<div className='shrink-0'>
							<span className='flex size-5 items-center justify-center rounded-full border-2 border-black bg-white transition group-data-[checked]:bg-black'>
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
		<Radio.Root name='plan-specs' className='space-y-2'>
			{plans.map((plan) => (
				<Radio.Item
					key={plan.value}
					value={plan.value}
					className='group relative flex cursor-pointer rounded-[20px] border-[3px] border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5] data-[checked]:ring-2 data-[checked]:ring-black/20'>
					<div className='flex w-full items-center justify-between gap-4'>
						<div className='flex items-center gap-3'>
							<span className='flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white transition group-data-[checked]:bg-black'>
								<Radio.Indicator className='size-2 rounded-full bg-white' />
							</span>
							<div>
								<Radio.Label className='block text-sm font-medium text-black'>{plan.label}</Radio.Label>
								<p className='text-xs text-[#9ca3af]'>{plan.description}</p>
							</div>
						</div>
						<div className='flex shrink-0 gap-4 text-xs text-[#9ca3af] group-data-[checked]:text-black'>
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
		<Radio.Root name='plan-disabled' className='space-y-2'>
			{plans.map((plan, i) => (
				<Radio.Item
					key={plan.value}
					value={plan.value}
					disabled={i === 1}
					className='group relative flex cursor-pointer rounded-[8px] border-2 border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'>
					<div className='flex w-full items-center justify-between'>
						<div className='flex items-center gap-3'>
							<span className='flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white transition group-data-[checked]:bg-black group-data-[disabled]:bg-[#f5f5f5]'>
								<Radio.Indicator className='size-2 rounded-full bg-white' />
							</span>
							<Radio.Label className='text-sm font-medium text-black'>{plan.label}</Radio.Label>
						</div>
						<span className='text-xs text-[#9ca3af]'>{plan.description}</span>
					</div>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};

export const Inline: Story = {
	render: () => (
		<Radio.Root name='size' className='flex gap-3'>
			{['XS', 'S', 'M', 'L', 'XL'].map((size) => (
				<Radio.Item
					key={size}
					value={size.toLowerCase()}
					className='group flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white text-sm font-medium text-black transition data-[checked]:bg-black data-[checked]:text-white'>
					<Radio.Label className='select-none'>{size}</Radio.Label>
				</Radio.Item>
			))}
		</Radio.Root>
	),
};
