import type { StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

export default {
	title: 'Media/Avatar',
	component: Avatar,
	subcomponents: {
		'Avatar.Image': Avatar.Image,
		'Avatar.Fallback': Avatar.Fallback,
	},
	tags: ['autodocs'],
};

export const Default: StoryObj = {
	render: () => (
		<div className='flex -space-x-2'>
			<Avatar.Root className='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5] ring-2 ring-white'>
				<Avatar.Image
					src='https://i.pravatar.cc/150?img=1'
					alt='User 1'
					className='size-full object-cover'
				/>
				<Avatar.Fallback className='text-sm font-medium text-black select-none'>U1</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root className='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5] ring-2 ring-white'>
				<Avatar.Fallback className='text-sm font-medium text-black select-none'>JD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root className='relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-black ring-2 ring-white'>
				<Avatar.Fallback className='text-xs font-medium text-white'>+9</Avatar.Fallback>
			</Avatar.Root>
		</div>
	),
};

const rootCls =
	'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5]';

export const Composed: StoryObj = {
	render: () => (
		<div className='flex items-end gap-6'>
			{/* Loaded image */}
			<div className='flex flex-col items-center gap-2'>
				<Avatar.Root className={`${rootCls} size-10`}>
					<Avatar.Image
						src='https://i.pravatar.cc/150?img=5'
						alt='Loaded'
						className='size-full object-cover'
					/>
					<Avatar.Fallback className='text-sm font-medium text-black select-none'>AB</Avatar.Fallback>
				</Avatar.Root>
				<span className='text-xs text-[#6b7280]'>Image</span>
			</div>

			{/* Initials fallback */}
			<div className='flex flex-col items-center gap-2'>
				<Avatar.Root className={`${rootCls} size-10`}>
					<Avatar.Fallback className='text-sm font-medium text-black select-none'>JD</Avatar.Fallback>
				</Avatar.Root>
				<span className='text-xs text-[#6b7280]'>Initials</span>
			</div>

			{/* Broken src falls back */}
			<div className='flex flex-col items-center gap-2'>
				<Avatar.Root className={`${rootCls} size-10`}>
					<Avatar.Image
						src='https://invalid.example/nope.png'
						alt='Broken'
						className='size-full object-cover'
					/>
					<Avatar.Fallback className='text-sm font-medium text-black select-none'>!</Avatar.Fallback>
				</Avatar.Root>
				<span className='text-xs text-[#6b7280]'>Error</span>
			</div>

			{/* Sizes */}
			<div className='flex flex-col items-center gap-2'>
				<div className='flex items-end gap-2'>
					<Avatar.Root className={`${rootCls} size-6`}>
						<Avatar.Image
							src='https://i.pravatar.cc/150?img=8'
							alt='Small'
							className='size-full object-cover'
						/>
						<Avatar.Fallback className='text-[10px] font-medium text-black select-none'>S</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root className={`${rootCls} size-10`}>
						<Avatar.Image
							src='https://i.pravatar.cc/150?img=8'
							alt='Medium'
							className='size-full object-cover'
						/>
						<Avatar.Fallback className='text-sm font-medium text-black select-none'>M</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root className={`${rootCls} size-16`}>
						<Avatar.Image
							src='https://i.pravatar.cc/150?img=8'
							alt='Large'
							className='size-full object-cover'
						/>
						<Avatar.Fallback className='text-lg font-medium text-black select-none'>L</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<span className='text-xs text-[#6b7280]'>Sizes</span>
			</div>
		</div>
	),
};

export const Complex: StoryObj = {
	render: () => {
		const members = [
			{ name: 'Ada Lovelace', role: 'Engineering', img: 'https://i.pravatar.cc/150?img=1', online: true },
			{ name: 'Grace Hopper', role: 'Design', img: '', online: true },
			{ name: 'Alan Turing', role: 'Research', img: 'https://i.pravatar.cc/150?img=12', online: false },
		];

		const initials = (name: string) =>
			name
				.split(' ')
				.map((n) => n[0])
				.join('');

		return (
			<div className='w-72 rounded-xl border border-[#e5e7eb] bg-white p-2'>
				<p className='px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-[#6b7280]'>Team</p>
				{members.map((m) => (
					<div
						key={m.name}
						className='flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#f5f5f5]'>
						<div className='relative'>
							<Avatar.Root className={`${rootCls} size-10`}>
								<Avatar.Image
									src={m.img}
									alt={m.name}
									className='size-full object-cover'
								/>
								<Avatar.Fallback className='text-sm font-medium text-black select-none'>
									{initials(m.name)}
								</Avatar.Fallback>
							</Avatar.Root>
							<span
								className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white ${
									m.online ? 'bg-green-500' : 'bg-[#9ca3af]'
								}`}
							/>
						</div>
						<div className='min-w-0'>
							<p className='truncate text-sm font-medium text-black'>{m.name}</p>
							<p className='truncate text-xs text-[#6b7280]'>{m.role}</p>
						</div>
					</div>
				))}
			</div>
		);
	},
};
