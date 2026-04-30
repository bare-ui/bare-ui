import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta = {
	title: 'Layout/Tabs',
	component: Tabs.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Accessible tabs with horizontal/vertical orientation, automatic/manual activation, and full keyboard navigation.',
			},
		},
	},
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const listCls = 'flex gap-1 border-b border-black';

const triggerCls = [
	'cursor-pointer px-4 py-2 text-sm font-medium text-black outline-none',
	'border-b-2 border-transparent -mb-px transition-colors',
	'hover:bg-[#f5f5f5]',
	'data-[state=active]:border-black data-[state=active]:font-semibold',
	'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-1',
	'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
].join(' ');

const contentCls = 'mt-4 text-sm text-black outline-none';

export const Default: Story = {
	render: () => (
		<Tabs.Root
			defaultValue='overview'
			className='w-full max-w-lg'>
			<Tabs.List className={listCls}>
				<Tabs.Trigger value='overview' className={triggerCls}>Overview</Tabs.Trigger>
				<Tabs.Trigger value='details' className={triggerCls}>Details</Tabs.Trigger>
				<Tabs.Trigger value='reviews' className={triggerCls}>Reviews</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='overview' className={contentCls}>
				A high-level summary of the product features and what makes it special.
			</Tabs.Content>
			<Tabs.Content value='details' className={contentCls}>
				Detailed specifications, dimensions, materials, and technical information.
			</Tabs.Content>
			<Tabs.Content value='reviews' className={contentCls}>
				Customer reviews and ratings from verified buyers.
			</Tabs.Content>
		</Tabs.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Tabs.Root
			defaultValue='general'
			orientation='vertical'
			className='flex w-full max-w-2xl gap-6'>
			<Tabs.List className='flex flex-col gap-1 border-r border-black pr-3 min-w-[140px]'>
				{[
					{ value: 'general', label: 'General' },
					{ value: 'profile', label: 'Profile' },
					{ value: 'security', label: 'Security' },
					{ value: 'notifications', label: 'Notifications' },
				].map((tab) => (
					<Tabs.Trigger
						key={tab.value}
						value={tab.value}
						className={[
							'cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm font-medium text-black outline-none',
							'transition-colors hover:bg-[#f5f5f5]',
							'data-[state=active]:bg-black data-[state=active]:text-white',
							'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black',
						].join(' ')}>
						{tab.label}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			<div className='flex-1'>
				<Tabs.Content value='general' className='text-sm text-black outline-none'>
					<h3 className='text-base font-semibold mb-1'>General settings</h3>
					<p className='text-[#6b7280]'>Configure language, timezone, and account preferences.</p>
				</Tabs.Content>
				<Tabs.Content value='profile' className='text-sm text-black outline-none'>
					<h3 className='text-base font-semibold mb-1'>Profile</h3>
					<p className='text-[#6b7280]'>Update your name, photo, and biography.</p>
				</Tabs.Content>
				<Tabs.Content value='security' className='text-sm text-black outline-none'>
					<h3 className='text-base font-semibold mb-1'>Security</h3>
					<p className='text-[#6b7280]'>Manage password, two-factor auth, and active sessions.</p>
				</Tabs.Content>
				<Tabs.Content value='notifications' className='text-sm text-black outline-none'>
					<h3 className='text-base font-semibold mb-1'>Notifications</h3>
					<p className='text-[#6b7280]'>Choose what events you want to be notified about.</p>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<Tabs.Root
			defaultValue='inbox'
			activationMode='manual'
			className='w-full max-w-lg rounded-[20px] border border-black bg-white overflow-hidden'>
			<Tabs.List className='flex border-b border-black bg-[#f5f5f5]'>
				{[
					{ value: 'inbox', label: 'Inbox', count: 12 },
					{ value: 'starred', label: 'Starred', count: 3 },
					{ value: 'archive', label: 'Archive', count: 0 },
				].map((tab) => (
					<Tabs.Trigger
						key={tab.value}
						value={tab.value}
						className={[
							'flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-black outline-none',
							'transition-colors hover:bg-white',
							'data-[state=active]:bg-white data-[state=active]:font-semibold',
							'data-[focus-visible]:ring-2 data-[focus-visible]:ring-inset data-[focus-visible]:ring-black',
						].join(' ')}>
						{tab.label}
						{tab.count > 0 && (
							<span className='inline-flex min-w-[20px] items-center justify-center rounded-full border border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white'>
								{tab.count}
							</span>
						)}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			<Tabs.Content value='inbox' className='p-5 text-sm text-black outline-none'>
				<p className='font-medium'>You have 12 new messages.</p>
				<p className='mt-1 text-[#6b7280]'>Use ←/→ then press Enter to switch tabs (manual activation mode).</p>
			</Tabs.Content>
			<Tabs.Content value='starred' className='p-5 text-sm text-black outline-none'>
				<p className='font-medium'>3 starred conversations.</p>
				<p className='mt-1 text-[#6b7280]'>Pinned items live here.</p>
			</Tabs.Content>
			<Tabs.Content value='archive' className='p-5 text-sm text-black outline-none'>
				<p className='font-medium'>Your archive is empty.</p>
				<p className='mt-1 text-[#6b7280]'>Messages you archive will appear here.</p>
			</Tabs.Content>
		</Tabs.Root>
	),
};
