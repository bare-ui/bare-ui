import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';

const meta = {
	title: 'Components/Image',
	component: Image,
	tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		src: 'https://picsum.photos/400/300',
		alt: 'Sample image',
	},
};

export const PositionLeft: Story = {
	args: {
		src: 'https://picsum.photos/400/300',
		alt: 'Left aligned image',
		position: 'left',
	},
};

export const PositionCenter: Story = {
	args: {
		src: 'https://picsum.photos/400/300',
		alt: 'Center aligned image',
		position: 'center',
	},
};

export const PositionRight: Story = {
	args: {
		src: 'https://picsum.photos/400/300',
		alt: 'Right aligned image',
		position: 'right',
	},
};
