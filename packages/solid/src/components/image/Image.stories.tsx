import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Image } from './Image';

const meta = {
	title: 'Media/Image',
	component: Image,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Image wrapper with a loader placeholder shown until the image loads.',
			},
		},
	},
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj;

const WireframePlaceholder = (props: { width?: number; height?: number }) => {
	const width = () => props.width ?? 400;
	const height = () => props.height ?? 240;
	return (
		<div
			class='relative overflow-hidden border border-black bg-[#f5f5f5] text-black'
			style={{ width: `${width()}px`, height: `${height()}px` }}>
			<svg
				viewBox='0 0 100 100'
				preserveAspectRatio='none'
				style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
				<line
					x1='0'
					y1='0'
					x2='100'
					y2='100'
					stroke='currentColor'
					stroke-width='1'
					vector-effect='non-scaling-stroke'
				/>
				<line
					x1='100'
					y1='0'
					x2='0'
					y2='100'
					stroke='currentColor'
					stroke-width='1'
					vector-effect='non-scaling-stroke'
				/>
			</svg>
		</div>
	);
};

export const Default: Story = {
	render: () => (
		<WireframePlaceholder
			width={400}
			height={240}
		/>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-6'>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2'>Left</p>
				<div class='flex justify-start'>
					<WireframePlaceholder
						width={320}
						height={200}
					/>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2'>Center</p>
				<div class='flex justify-center'>
					<WireframePlaceholder
						width={320}
						height={200}
					/>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2'>Right</p>
				<div class='flex justify-end'>
					<WireframePlaceholder
						width={320}
						height={200}
					/>
				</div>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='grid grid-cols-2 gap-4'>
			<WireframePlaceholder
				width={200}
				height={150}
			/>
			<WireframePlaceholder
				width={200}
				height={150}
			/>
			<WireframePlaceholder
				width={200}
				height={150}
			/>
			<WireframePlaceholder
				width={200}
				height={150}
			/>
		</div>
	),
};
