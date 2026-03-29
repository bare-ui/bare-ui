import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
	title: 'Components/Checkbox',
	component: Checkbox.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Checkbox.Root
			name='fruits'
			className='flex flex-col gap-3'>
			{['Apple', 'Banana', 'Cherry'].map((fruit) => (
				<Checkbox.Item
					key={fruit}
					value={fruit.toLowerCase()}
					className='group flex cursor-pointer items-center gap-2'>
					<span className='flex h-5 w-5 items-center justify-center rounded border border-gray-400 bg-white text-white group-data-[checked]:border-blue-600 group-data-[checked]:bg-blue-600'>
						<Checkbox.Indicator>
							<svg
								className='h-3 w-3'
								viewBox='0 0 12 12'
								fill='none'>
								<path
									d='M2 6l3 3 5-5'
									stroke='currentColor'
									strokeWidth='2'
								/>
							</svg>
						</Checkbox.Indicator>
					</span>
					<Checkbox.Label className='select-none text-sm text-gray-700'>{fruit}</Checkbox.Label>
				</Checkbox.Item>
			))}
		</Checkbox.Root>
	),
};

export const Required: Story = {
	render: () => {
		return (
			<Checkbox.Root
				name='terms'
				isRequired
				className='flex flex-col gap-3'>
				{['Terms of Service', 'Privacy Policy', 'Newsletter'].map((item) => (
					<Checkbox.Item
						key={item}
						value={item.toLowerCase().replace(/\s+/g, '-')}
						className='group flex cursor-pointer items-center gap-2'>
						<span className='flex h-5 w-5 items-center justify-center rounded border border-gray-400 bg-white text-white group-data-[checked]:border-blue-600 group-data-[checked]:bg-blue-600'>
							<Checkbox.Indicator>
								<svg
									className='h-3 w-3'
									viewBox='0 0 12 12'
									fill='none'>
									<path
										d='M2 6l3 3 5-5'
										stroke='currentColor'
										strokeWidth='2'
									/>
								</svg>
							</Checkbox.Indicator>
						</span>
						<Checkbox.Label className='select-none text-sm text-gray-700'>{item}</Checkbox.Label>
					</Checkbox.Item>
				))}
			</Checkbox.Root>
		);
	},
};
