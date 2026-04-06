import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Drawer } from './Drawer';

const meta = {
	title: 'Components/Drawer',
	component: Drawer.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Side-panel overlay with portal rendering and close behaviours.',
			},
		},
	},
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shared close icon
const CloseIcon = () => (
	<svg
		className='h-5 w-5'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
	</svg>
);

const triggerBtnCls =
	'inline-flex items-center gap-2 rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const inputFieldCls =
	'w-full rounded-[8px] border-2 border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black focus:ring-offset-1';

export const Default: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className={triggerBtnCls}>
					Open Drawer
				</button>

				<Drawer.Root
					open={open}
					onOpenChange={setOpen}>
					<Drawer.Portal>
						<Drawer.Overlay className='fixed inset-0 z-50 bg-black/50'>
							<Drawer.Content className='fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l-[3px] border-black bg-white'>
								<Drawer.Header className='flex items-center justify-between border-b border-[#d4d4d4] px-4 py-3'>
									<h2 className='text-lg font-semibold text-black'>Drawer</h2>
									<Drawer.Close className='rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Drawer.Close>
								</Drawer.Header>
								<div className='flex-1 overflow-y-auto p-4'>
									<p className='text-sm text-[#9ca3af]'>
										This is a simple drawer. Click the overlay or the close button to dismiss it.
									</p>
								</div>
							</Drawer.Content>
						</Drawer.Overlay>
					</Drawer.Portal>
				</Drawer.Root>
			</>
		);
	},
};

export const NavigationDrawer: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [active, setActive] = useState('Dashboard');

		const navItems = [
			{ label: 'Dashboard', icon: '🏠' },
			{ label: 'Analytics', icon: '📊' },
			{ label: 'Projects', icon: '📁' },
			{ label: 'Team', icon: '👥' },
			{ label: 'Messages', icon: '💬' },
			{ label: 'Settings', icon: '⚙️' },
		];

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className='inline-flex items-center gap-2 rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
					☰ Menu
				</button>

				<Drawer.Root
					open={open}
					onOpenChange={setOpen}>
					<Drawer.Portal>
						<Drawer.Overlay className='fixed inset-0 z-50 bg-black/40'>
							<Drawer.Content className='fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r-[3px] border-black bg-white'>
								<Drawer.Header className='flex items-center justify-between px-4 py-4'>
									<span className='text-lg font-bold text-black'>MyApp</span>
									<Drawer.Close className='rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Drawer.Close>
								</Drawer.Header>

								<nav className='flex-1 overflow-y-auto px-2 py-2'>
									{navItems.map(({ label, icon }) => (
										<button
											key={label}
											onClick={() => {
												setActive(label);
												setOpen(false);
											}}
											className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors ${
												active === label
													? 'bg-black text-white'
													: 'text-black hover:bg-[#f5f5f5]'
											}`}>
											<span className='text-base'>{icon}</span>
											{label}
										</button>
									))}
								</nav>

								<div className='border-t border-[#d4d4d4] p-4'>
									<div className='flex items-center gap-3'>
										<div className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-black text-sm font-semibold text-white'>
											JD
										</div>
										<div>
											<p className='text-sm font-medium text-black'>Jane Doe</p>
											<p className='text-xs text-[#9ca3af]'>jane@example.com</p>
										</div>
									</div>
								</div>
							</Drawer.Content>
						</Drawer.Overlay>
					</Drawer.Portal>
				</Drawer.Root>
			</>
		);
	},
};

export const FilterDrawer: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [filters, setFilters] = useState({
			inStock: false,
			onSale: false,
			newArrivals: false,
		});
		const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

		const toggle = (key: keyof typeof filters) => setFilters((prev) => ({ ...prev, [key]: !prev[key] }));

		const activeCount = Object.values(filters).filter(Boolean).length;

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className='inline-flex items-center gap-2 rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
					<svg
						className='h-4 w-4'
						viewBox='0 0 20 20'
						fill='currentColor'>
						<path
							fillRule='evenodd'
							d='M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z'
							clipRule='evenodd'
						/>
					</svg>
					Filters
					{activeCount > 0 && (
						<span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white'>
							{activeCount}
						</span>
					)}
				</button>

				<Drawer.Root
					open={open}
					onOpenChange={setOpen}>
					<Drawer.Portal>
						<Drawer.Overlay className='fixed inset-0 z-50 bg-black/40'>
							<Drawer.Content className='fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l-[3px] border-black bg-white'>
								<Drawer.Header className='flex items-center justify-between border-b border-[#d4d4d4] px-4 py-3'>
									<h2 className='text-base font-semibold text-black'>Filters</h2>
									<Drawer.Close className='rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Drawer.Close>
								</Drawer.Header>

								<div className='flex-1 overflow-y-auto divide-y divide-[#d4d4d4]'>
									<div className='p-4'>
										<h3 className='mb-3 text-sm font-medium text-black'>Availability</h3>
										<div className='space-y-2'>
											{(Object.keys(filters) as (keyof typeof filters)[]).map((key) => (
												<label
													key={key}
													className='flex cursor-pointer items-center gap-2.5'>
													<input
														type='checkbox'
														checked={filters[key]}
														onChange={() => toggle(key)}
														className='h-4 w-4 rounded border-2 border-black accent-black'
													/>
													<span className='text-sm text-black capitalize'>
														{key.replace(/([A-Z])/g, ' $1').trim()}
													</span>
												</label>
											))}
										</div>
									</div>

									<div className='p-4'>
										<h3 className='mb-3 text-sm font-medium text-black'>Price Range</h3>
										<div className='flex items-center gap-2 text-sm text-[#9ca3af]'>
											<span>${priceRange[0]}</span>
											<span>–</span>
											<span>${priceRange[1]}</span>
										</div>
										<input
											type='range'
											min={0}
											max={500}
											value={priceRange[1]}
											onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
											className='mt-2 w-full accent-black'
										/>
									</div>
								</div>

								<div className='border-t border-[#d4d4d4] p-4'>
									<div className='flex gap-3'>
										<button
											onClick={() =>
												setFilters({
													inStock: false,
													onSale: false,
													newArrivals: false,
												})
											}
											className='flex-1 rounded-[8px] border-2 border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
											Clear all
										</button>
										<button
											onClick={() => setOpen(false)}
											className='flex-1 rounded-[8px] border-2 border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
											Apply filters
										</button>
									</div>
								</div>
							</Drawer.Content>
						</Drawer.Overlay>
					</Drawer.Portal>
				</Drawer.Root>
			</>
		);
	},
};

export const FormDrawer: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className={triggerBtnCls}>
					+ Add Contact
				</button>

				<Drawer.Root
					open={open}
					onOpenChange={setOpen}>
					<Drawer.Portal>
						<Drawer.Overlay className='fixed inset-0 z-50 bg-black/40'>
							<Drawer.Content className='fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l-[3px] border-black bg-white'>
								<Drawer.Header className='flex items-center justify-between border-b border-[#d4d4d4] px-5 py-4'>
									<h2 className='text-base font-semibold text-black'>New Contact</h2>
									<Drawer.Close className='rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Drawer.Close>
								</Drawer.Header>

								<div className='flex-1 overflow-y-auto p-5'>
									<div className='space-y-4'>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<label className='mb-1 block text-xs font-medium text-black'>
													First name
												</label>
												<input
													type='text'
													className={inputFieldCls}
													placeholder='Jane'
												/>
											</div>
											<div>
												<label className='mb-1 block text-xs font-medium text-black'>
													Last name
												</label>
												<input
													type='text'
													className={inputFieldCls}
													placeholder='Doe'
												/>
											</div>
										</div>
										<div>
											<label className='mb-1 block text-xs font-medium text-black'>Email</label>
											<input
												type='email'
												className={inputFieldCls}
												placeholder='jane@example.com'
											/>
										</div>
										<div>
											<label className='mb-1 block text-xs font-medium text-black'>Phone</label>
											<input
												type='tel'
												className={inputFieldCls}
												placeholder='+1 (555) 000-0000'
											/>
										</div>
										<div>
											<label className='mb-1 block text-xs font-medium text-black'>Notes</label>
											<textarea
												rows={3}
												className={inputFieldCls}
												placeholder='Any additional notes...'
											/>
										</div>
									</div>
								</div>

								<div className='border-t border-[#d4d4d4] p-5'>
									<div className='flex gap-3'>
										<Drawer.Close className='flex-1 rounded-[8px] border-2 border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
											Cancel
										</Drawer.Close>
										<button className='flex-1 rounded-[8px] border-2 border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
											Save Contact
										</button>
									</div>
								</div>
							</Drawer.Content>
						</Drawer.Overlay>
					</Drawer.Portal>
				</Drawer.Root>
			</>
		);
	},
};
