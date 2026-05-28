import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta = {
	title: 'Layout/Divider',
	component: Divider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Horizontal or vertical separator line.',
			},
		},
	},
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className='flex flex-col gap-8'>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Horizontal</p>
				<div className='flex flex-col gap-3'>
					<p className='text-sm text-black'>Item one</p>
					<Divider className='h-px w-full bg-black' />
					<p className='text-sm text-black'>Item two</p>
					<Divider className='h-px w-full bg-black' />
					<p className='text-sm text-black'>Item three</p>
				</div>
			</div>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Vertical</p>
				<div className='flex h-6 items-center gap-3'>
					<span className='text-sm text-black'>Home</span>
					<Divider
						orientation='vertical'
						className='h-full w-px bg-black'
					/>
					<span className='text-sm text-black'>About</span>
					<Divider
						orientation='vertical'
						className='h-full w-px bg-black'
					/>
					<span className='text-sm text-black'>Contact</span>
				</div>
			</div>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>With label</p>
				<div className='flex w-64 items-center gap-3'>
					<Divider className='h-px flex-1 bg-black' />
					<span className='text-xs font-medium text-[#6b7280]'>OR</span>
					<Divider className='h-px flex-1 bg-black' />
				</div>
			</div>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div className='flex w-64 flex-col gap-6'>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Thin</p>
				<Divider className='h-px w-full bg-[#e5e7eb]' />
			</div>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Thick</p>
				<Divider className='h-1 w-full rounded-full bg-black' />
			</div>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Dashed</p>
				<Divider className='w-full border-t border-dashed border-[#9ca3af]' />
			</div>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Inset</p>
				<Divider className='ml-8 h-px w-[calc(100%-2rem)] bg-black' />
			</div>
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>
					Semantic (separator role)
				</p>
				<Divider
					decorative={false}
					className='h-px w-full bg-black'
				/>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div className='w-80 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white'>
			<div className='p-4'>
				<p className='text-sm font-semibold text-black'>Account</p>
				<p className='text-xs text-[#6b7280]'>jane@example.com</p>
			</div>
			<Divider className='h-px w-full bg-[#e5e7eb]' />
			<nav className='flex flex-col py-1'>
				{['Profile', 'Billing', 'Notifications'].map((item) => (
					<a
						key={item}
						href='#'
						onClick={(e) => e.preventDefault()}
						className='px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
						{item}
					</a>
				))}
			</nav>
			<Divider className='h-px w-full bg-[#e5e7eb]' />
			<div className='flex items-center justify-between p-3'>
				<div className='flex h-5 items-center gap-3 text-xs text-[#6b7280]'>
					<a
						href='#'
						onClick={(e) => e.preventDefault()}
						className='hover:text-black'>
						Help
					</a>
					<Divider
						orientation='vertical'
						className='h-full w-px bg-[#d1d5db]'
					/>
					<a
						href='#'
						onClick={(e) => e.preventDefault()}
						className='hover:text-black'>
						Privacy
					</a>
					<Divider
						orientation='vertical'
						className='h-full w-px bg-[#d1d5db]'
					/>
					<a
						href='#'
						onClick={(e) => e.preventDefault()}
						className='hover:text-black'>
						Terms
					</a>
				</div>
				<button className='text-xs font-medium text-black hover:underline'>Sign out</button>
			</div>
		</div>
	),
};
