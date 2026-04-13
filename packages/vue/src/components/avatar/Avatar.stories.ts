import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Avatar } from '.';

const meta = {
	title: 'Components/Avatar',
	component: Avatar.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Avatar with image loading state and fallback support.',
			},
		},
	},
} satisfies Meta<typeof Avatar.Root>;

export default meta;

const rootCls = 'relative inline-flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5]';
const imgCls = 'size-full object-cover';
const fallbackCls = 'text-sm font-bold text-black';

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Avatar.Root, { class: rootCls }, () => [
				h(Avatar.Image, { src: 'https://i.pravatar.cc/96?u=1', alt: 'Jane Doe', class: imgCls }),
				h(Avatar.Fallback, { class: fallbackCls }, () => 'JD'),
			]),
	}),
};

export const Fallback: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Avatar.Root, { class: rootCls }, () => [
				h(Avatar.Image, { src: 'https://broken.invalid/img.jpg', alt: 'Broken' }),
				h(Avatar.Fallback, { class: fallbackCls }, () => 'JD'),
			]),
	}),
};

export const NoSrc: StoryObj = {
	render: () => ({
		setup: () => () =>
			h(Avatar.Root, { class: rootCls }, () => [
				h(Avatar.Image, {}),
				h(Avatar.Fallback, { class: fallbackCls }, () => 'NA'),
			]),
	}),
};
