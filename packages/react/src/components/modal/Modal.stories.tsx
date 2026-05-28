import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';

const meta = {
	title: 'Overlays/Modal',
	component: Modal.Root,
	subcomponents: {
		'Modal.Overlay': Modal.Overlay,
		'Modal.Content': Modal.Content,
		'Modal.Close': Modal.Close,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Accessible dialog overlay with portal rendering.',
			},
		},
	},
} satisfies Meta<typeof Modal.Root>;

export default meta;

const CloseIcon = () => (
	<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
		<path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
	</svg>
);

export const Default: StoryObj = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className='inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
					Show Notification
				</button>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
							<Modal.Content className='w-full max-w-md overflow-hidden rounded-[20px] border border-black bg-white p-6'>
								<h2 className='mb-2 text-base font-semibold text-black'>Notification</h2>
								<p className='mb-6 text-sm text-[#6b7280]'>
									Your changes have been saved successfully. You can continue working or close this dialog.
								</p>
								<Modal.Close className='w-full rounded-[8px] border border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
									Close
								</Modal.Close>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		);
	},
};

export const Composed: StoryObj = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className='inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
					Delete Account
				</button>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
							<Modal.Content className='w-full max-w-md overflow-hidden rounded-[20px] border border-black bg-white p-6'>
								<div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5]'>
									<svg className='h-6 w-6 text-black' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
										/>
									</svg>
								</div>
								<h2 className='mb-2 text-base font-semibold text-black'>Delete Account</h2>
								<p className='mb-6 text-sm text-[#6b7280]'>
									Are you sure you want to delete your account? All of your data will be permanently removed. This action
									cannot be undone.
								</p>
								<div className='flex gap-3'>
									<Modal.Close className='flex-1 rounded-[8px] border border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
										Cancel
									</Modal.Close>
									<button
										onClick={() => setOpen(false)}
										className='flex-1 rounded-[8px] border border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
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

export const Complex: StoryObj = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className='inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'>
					Edit Profile
				</button>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
							<Modal.Content className='w-full max-w-md overflow-hidden rounded-[20px] border border-black bg-white'>
								<div className='flex items-center justify-between border-b border-black px-6 py-4'>
									<h2 className='text-base font-semibold text-black'>Edit Profile</h2>
									<Modal.Close className='rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black'>
										<CloseIcon />
									</Modal.Close>
								</div>
								<div className='flex flex-col gap-4 px-6 py-4'>
									<div>
										<label className='mb-1 block text-sm font-medium text-black'>Name</label>
										<input type='text' placeholder='Jane Doe' className='w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm' />
									</div>
									<div>
										<label className='mb-1 block text-sm font-medium text-black'>Email</label>
										<input type='email' placeholder='jane@example.com' className='w-full bg-white border border-black rounded-[8px] px-3 py-2 text-sm' />
									</div>
								</div>
								<div className='flex gap-3 border-t border-black px-6 py-4'>
									<Modal.Close className='flex-1 rounded-[8px] border border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'>
										Cancel
									</Modal.Close>
									<button
										onClick={() => setOpen(false)}
										className='flex-1 rounded-[8px] border border-black bg-black py-2 text-sm font-medium text-white hover:bg-[#333]'>
										Save
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
