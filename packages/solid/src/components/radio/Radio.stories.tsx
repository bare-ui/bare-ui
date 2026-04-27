import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { Radio } from './Radio';

const meta = {
	title: 'Forms/Radio',
	component: Radio.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Single-select radio group with compound item pattern.',
			},
		},
	},
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

export const Default: Story = {
	render: () => (
		<Radio.Root
			name='plan-basic'
			class='space-y-2'>
			<For each={plans}>
				{(plan) => (
					<Radio.Item
						value={plan.value}
						class='group relative flex cursor-pointer rounded-[8px] border border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]'>
						<div class='flex w-full items-center gap-3'>
							<span class='flex size-5 shrink-0 items-center justify-center rounded-full border border-black bg-white transition group-data-[checked]:bg-black'>
								<Radio.Indicator class='size-2 rounded-full bg-white' />
							</span>
							<Radio.Label class='text-sm font-medium text-black'>{plan.label}</Radio.Label>
						</div>
					</Radio.Item>
				)}
			</For>
		</Radio.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Radio.Root
			name='plan-composed'
			class='space-y-2'>
			<For each={plans}>
				{(plan) => (
					<Radio.Item
						value={plan.value}
						class='group relative flex cursor-pointer rounded-[8px] border border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]'>
						<div class='flex w-full items-center gap-3'>
							<span class='flex size-5 shrink-0 items-center justify-center rounded-full border border-black bg-white transition group-data-[checked]:bg-black'>
								<Radio.Indicator class='size-2 rounded-full bg-white' />
							</span>
							<div>
								<Radio.Label class='block text-sm font-medium text-black'>{plan.label}</Radio.Label>
								<p class='text-xs text-[#6b7280]'>{plan.description}</p>
							</div>
						</div>
					</Radio.Item>
				)}
			</For>
		</Radio.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<Radio.Root
			name='plan-complex'
			class='space-y-2'>
			<For each={plans}>
				{(plan) => (
					<Radio.Item
						value={plan.value}
						class='group relative flex cursor-pointer rounded-[8px] border border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]'>
						<div class='flex w-full items-center justify-between gap-4'>
							<div class='flex items-center gap-3'>
								<span class='flex size-5 shrink-0 items-center justify-center rounded-full border border-black bg-white transition group-data-[checked]:border-black group-data-[checked]:bg-black'>
									<Radio.Indicator class='size-2 rounded-full bg-white' />
								</span>
								<div>
									<Radio.Label class='block text-sm font-medium text-black'>{plan.label}</Radio.Label>
									<p class='text-xs text-[#6b7280]'>{plan.description}</p>
								</div>
							</div>
							<div class='flex shrink-0 gap-4 text-xs text-[#6b7280] group-data-[checked]:text-black'>
								<span>{plan.ram}</span>
								<span>{plan.cpus}</span>
								<span>{plan.disk}</span>
							</div>
						</div>
					</Radio.Item>
				)}
			</For>
		</Radio.Root>
	),
};
