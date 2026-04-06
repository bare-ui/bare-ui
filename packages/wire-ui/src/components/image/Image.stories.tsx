import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';

const meta = {
	title: 'Components/Image',
	component: Image,
	tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Wireframe placeholder — grey box with diagonal X cross (no network request)
// ---------------------------------------------------------------------------

const WireframePlaceholder = ({ width = 400, height = 240 }: { width?: number; height?: number }) => (
	<div
		style={{
			width,
			height,
			position: 'relative',
			background: '#f5f5f5',
			border: '2px solid #000',
			overflow: 'hidden',
		}}>
		<svg
			viewBox='0 0 100 100'
			preserveAspectRatio='none'
			style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
			<line x1='0' y1='0' x2='100' y2='100' stroke='#000' strokeWidth='2' vectorEffect='non-scaling-stroke' />
			<line x1='100' y1='0' x2='0' y2='100' stroke='#000' strokeWidth='2' vectorEffect='non-scaling-stroke' />
		</svg>
	</div>
);

export const Default: Story = {
	render: () => <WireframePlaceholder />,
};

export const PositionLeft: Story = {
	render: () => (
		<div className='flex justify-start'>
			<WireframePlaceholder width={320} height={200} />
		</div>
	),
};

export const PositionCenter: Story = {
	render: () => (
		<div className='flex justify-center'>
			<WireframePlaceholder width={320} height={200} />
		</div>
	),
};

export const PositionRight: Story = {
	render: () => (
		<div className='flex justify-end'>
			<WireframePlaceholder width={320} height={200} />
		</div>
	),
};
