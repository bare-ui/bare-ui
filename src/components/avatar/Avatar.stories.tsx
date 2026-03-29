import type { StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

export default {
	title: 'Components/Avatar',
	component: Avatar,
	tags: ['autodocs'],
}

// Shared Tailwind classes reused across stories
const rootCls = [
	'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full',
	'bg-gray-200',
	'[data-status=error]:bg-indigo-100',
].join(' ')

const imgCls = 'size-full object-cover'

const fallbackCls = 'text-sm font-medium text-indigo-700 select-none'

// ---------------------------------------------------------------------------
// Default — image loads successfully
// ---------------------------------------------------------------------------

export const Default: StoryObj = {
	render: () => (
		<Avatar.Root className={rootCls}>
			<Avatar.Image src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" className={imgCls} />
			<Avatar.Fallback className={fallbackCls}>JD</Avatar.Fallback>
		</Avatar.Root>
	),
}

// ---------------------------------------------------------------------------
// Fallback — broken src triggers error state
// ---------------------------------------------------------------------------

export const Fallback: StoryObj = {
	render: () => (
		<Avatar.Root className={rootCls}>
			<Avatar.Image src="https://broken.invalid/image.png" alt="Unknown" className={imgCls} />
			<Avatar.Fallback className={fallbackCls}>AB</Avatar.Fallback>
		</Avatar.Root>
	),
}

// ---------------------------------------------------------------------------
// No src — fallback renders immediately (no image provided)
// ---------------------------------------------------------------------------

export const NoSrc: StoryObj = {
	render: () => (
		<Avatar.Root className={rootCls}>
			<Avatar.Image src="" alt="" className={imgCls} />
			<Avatar.Fallback className={fallbackCls}>?</Avatar.Fallback>
		</Avatar.Root>
	),
}

// ---------------------------------------------------------------------------
// Delayed fallback — avoids flash on fast-loading images
// ---------------------------------------------------------------------------

export const DelayedFallback: StoryObj = {
	render: () => (
		<Avatar.Root className={rootCls}>
			{/* Intentionally broken to trigger fallback after delay */}
			<Avatar.Image src="https://broken.invalid/slow.png" alt="" className={imgCls} />
			<Avatar.Fallback delayMs={600} className={fallbackCls}>
				CD
			</Avatar.Fallback>
		</Avatar.Root>
	),
}

// ---------------------------------------------------------------------------
// Overflow count — the "+N" use case (no image needed)
// ---------------------------------------------------------------------------

export const OverflowCount: StoryObj = {
	render: () => (
		<Avatar.Root
			className={[
				'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full',
				'bg-indigo-600',
			].join(' ')}
		>
			<Avatar.Fallback className="text-sm font-medium text-white select-none">
				+5
			</Avatar.Fallback>
		</Avatar.Root>
	),
}

// ---------------------------------------------------------------------------
// Sizes — driven purely by className
// ---------------------------------------------------------------------------

export const Sizes: StoryObj = {
	render: () => (
		<div className="flex items-end gap-4">
			{(['size-6', 'size-8', 'size-10', 'size-14', 'size-20'] as const).map((size) => (
				<Avatar.Root
					key={size}
					className={[
						`relative inline-flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full`,
						'bg-gray-200',
					].join(' ')}
				>
					<Avatar.Image
						src="https://i.pravatar.cc/150?img=3"
						alt="Jane Doe"
						className="size-full object-cover"
					/>
					<Avatar.Fallback className="text-xs font-medium text-gray-500">
						JD
					</Avatar.Fallback>
				</Avatar.Root>
			))}
		</div>
	),
}

// ---------------------------------------------------------------------------
// Group — a row of overlapping avatars
// ---------------------------------------------------------------------------

export const Group: StoryObj = {
	render: () => {
		const users = [
			{ src: 'https://i.pravatar.cc/150?img=1', name: 'User 1', initials: 'U1' },
			{ src: 'https://i.pravatar.cc/150?img=2', name: 'User 2', initials: 'U2' },
			{ src: 'https://i.pravatar.cc/150?img=3', name: 'User 3', initials: 'U3' },
			{ src: 'https://broken.invalid/img.png', name: 'User 4', initials: 'U4' },
		]

		return (
			<div className="flex -space-x-2">
				{users.map((user) => (
					<Avatar.Root
						key={user.name}
						className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 ring-2 ring-white"
					>
						<Avatar.Image
							src={user.src}
							alt={user.name}
							className="size-full object-cover"
						/>
						<Avatar.Fallback className="text-xs font-medium text-indigo-700">
							{user.initials}
						</Avatar.Fallback>
					</Avatar.Root>
				))}
				<Avatar.Root className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 ring-2 ring-white">
					<Avatar.Fallback className="text-xs font-medium text-white">+9</Avatar.Fallback>
				</Avatar.Root>
			</div>
		)
	},
}

// ---------------------------------------------------------------------------
// Square — rounded-md instead of rounded-full
// ---------------------------------------------------------------------------

export const Square: StoryObj = {
	render: () => (
		<Avatar.Root
			className={[
				'relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md',
				'bg-gray-200',
			].join(' ')}
		>
			<Avatar.Image src="https://i.pravatar.cc/150?img=5" alt="User" className={imgCls} />
			<Avatar.Fallback className={fallbackCls}>AB</Avatar.Fallback>
		</Avatar.Root>
	),
}
