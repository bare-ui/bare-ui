import { h } from 'vue';
import type { StoryObj } from '@storybook/vue3-vite';
import { Avatar } from '.';

export default {
	title: 'Media/Avatar',
	component: Avatar,
	tags: ['autodocs'],
};

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex -space-x-2' }, [
				h(
					Avatar.Root,
					{
						class: 'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5] ring-2 ring-white',
					},
					() => [
						h(Avatar.Image, {
							src: 'https://i.pravatar.cc/150?img=1',
							alt: 'User 1',
							class: 'size-full object-cover',
						}),
						h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => 'U1'),
					],
				),
				h(
					Avatar.Root,
					{
						class: 'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5] ring-2 ring-white',
					},
					() => [
						h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => 'JD'),
					],
				),
				h(
					Avatar.Root,
					{
						class: 'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-black ring-2 ring-white',
					},
					() => [
						h(Avatar.Fallback, { class: 'text-xs font-medium text-white' }, () => '+9'),
					],
				),
			]),
	}),
};
