import type { StoryObj } from 'storybook-solidjs-vite';
import { Avatar } from './Avatar';

export default {
	title: 'Media/Avatar',
	component: Avatar,
	tags: ['autodocs'],
};

export const Default: StoryObj = {
	render: () => (
		<div class='flex -space-x-2'>
			<Avatar.Root class='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5] ring-2 ring-white'>
				<Avatar.Image
					src='https://i.pravatar.cc/150?img=1'
					alt='User 1'
					class='size-full object-cover'
				/>
				<Avatar.Fallback class='text-sm font-medium text-black select-none'>U1</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root class='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5] ring-2 ring-white'>
				<Avatar.Fallback class='text-sm font-medium text-black select-none'>JD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root class='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-black ring-2 ring-white'>
				<Avatar.Fallback class='text-xs font-medium text-white'>+9</Avatar.Fallback>
			</Avatar.Root>
		</div>
	),
};
