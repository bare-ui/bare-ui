import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For } from 'solid-js';
import { Drawer } from './Drawer';

const meta = {
	title: 'Overlays/Drawer',
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

const CloseIcon = () => (
	<svg
		class='h-5 w-5'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
	</svg>
);

export const Default: Story = {
	render: () => {
		const [open, setOpen] = createSignal(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					class='inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
					Open Drawer
				</button>

				<Drawer.Root
					open={open()}
					onOpenChange={setOpen}>
					<Drawer.Portal>
						<Drawer.Overlay class='fixed inset-0 z-50 bg-black/50'>
							<Drawer.Content class='fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-black bg-white'>
								<Drawer.Header class='flex items-center justify-between px-4 py-4'>
									<span class='text-lg font-bold text-black'>Drawer Title</span>
									<Drawer.Close class='rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Drawer.Close>
								</Drawer.Header>
								<div class='flex-1 px-4 py-2'>
									<p class='text-sm text-[#6b7280]'>
										This is a simple drawer with some content. You can place any text or elements here. Close it
										using the button above.
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

export const Composed: Story = {
	render: () => {
		const [open, setOpen] = createSignal(false);
		const [active, setActive] = createSignal('Dashboard');

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
					class='inline-flex items-center gap-2 rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
					☰ Menu
				</button>

				<Drawer.Root
					open={open()}
					onOpenChange={setOpen}>
					<Drawer.Portal>
						<Drawer.Overlay class='fixed inset-0 z-50 bg-black/50'>
							<Drawer.Content class='fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-black bg-white'>
								<Drawer.Header class='flex items-center justify-between px-4 py-4'>
									<span class='text-lg font-bold text-black'>Navigation</span>
									<Drawer.Close class='rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Drawer.Close>
								</Drawer.Header>
								<nav class='flex-1 overflow-y-auto px-2 py-2'>
									<For each={navItems}>
										{(item) => (
											<button
												onClick={() => {
													setActive(item.label);
													setOpen(false);
												}}
												class={[
													'flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors',
													active() === item.label ? 'bg-black text-white' : 'text-black hover:bg-[#f5f5f5]',
												].join(' ')}>
												<span class='text-base'>{item.icon}</span>
												{item.label}
											</button>
										)}
									</For>
								</nav>
							</Drawer.Content>
						</Drawer.Overlay>
					</Drawer.Portal>
				</Drawer.Root>
			</>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [open, setOpen] = createSignal(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					class='inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
					Edit Profile
				</button>

				<Drawer.Root
					open={open()}
					onOpenChange={setOpen}>
					<Drawer.Portal>
						<Drawer.Overlay class='fixed inset-0 z-50 bg-black/50'>
							<Drawer.Content class='fixed left-0 top-0 z-50 flex h-full w-80 flex-col border-r border-black bg-white'>
								<Drawer.Header class='flex items-center justify-between border-b border-black px-4 py-4'>
									<span class='text-lg font-bold text-black'>Edit Profile</span>
									<Drawer.Close class='rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Drawer.Close>
								</Drawer.Header>
								<div class='flex-1 overflow-y-auto px-4 py-4'>
									<div class='flex flex-col gap-4'>
										<div>
											<label class='mb-1 block text-sm font-medium text-black'>First Name</label>
											<input
												type='text'
												placeholder='Jane'
												class='w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm'
											/>
										</div>
										<div>
											<label class='mb-1 block text-sm font-medium text-black'>Last Name</label>
											<input
												type='text'
												placeholder='Doe'
												class='w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm'
											/>
										</div>
										<div>
											<label class='mb-1 block text-sm font-medium text-black'>Email</label>
											<input
												type='email'
												placeholder='jane@example.com'
												class='w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm'
											/>
										</div>
										<div>
											<label class='mb-1 block text-sm font-medium text-black'>Notes</label>
											<textarea
												placeholder='Add notes...'
												rows={4}
												class='w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm resize-none'
											/>
										</div>
									</div>
								</div>
								<div class='flex gap-3 border-t border-black px-4 py-4'>
									<Drawer.Close class='flex-1 rounded-[8px] border border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
										Cancel
									</Drawer.Close>
									<button
										onClick={() => setOpen(false)}
										class='flex-1 rounded-[8px] border border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
										Save
									</button>
								</div>
							</Drawer.Content>
						</Drawer.Overlay>
					</Drawer.Portal>
				</Drawer.Root>
			</>
		);
	},
};
