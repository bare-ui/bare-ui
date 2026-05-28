import type { Meta, StoryObj } from '@storybook/react-vite';
import { Virtualizer } from './Virtualizer';

const meta = {
	title: 'Layout/Virtualizer',
	component: Virtualizer.Root,
	tags: ['autodocs'],
	args: { count: 10000, children: () => null },
	parameters: {
		docs: {
			description: {
				component:
					'A windowing primitive: renders only the items in view (plus overscan), measuring real sizes as they appear. Pairs with `List` and `Chat.List`. Supports vertical and horizontal axes.',
			},
		},
	},
} satisfies Meta<typeof Virtualizer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Virtualizer.Root
			count={10000}
			estimateSize={44}
			className='h-80 w-72 rounded-xl border border-[#e5e7eb]'>
			{({ index }) => (
				<div className='flex items-center gap-3 border-b border-[#f3f4f6] px-4 py-3 text-sm'>
					<span className='flex size-7 items-center justify-center rounded-full bg-[#f3f4f6] text-xs text-[#6b7280]'>
						{index}
					</span>
					<span className='text-black'>Item number {index}</span>
				</div>
			)}
		</Virtualizer.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div className='flex flex-col gap-8'>
			<div>
				<p className='mb-2 text-sm font-medium text-[#374151]'>Horizontal</p>
				<Virtualizer.Root
					count={5000}
					estimateSize={120}
					orientation='horizontal'
					className='h-32 w-full max-w-2xl rounded-xl border border-[#e5e7eb]'>
					{({ index }) => (
						<div className='flex h-full w-[120px] flex-col items-center justify-center border-r border-[#f3f4f6] text-sm'>
							<span className='text-2xl'>🗂️</span>
							<span className='text-black'>#{index}</span>
						</div>
					)}
				</Virtualizer.Root>
			</div>

			<div>
				<p className='mb-2 text-sm font-medium text-[#374151]'>Variable heights (measured)</p>
				<Virtualizer.Root
					count={1000}
					estimateSize={80}
					className='h-80 w-80 rounded-xl border border-[#e5e7eb]'>
					{({ index }) => (
						<div className='border-b border-[#f3f4f6] px-4 py-3 text-sm text-[#374151]'>
							<p className='font-semibold text-black'>Row {index}</p>
							<p>{'Variable height content. '.repeat((index % 4) + 1)}</p>
						</div>
					)}
				</Virtualizer.Root>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const first = ['Maya', 'Leo', 'Ravi', 'Tess', 'Ana', 'Sam', 'Iris', 'Theo'];
		const last = ['Chen', 'Park', 'Singh', 'Doyle', 'Ortiz', 'Wells', 'Kane', 'Voss'];

		return (
			<div className='w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white'>
				<div className='flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3'>
					<p className='text-sm font-semibold text-black'>Contacts</p>
					<span className='text-xs text-[#9ca3af]'>20,000</span>
				</div>
				<Virtualizer.Root
					count={20000}
					estimateSize={56}
					overscan={6}
					className='h-96'>
					{({ index }) => {
						const name = `${first[index % first.length]} ${last[(index >> 3) % last.length]}`;
						const initials = name
							.split(' ')
							.map((p) => p[0])
							.join('');
						return (
							<div className='flex items-center gap-3 border-b border-[#f3f4f6] px-4 py-2.5 hover:bg-[#f5f5f5]'>
								<span className='flex size-9 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-[#374151]'>
									{initials}
								</span>
								<div className='min-w-0 text-sm'>
									<p className='truncate text-black'>{name}</p>
									<p className='truncate text-xs text-[#9ca3af]'>
										{name.toLowerCase().replace(' ', '.')}@example.com
									</p>
								</div>
							</div>
						);
					}}
				</Virtualizer.Root>
			</div>
		);
	},
};
