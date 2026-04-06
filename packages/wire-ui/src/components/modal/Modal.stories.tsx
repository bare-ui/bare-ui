import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from './Modal';

const meta = {
	title: 'Components/Modal',
	component: Modal.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Dialog with portal rendering, overlay-click and Escape key close.',
			},
		},
	},
} satisfies Meta<typeof Modal.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const CloseIcon = () => (
	<svg
		className='h-5 w-5'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
	</svg>
);

const contentCls = 'w-full max-w-md overflow-hidden rounded-[20px] border-[3px] border-black bg-white';

const triggerBtnCls =
	'inline-flex items-center rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const outlineBtnCls =
	'inline-flex items-center rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]';

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
					Open Modal
				</button>

				<Modal.Root
					open={open}
					onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
							<Modal.Content className={contentCls}>
								<div className='p-6'>
									<div className='mb-4 flex items-start justify-between'>
										<h2 className='text-lg font-semibold text-black'>Modal Title</h2>
										<Modal.Close className='rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black'>
											<CloseIcon />
										</Modal.Close>
									</div>
									<p className='mb-6 text-sm text-[#9ca3af]'>
										This is a basic modal dialog. Press Escape or click outside to close.
									</p>
									<div className='flex justify-end gap-3'>
										<Modal.Close className={outlineBtnCls}>Close</Modal.Close>
									</div>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		);
	},
};

export const ConfirmDialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [confirmed, setConfirmed] = useState(false);

		const handleConfirm = () => {
			setConfirmed(true);
			setOpen(false);
		};

		return (
			<>
				<div className='flex flex-col items-start gap-3'>
					<button
						onClick={() => setOpen(true)}
						className={triggerBtnCls}>
						Delete Account
					</button>
					{confirmed && <p className='text-sm text-black'>✓ Action confirmed</p>}
				</div>

				<Modal.Root
					open={open}
					onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
							<Modal.Content className='w-full max-w-sm overflow-hidden rounded-[20px] border-[3px] border-black bg-white p-6'>
								<div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5]'>
									<svg
										className='h-6 w-6 text-black'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
										/>
									</svg>
								</div>
								<h2 className='mb-2 text-base font-semibold text-black'>Delete Account</h2>
								<p className='mb-6 text-sm text-[#9ca3af]'>
									Are you sure you want to delete your account? All of your data will be permanently
									removed. This action cannot be undone.
								</p>
								<div className='flex gap-3'>
									<Modal.Close className='flex-1 rounded-[8px] border-2 border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
										Cancel
									</Modal.Close>
									<button
										onClick={handleConfirm}
										className='flex-1 rounded-[8px] border-2 border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
										Delete
									</button>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		);
	},
};

export const FormModal: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className={triggerBtnCls}>
					Edit Profile
				</button>

				<Modal.Root
					open={open}
					onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
							<Modal.Content className={contentCls}>
								<div className='flex items-center justify-between border-b border-[#d4d4d4] px-6 py-4'>
									<h2 className='text-base font-semibold text-black'>Edit Profile</h2>
									<Modal.Close className='rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Modal.Close>
								</div>

								<div className='space-y-4 p-6'>
									<div className='flex items-center gap-4'>
										<div className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-black text-xl font-bold text-white'>
											JD
										</div>
										<button className='rounded-[8px] border-2 border-black px-3 py-1.5 text-xs font-medium text-black hover:bg-[#f5f5f5]'>
											Change photo
										</button>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='mb-1 block text-xs font-medium text-black'>
												First name
											</label>
											<input
												type='text'
												defaultValue='Jane'
												className={inputFieldCls}
											/>
										</div>
										<div>
											<label className='mb-1 block text-xs font-medium text-black'>
												Last name
											</label>
											<input
												type='text'
												defaultValue='Doe'
												className={inputFieldCls}
											/>
										</div>
									</div>

									<div>
										<label className='mb-1 block text-xs font-medium text-black'>Email</label>
										<input
											type='email'
											defaultValue='jane@example.com'
											className={inputFieldCls}
										/>
									</div>

									<div>
										<label className='mb-1 block text-xs font-medium text-black'>Bio</label>
										<textarea
											rows={3}
											defaultValue='Product designer and coffee enthusiast.'
											className={inputFieldCls}
										/>
									</div>
								</div>

								<div className='flex justify-end gap-3 border-t border-[#d4d4d4] px-6 py-4'>
									<Modal.Close className={outlineBtnCls}>Cancel</Modal.Close>
									<button
										onClick={() => setOpen(false)}
										className={triggerBtnCls}>
										Save changes
									</button>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		);
	},
};

export const AlertModal: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className={triggerBtnCls}>
					Show Alert
				</button>

				<Modal.Root
					open={open}
					onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
							<Modal.Content className='w-full max-w-sm overflow-hidden rounded-[20px] border-[3px] border-black bg-white p-6'>
								<div className='text-center'>
									<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f5]'>
										<svg
											className='h-7 w-7 text-black'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
									</div>
									<h2 className='mb-2 text-base font-semibold text-black'>Session Expiring</h2>
									<p className='mb-6 text-sm text-[#9ca3af]'>
										Your session will expire in 5 minutes. Would you like to extend it?
									</p>
									<div className='flex gap-3'>
										<Modal.Close className='flex-1 rounded-[8px] border-2 border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
											Sign out
										</Modal.Close>
										<button
											onClick={() => setOpen(false)}
											className='flex-1 rounded-[8px] border-2 border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
											Stay signed in
										</button>
									</div>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		);
	},
};

export const LargeContentModal: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className={outlineBtnCls}>
					Terms &amp; Conditions
				</button>

				<Modal.Root
					open={open}
					onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center'>
							<Modal.Content className='flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-[20px] border-[3px] border-black bg-white'>
								<div className='flex items-center justify-between border-b border-[#d4d4d4] px-6 py-4'>
									<h2 className='text-base font-semibold text-black'>Terms &amp; Conditions</h2>
									<Modal.Close className='rounded p-1 text-[#9ca3af] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Modal.Close>
								</div>

								<div className='flex-1 overflow-y-auto p-6'>
									{Array.from({ length: 6 }, (_, i) => (
										<div
											key={i}
											className='mb-4'>
											<h3 className='mb-2 text-sm font-semibold text-black'>
												{i + 1}.{' '}
												{
													[
														'Acceptance',
														'Usage',
														'Privacy',
														'Limitations',
														'Changes',
														'Contact',
													][i]
												}
											</h3>
											<p className='text-sm leading-relaxed text-[#9ca3af]'>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
												tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
												veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
												commodo consequat.
											</p>
										</div>
									))}
								</div>

								<div className='flex justify-end gap-3 border-t border-[#d4d4d4] px-6 py-4'>
									<Modal.Close className={outlineBtnCls}>Decline</Modal.Close>
									<button
										onClick={() => setOpen(false)}
										className={triggerBtnCls}>
										Accept &amp; Continue
									</button>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		);
	},
};
