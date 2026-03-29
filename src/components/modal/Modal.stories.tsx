import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'

const meta = {
	title: 'Components/Modal',
	component: Modal.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Modal.Root>

export default meta
type Story = StoryObj<typeof meta>

const CloseIcon = () => (
	<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
	</svg>
)

export const Default: Story = {
	render: () => {
		const [open, setOpen] = useState(false)

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Open Modal
				</button>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
							<Modal.Content className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
								<div className="mb-4 flex items-start justify-between">
									<h2 className="text-lg font-semibold text-gray-900">
										Modal Title
									</h2>
									<Modal.Close className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
										<CloseIcon />
									</Modal.Close>
								</div>
								<p className="mb-6 text-sm text-gray-600">
									This is a basic modal dialog. Press Escape or click outside to
									close.
								</p>
								<div className="flex justify-end gap-3">
									<Modal.Close className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
										Close
									</Modal.Close>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		)
	},
}

export const ConfirmDialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false)
		const [confirmed, setConfirmed] = useState(false)

		const handleConfirm = () => {
			setConfirmed(true)
			setOpen(false)
		}

		return (
			<>
				<div className="flex flex-col items-start gap-3">
					<button
						onClick={() => setOpen(true)}
						className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					>
						Delete Account
					</button>
					{confirmed && <p className="text-sm text-red-600">✓ Action confirmed</p>}
				</div>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
							<Modal.Content className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
									<svg
										className="h-6 w-6 text-red-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								</div>
								<h2 className="mb-2 text-base font-semibold text-gray-900">
									Delete Account
								</h2>
								<p className="mb-6 text-sm text-gray-500">
									Are you sure you want to delete your account? All of your data
									will be permanently removed. This action cannot be undone.
								</p>
								<div className="flex gap-3">
									<Modal.Close className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
										Cancel
									</Modal.Close>
									<button
										onClick={handleConfirm}
										className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
									>
										Delete
									</button>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		)
	},
}

export const FormModal: Story = {
	render: () => {
		const [open, setOpen] = useState(false)

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Edit Profile
				</button>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
							<Modal.Content className="w-full max-w-md rounded-xl bg-white shadow-xl">
								<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
									<h2 className="text-base font-semibold text-gray-900">
										Edit Profile
									</h2>
									<Modal.Close className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
										<CloseIcon />
									</Modal.Close>
								</div>

								<div className="space-y-4 p-6">
									<div className="flex items-center gap-4">
										<div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
											JD
										</div>
										<button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
											Change photo
										</button>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="mb-1 block text-xs font-medium text-gray-700">
												First name
											</label>
											<input
												type="text"
												defaultValue="Jane"
												className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
											/>
										</div>
										<div>
											<label className="mb-1 block text-xs font-medium text-gray-700">
												Last name
											</label>
											<input
												type="text"
												defaultValue="Doe"
												className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
											/>
										</div>
									</div>

									<div>
										<label className="mb-1 block text-xs font-medium text-gray-700">
											Email
										</label>
										<input
											type="email"
											defaultValue="jane@example.com"
											className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="mb-1 block text-xs font-medium text-gray-700">
											Bio
										</label>
										<textarea
											rows={3}
											defaultValue="Product designer and coffee enthusiast."
											className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
									<Modal.Close className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
										Cancel
									</Modal.Close>
									<button
										onClick={() => setOpen(false)}
										className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
									>
										Save changes
									</button>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		)
	},
}

export const AlertModal: Story = {
	render: () => {
		const [open, setOpen] = useState(false)

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
				>
					Show Alert
				</button>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
							<Modal.Content className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
								<div className="text-center">
									<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
										<svg
											className="h-7 w-7 text-amber-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<h2 className="mb-2 text-base font-semibold text-gray-900">
										Session Expiring
									</h2>
									<p className="mb-6 text-sm text-gray-500">
										Your session will expire in 5 minutes. Would you like to
										extend it?
									</p>
									<div className="flex gap-3">
										<Modal.Close className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
											Sign out
										</Modal.Close>
										<button
											onClick={() => setOpen(false)}
											className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
										>
											Stay signed in
										</button>
									</div>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		)
	},
}

export const LargeContentModal: Story = {
	render: () => {
		const [open, setOpen] = useState(false)

		return (
			<>
				<button
					onClick={() => setOpen(true)}
					className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Terms &amp; Conditions
				</button>

				<Modal.Root open={open} onOpenChange={setOpen}>
					<Modal.Portal>
						<Modal.Overlay className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
							<Modal.Content className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
								<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
									<h2 className="text-base font-semibold text-gray-900">
										Terms &amp; Conditions
									</h2>
									<Modal.Close className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
										<CloseIcon />
									</Modal.Close>
								</div>

								<div className="flex-1 overflow-y-auto p-6">
									{Array.from({ length: 6 }, (_, i) => (
										<div key={i} className="mb-4">
											<h3 className="mb-2 text-sm font-semibold text-gray-800">
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
											<p className="text-sm text-gray-600 leading-relaxed">
												Lorem ipsum dolor sit amet, consectetur adipiscing
												elit. Sed do eiusmod tempor incididunt ut labore et
												dolore magna aliqua. Ut enim ad minim veniam, quis
												nostrud exercitation ullamco laboris nisi ut aliquip
												ex ea commodo consequat.
											</p>
										</div>
									))}
								</div>

								<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
									<Modal.Close className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
										Decline
									</Modal.Close>
									<button
										onClick={() => setOpen(false)}
										className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
									>
										Accept &amp; Continue
									</button>
								</div>
							</Modal.Content>
						</Modal.Overlay>
					</Modal.Portal>
				</Modal.Root>
			</>
		)
	},
}
