import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
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
		<Carousel.Root class='relative w-full max-w-md'>
			<Carousel.Viewport
				tabindex={0}
				class='rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-black'>
				<Carousel.Content>
					<For each={slides}>
						{(color, i) => (
							<Carousel.Slide class='w-full'>
								<div
									class='flex h-56 items-center justify-center text-3xl font-bold text-white'
									style={{ 'background-color': color }}>
									{i() + 1}
								</div>
							</Carousel.Slide>
						)}
					</For>
				</Carousel.Content>
			</Carousel.Viewport>

			<div class='absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between'>
				<Carousel.Previous class={btnCls}>‹</Carousel.Previous>
				<Carousel.Next class={btnCls}>›</Carousel.Next>
			</div>

			<div class='mt-3 flex justify-center gap-2'>
				<Carousel.Indicators>
					{({ index, selected, scrollTo }) => (
						<button
							aria-label={`Go to slide ${index + 1}`}
							onClick={scrollTo}
							class={`size-2 rounded-full transition-colors ${selected ? 'bg-black' : 'bg-[#d1d5db]'}`}
						/>
					)}
				</Carousel.Indicators>
			</div>
		</Carousel.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-10'>
			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Looping, multi-item</p>
				<Carousel.Root
					loop
					class='relative w-full max-w-2xl'>
					<Carousel.Viewport class='rounded-2xl'>
						<Carousel.Content class='gap-4 px-1'>
							<For each={Array.from({ length: 8 }, (_, i) => i)}>
								{(i) => (
									<Carousel.Slide class='w-[40%]'>
										<div class='flex h-40 items-center justify-center rounded-xl bg-[#f3f4f6] text-xl font-semibold text-black'>
											Card {i + 1}
										</div>
									</Carousel.Slide>
								)}
							</For>
						</Carousel.Content>
					</Carousel.Viewport>
					<div class='mt-3 flex justify-end gap-2'>
						<Carousel.Previous class={btnCls}>‹</Carousel.Previous>
						<Carousel.Next class={btnCls}>›</Carousel.Next>
					</div>
				</Carousel.Root>
			</div>

			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Vertical</p>
				<Carousel.Root
					orientation='vertical'
					class='relative w-full max-w-xs'>
					<Carousel.Viewport class='h-56 rounded-2xl'>
						<Carousel.Content>
							<For each={slides}>
								{(color, i) => (
									<Carousel.Slide class='h-56'>
										<div
											class='flex h-56 items-center justify-center text-3xl font-bold text-white'
											style={{ 'background-color': color }}>
											{i() + 1}
										</div>
									</Carousel.Slide>
								)}
							</For>
						</Carousel.Content>
					</Carousel.Viewport>
					<div class='absolute inset-y-3 left-1/2 flex -translate-x-1/2 flex-col justify-between'>
						<Carousel.Previous class={btnCls}>‹</Carousel.Previous>
						<Carousel.Next class={btnCls}>›</Carousel.Next>
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
			<div class='w-full max-w-sm overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white'>
				<Carousel.Root
					loop
					class='relative'>
					<Carousel.Viewport>
						<Carousel.Content>
							<For each={products}>
								{(p) => (
									<Carousel.Slide class='w-full'>
										<div
											class='flex h-52 items-center justify-center text-5xl font-bold text-white'
											style={{ 'background-color': p.color }}>
											{p.name[0]}
										</div>
									</Carousel.Slide>
								)}
							</For>
						</Carousel.Content>
					</Carousel.Viewport>
					<div class='absolute inset-x-3 top-[104px] flex -translate-y-1/2 justify-between'>
						<Carousel.Previous class={btnCls}>‹</Carousel.Previous>
						<Carousel.Next class={btnCls}>›</Carousel.Next>
					</div>
					<div class='absolute inset-x-0 bottom-3 flex justify-center gap-2'>
						<Carousel.Indicators>
							{({ index, selected, scrollTo }) => (
								<button
									aria-label={`Go to product ${index + 1}`}
									onClick={scrollTo}
									class={`size-2 rounded-full transition-colors ${selected ? 'bg-white' : 'bg-white/50'}`}
								/>
							)}
						</Carousel.Indicators>
					</div>
				</Carousel.Root>
				<div class='flex items-center justify-between p-4'>
					<div>
						<p class='text-sm font-semibold text-black'>Featured gear</p>
						<p class='text-xs text-[#6b7280]'>Swipe to browse the collection</p>
					</div>
					<button class='rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-[#333]'>Shop</button>
				</div>
			</div>
		);
	},
};
