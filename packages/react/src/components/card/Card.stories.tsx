import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
	title: 'Layout/Card',
	component: Card,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Unstyled container with optional data-color and data-size attributes.',
			},
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const WireframePlaceholder = ({ height = 160 }: { height?: number }) => (
	<div
		className='relative overflow-hidden bg-[#f5f5f5] text-black'
		style={{ width: '100%', height }}>
		<svg
			viewBox='0 0 100 100'
			preserveAspectRatio='none'
			style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
			<line x1='0' y1='0' x2='100' y2='100' stroke='currentColor' strokeWidth='1' vectorEffect='non-scaling-stroke' />
			<line x1='100' y1='0' x2='0' y2='100' stroke='currentColor' strokeWidth='1' vectorEffect='non-scaling-stroke' />
		</svg>
	</div>
);

export const Default: Story = {
	render: () => (
		<Card className='w-full max-w-sm rounded-[8px] border border-black bg-white p-5'>
			<h3 className='text-sm font-semibold text-black mb-1'>Card Title</h3>
			<p className='text-sm text-[#6b7280]'>
				This is a basic card component with a title and description. Use it to group related content together.
			</p>
		</Card>
	),
};

export const Composed: Story = {
	render: () => (
		<Card className='w-full max-w-sm rounded-[8px] border border-black bg-white p-4 flex items-center gap-4'>
			<div className='relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5]'>
				<span className='text-sm font-semibold text-black select-none'>W</span>
			</div>
			<div>
				<h3 className='text-sm font-semibold text-black'>Wire UI</h3>
				<p className='text-xs text-[#6b7280]'>Wireframe primitives for modern frameworks</p>
			</div>
		</Card>
	),
};

export const Complex: Story = {
	render: () => (
		<Card className='w-full max-w-sm overflow-hidden rounded-[20px] border border-black bg-white'>
			<WireframePlaceholder height={180} />
			<div className='p-5'>
				<h3 className='text-sm font-semibold text-black mb-1'>Product Name</h3>
				<p className='text-sm text-[#6b7280] mb-4'>
					A short description of the product with key details about what makes it special.
				</p>
				<div className='flex items-center justify-between'>
					<span className='text-base font-bold text-black'>$49.99</span>
					<button className='inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333]'>
						Add to Cart
					</button>
				</div>
			</div>
		</Card>
	),
};
