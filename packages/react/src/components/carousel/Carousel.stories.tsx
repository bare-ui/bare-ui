import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from './Carousel';

const meta = {
	title: 'Layout/Carousel',
	component: Carousel.Root,
	subcomponents: {
		'Carousel.Viewport': Carousel.Viewport,
		'Carousel.Content': Carousel.Content,
		'Carousel.Slide': Carousel.Slide,
		'Carousel.Previous': Carousel.Previous,
		'Carousel.Next': Carousel.Next,
		'Carousel.Indicators': Carousel.Indicators,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A headless, scroll-snap carousel (Embla-style). Tracks the active slide from scroll position, supports Prev/Next, indicators, keyboard arrows and optional looping.',
			},
		},
	},
} satisfies Meta<typeof Carousel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const slides = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
const btnCls =
	'flex size-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-black shadow-sm disabled:opacity-30';

export const Default: Story = {
	render: () => (
		<Carousel.Root className='relative w-full max-w-md'>
			<Carousel.Viewport
				tabIndex={0}
				className='rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-black'>
				<Carousel.Content>
					{slides.map((color, i) => (
						<Carousel.Slide
							key={color}
							className='w-full'>
							<div
								className='flex h-56 items-center justify-center text-3xl font-bold text-white'
								style={{ backgroundColor: color }}>
								{i + 1}
							</div>
						</Carousel.Slide>
					))}
				</Carousel.Content>
			</Carousel.Viewport>

			<div className='absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between'>
				<Carousel.Previous className={btnCls}>‹</Carousel.Previous>
				<Carousel.Next className={btnCls}>›</Carousel.Next>
			</div>

			<div className='mt-3 flex justify-center gap-2'>
				<Carousel.Indicators>
					{({ index, selected, scrollTo }) => (
						<button
							key={index}
							aria-label={`Go to slide ${index + 1}`}
							onClick={scrollTo}
							className={`size-2 rounded-full transition-colors ${selected ? 'bg-black' : 'bg-[#d1d5db]'}`}
						/>
					)}
				</Carousel.Indicators>
			</div>
		</Carousel.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div className='flex flex-col gap-10'>
			<div>
				<p className='mb-2 text-sm font-medium text-[#374151]'>Looping, multi-item</p>
				<Carousel.Root
					loop
					className='relative w-full max-w-2xl'>
					<Carousel.Viewport className='rounded-2xl'>
						<Carousel.Content className='gap-4 px-1'>
							{Array.from({ length: 8 }, (_, i) => (
								<Carousel.Slide
									key={i}
									className='w-[40%]'>
									<div className='flex h-40 items-center justify-center rounded-xl bg-[#f3f4f6] text-xl font-semibold text-black'>
										Card {i + 1}
									</div>
								</Carousel.Slide>
							))}
						</Carousel.Content>
					</Carousel.Viewport>
					<div className='mt-3 flex justify-end gap-2'>
						<Carousel.Previous className={btnCls}>‹</Carousel.Previous>
						<Carousel.Next className={btnCls}>›</Carousel.Next>
					</div>
				</Carousel.Root>
			</div>

			<div>
				<p className='mb-2 text-sm font-medium text-[#374151]'>Vertical</p>
				<Carousel.Root
					orientation='vertical'
					className='relative w-full max-w-xs'>
					<Carousel.Viewport className='h-56 rounded-2xl'>
						<Carousel.Content>
							{slides.map((color, i) => (
								<Carousel.Slide
									key={color}
									className='h-56'>
									<div
										className='flex h-56 items-center justify-center text-3xl font-bold text-white'
										style={{ backgroundColor: color }}>
										{i + 1}
									</div>
								</Carousel.Slide>
							))}
						</Carousel.Content>
					</Carousel.Viewport>
					<div className='absolute inset-y-3 left-1/2 flex -translate-x-1/2 flex-col justify-between'>
						<Carousel.Previous className={btnCls}>‹</Carousel.Previous>
						<Carousel.Next className={btnCls}>›</Carousel.Next>
					</div>
				</Carousel.Root>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const products = [
			{ name: 'Aero Headphones', color: '#374151' },
			{ name: 'Pulse Watch', color: '#0ea5e9' },
			{ name: 'Nimbus Speaker', color: '#8b5cf6' },
			{ name: 'Flux Keyboard', color: '#10b981' },
		];

		return (
			<div className='w-full max-w-sm overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white'>
				<Carousel.Root
					loop
					className='relative'>
					<Carousel.Viewport>
						<Carousel.Content>
							{products.map((p) => (
								<Carousel.Slide
									key={p.name}
									className='w-full'>
									<div
										className='flex h-52 items-center justify-center text-5xl font-bold text-white'
										style={{ backgroundColor: p.color }}>
										{p.name[0]}
									</div>
								</Carousel.Slide>
							))}
						</Carousel.Content>
					</Carousel.Viewport>
					<div className='absolute inset-x-3 top-[104px] flex -translate-y-1/2 justify-between'>
						<Carousel.Previous className={btnCls}>‹</Carousel.Previous>
						<Carousel.Next className={btnCls}>›</Carousel.Next>
					</div>
					<div className='absolute inset-x-0 bottom-3 flex justify-center gap-2'>
						<Carousel.Indicators>
							{({ index, selected, scrollTo }) => (
								<button
									key={index}
									aria-label={`Go to product ${index + 1}`}
									onClick={scrollTo}
									className={`size-2 rounded-full transition-colors ${selected ? 'bg-white' : 'bg-white/50'}`}
								/>
							)}
						</Carousel.Indicators>
					</div>
				</Carousel.Root>
				<div className='flex items-center justify-between p-4'>
					<div>
						<p className='text-sm font-semibold text-black'>Featured gear</p>
						<p className='text-xs text-[#6b7280]'>Swipe to browse the collection</p>
					</div>
					<button className='rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-[#333]'>Shop</button>
				</div>
			</div>
		);
	},
};
