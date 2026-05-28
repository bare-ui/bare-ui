import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from './Sheet';

const meta = {
	title: 'Overlays/Sheet',
	component: Sheet.Root,
	subcomponents: {
		'Sheet.Trigger': Sheet.Trigger,
		'Sheet.Overlay': Sheet.Overlay,
		'Sheet.Content': Sheet.Content,
		'Sheet.Handle': Sheet.Handle,
		'Sheet.Title': Sheet.Title,
		'Sheet.Description': Sheet.Description,
		'Sheet.Close': Sheet.Close,
	},
	tags: ['autodocs'],
	args: { children: null },
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A Drawer-adjacent panel that slides from any edge, with iOS-style snap points: drag the handle to rest at configured heights, or past the smallest snap to dismiss. Modal by default (focus trap + scroll lock).',
			},
		},
	},
} satisfies Meta<typeof Sheet.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls = 'rounded-lg bg-black px-4 py-2 text-sm font-medium text-white';
const overlayCls = 'fixed inset-0 z-40 bg-black/40';
const contentBaseCls =
	'z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out data-[dragging]:transition-none';
const handleCls = 'mx-auto mt-3 h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-[#d1d5db] active:cursor-grabbing';
const closeCls = 'mt-4 w-full rounded-lg border border-[#d1d5db] py-2 text-sm font-medium';

export const Default: Story = {
	render: () => (
		<div className='flex h-[500px] items-center justify-center bg-[#f3f4f6]'>
			<Sheet.Root snapPoints={[0.4]}>
				<Sheet.Trigger className={triggerCls}>Open sheet</Sheet.Trigger>
				<Sheet.Portal>
					<Sheet.Overlay className={overlayCls} />
					<Sheet.Content className={`${contentBaseCls} rounded-t-2xl`}>
						<Sheet.Handle className={handleCls} />
						<div className='p-5'>
							<Sheet.Title className='text-lg font-semibold text-black'>Bottom sheet</Sheet.Title>
							<Sheet.Description className='mt-1 text-sm text-[#6b7280]'>
								Slides up from the bottom edge. Drag the handle down or tap the overlay to dismiss.
							</Sheet.Description>
							<Sheet.Close className={closeCls}>Done</Sheet.Close>
						</div>
					</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div className='flex h-[500px] items-center justify-center gap-4 bg-[#f3f4f6]'>
			<Sheet.Root snapPoints={[0.3, 0.6, 0.9]}>
				<Sheet.Trigger className={triggerCls}>Snap points</Sheet.Trigger>
				<Sheet.Portal>
					<Sheet.Overlay className={overlayCls} />
					<Sheet.Content className={`${contentBaseCls} rounded-t-2xl`}>
						<Sheet.Handle className={handleCls} />
						<div className='overflow-auto p-5'>
							<Sheet.Title className='text-lg font-semibold text-black'>Snap heights</Sheet.Title>
							<Sheet.Description className='mt-1 text-sm text-[#6b7280]'>
								Drag the handle to snap between 30%, 60% and 90% — or flick down to dismiss.
							</Sheet.Description>
							<div className='mt-4 space-y-2'>
								{Array.from({ length: 12 }, (_, i) => (
									<div
										key={i}
										className='rounded-lg bg-[#f3f4f6] p-3 text-sm text-[#374151]'>
										Row {i + 1}
									</div>
								))}
							</div>
							<Sheet.Close className={closeCls}>Done</Sheet.Close>
						</div>
					</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>

			<Sheet.Root
				side='top'
				snapPoints={[0.4]}>
				<Sheet.Trigger className={triggerCls}>Top sheet</Sheet.Trigger>
				<Sheet.Portal>
					<Sheet.Overlay className={overlayCls} />
					<Sheet.Content className={`${contentBaseCls} rounded-b-2xl`}>
						<div className='p-5'>
							<Sheet.Title className='text-lg font-semibold text-black'>Heads up</Sheet.Title>
							<Sheet.Description className='mt-1 text-sm text-[#6b7280]'>
								A sheet that drops in from the top — drag the handle up to dismiss.
							</Sheet.Description>
							<Sheet.Close className={closeCls}>Dismiss</Sheet.Close>
						</div>
						<Sheet.Handle className='mx-auto mb-3 h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-[#d1d5db]' />
					</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>
		</div>
	),
};

const sortOptions = ['Relevance', 'Newest', 'Price: low to high', 'Price: high to low', 'Top rated'];

export const Complex: Story = {
	render: () => (
		<div className='flex h-[500px] items-center justify-center bg-[#f3f4f6]'>
			<Sheet.Root snapPoints={[0.5, 0.85]}>
				<Sheet.Trigger className='flex items-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-black'>
					Filters
				</Sheet.Trigger>
				<Sheet.Portal>
					<Sheet.Overlay className={overlayCls} />
					<Sheet.Content className={`${contentBaseCls} rounded-t-2xl`}>
						<Sheet.Handle className={handleCls} />
						<div className='flex items-center justify-between border-b border-[#f3f4f6] px-5 py-3'>
							<Sheet.Title className='text-base font-semibold text-black'>Sort &amp; filter</Sheet.Title>
							<Sheet.Close className='text-sm font-medium text-[#6b7280]'>Reset</Sheet.Close>
						</div>
						<div className='flex-1 overflow-auto p-5'>
							<Sheet.Description className='text-sm text-[#6b7280]'>
								Choose how results are ordered.
							</Sheet.Description>
							<div className='mt-3 space-y-1'>
								{sortOptions.map((opt, i) => (
									<label
										key={opt}
										className='flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#374151] hover:bg-[#f5f5f5]'>
										<input
											type='radio'
											name='sort'
											defaultChecked={i === 0}
											className='accent-black'
										/>
										{opt}
									</label>
								))}
							</div>
						</div>
						<div className='border-t border-[#f3f4f6] p-4'>
							<Sheet.Close className='w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white'>
								Apply
							</Sheet.Close>
						</div>
					</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>
		</div>
	),
};
