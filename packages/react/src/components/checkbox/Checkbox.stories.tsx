import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
	title: 'Forms/Checkbox',
	component: Checkbox.Root,
	subcomponents: {
		'Checkbox.Item': Checkbox.Item,
		'Checkbox.Indicator': Checkbox.Indicator,
		'Checkbox.Label': Checkbox.Label,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Multi-select checkbox group with controlled state.',
			},
		},
	},
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Checkbox.Root name='fruits' className='flex flex-col gap-3'>
			{['Apple', 'Banana', 'Cherry'].map((fruit) => (
				<Checkbox.Item
					key={fruit}
					value={fruit.toLowerCase()}
					className='group flex cursor-pointer items-center gap-2'>
					<span className='flex h-5 w-5 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black'>
						<Checkbox.Indicator>
							<svg className='h-3 w-3' viewBox='0 0 12 12' fill='none'>
								<path d='M2 6l3 3 5-5' stroke='currentColor' strokeWidth='2' />
							</svg>
						</Checkbox.Indicator>
					</span>
					<Checkbox.Label className='select-none text-sm text-black'>{fruit}</Checkbox.Label>
				</Checkbox.Item>
			))}
		</Checkbox.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const composedItems = [
			{ value: 'terms', label: 'Terms of Service', desc: 'You agree to our terms' },
			{ value: 'privacy', label: 'Privacy Policy', desc: 'You accept our privacy policy' },
			{ value: 'newsletter', label: 'Newsletter', desc: 'Receive weekly updates' },
		];

		return (
			<Checkbox.Root name='agreements' className='flex flex-col gap-4'>
				{composedItems.map((item) => (
					<Checkbox.Item
						key={item.value}
						value={item.value}
						className='group flex cursor-pointer items-start gap-3'>
						<span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black'>
							<Checkbox.Indicator>
								<svg className='h-3 w-3' viewBox='0 0 12 12' fill='none'>
									<path d='M2 6l3 3 5-5' stroke='currentColor' strokeWidth='2' />
								</svg>
							</Checkbox.Indicator>
						</span>
						<div className='flex flex-col'>
							<Checkbox.Label className='select-none text-sm font-medium text-black'>
								{item.label}
							</Checkbox.Label>
							<span className='text-xs text-[#6b7280]'>{item.desc}</span>
						</div>
					</Checkbox.Item>
				))}
			</Checkbox.Root>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const settingsItems = [
			{ value: 'notifications', label: 'Push Notifications' },
			{ value: 'emails', label: 'Email Updates' },
			{ value: 'analytics', label: 'Usage Analytics' },
		];

		return (
			<div className='w-full max-w-sm rounded-[20px] border border-black bg-white'>
				<div className='px-5 py-4'>
					<p className='text-sm font-medium text-black'>Settings</p>
				</div>
				<Checkbox.Root name='settings' className='flex flex-col divide-y divide-black/10'>
					{settingsItems.map((item) => (
						<Checkbox.Item
							key={item.value}
							value={item.value}
							className='group flex cursor-pointer items-center justify-between px-5 py-4'>
							<Checkbox.Label className='select-none text-sm text-black'>{item.label}</Checkbox.Label>
							<span className='flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black'>
								<Checkbox.Indicator>
									<svg className='h-3 w-3' viewBox='0 0 12 12' fill='none'>
										<path d='M2 6l3 3 5-5' stroke='currentColor' strokeWidth='2' />
									</svg>
								</Checkbox.Indicator>
							</span>
						</Checkbox.Item>
					))}
				</Checkbox.Root>
			</div>
		);
	},
};
