import type { Meta, StoryObj } from 'storybook-solidjs-vite';
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
			class='h-80 w-72 rounded-xl border border-[#e5e7eb]'>
			{({ index }) => (
				<div class='flex items-center gap-3 border-b border-[#f3f4f6] px-4 py-3 text-sm'>
					<span class='flex size-7 items-center justify-center rounded-full bg-[#f3f4f6] text-xs text-[#6b7280]'>
						{index}
					</span>
					<span class='text-black'>Item number {index}</span>
				</div>
			)}
		</Virtualizer.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-8'>
			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Horizontal</p>
				<Virtualizer.Root
					count={5000}
					estimateSize={120}
					orientation='horizontal'
					class='h-32 w-full max-w-2xl rounded-xl border border-[#e5e7eb]'>
					{({ index }) => (
						<div class='flex h-full w-[120px] flex-col items-center justify-center border-r border-[#f3f4f6] text-sm'>
							<span class='text-2xl'>🗂️</span>
							<span class='text-black'>#{index}</span>
						</div>
					)}
				</Virtualizer.Root>
			</div>

			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Variable heights (measured)</p>
				<Virtualizer.Root
					count={1000}
					estimateSize={80}
					class='h-80 w-80 rounded-xl border border-[#e5e7eb]'>
					{({ index }) => (
						<div class='border-b border-[#f3f4f6] px-4 py-3 text-sm text-[#374151]'>
							<p class='font-semibold text-black'>Row {index}</p>
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
			<div class='w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white'>
				<div class='flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3'>
					<p class='text-sm font-semibold text-black'>Contacts</p>
					<span class='text-xs text-[#9ca3af]'>20,000</span>
				</div>
				<Virtualizer.Root
					count={20000}
					estimateSize={56}
					overscan={6}
					class='h-96'>
					{({ index }) => {
						const name = `${first[index % first.length]} ${last[(index >> 3) % last.length]}`;
						const initials = name
							.split(' ')
							.map((p) => p[0])
							.join('');
						return (
							<div class='flex items-center gap-3 border-b border-[#f3f4f6] px-4 py-2.5 hover:bg-[#f5f5f5]'>
								<span class='flex size-9 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-[#374151]'>
									{initials}
								</span>
								<div class='min-w-0 text-sm'>
									<p class='truncate text-black'>{name}</p>
									<p class='truncate text-xs text-[#9ca3af]'>
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
