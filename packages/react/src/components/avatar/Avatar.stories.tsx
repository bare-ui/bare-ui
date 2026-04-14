import type { StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

export default {
	title: 'Components/Avatar',
	component: Avatar,
	tags: ['autodocs'],
};

export const Default: StoryObj = {
	render: () => (
		<div className='flex -space-x-2'>
			<Avatar.Root className='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5] ring-2 ring-white'>
				<Avatar.Image src='https://i.pravatar.cc/150?img=1' alt='User 1' className='size-full object-cover' />
				<Avatar.Fallback className='text-sm font-medium text-black select-none'>U1</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root className='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5] ring-2 ring-white'>
				<Avatar.Fallback className='text-sm font-medium text-black select-none'>JD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root className='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-black ring-2 ring-white'>
				<Avatar.Fallback className='text-xs font-medium text-white'>+9</Avatar.Fallback>
			</Avatar.Root>
		</div>
	),
};
