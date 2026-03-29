import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = {
	title: 'Components/Alert',
	component: Alert.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Alert.Root>;

export default meta;

const dismissCls = [
	'ml-auto flex size-6 cursor-pointer items-center justify-center rounded',
	'text-current opacity-60 outline-none',
	'[data-hover]:opacity-100',
	'[data-focus-visible]:ring-2 [data-focus-visible]:ring-current [data-focus-visible]:ring-offset-1',
	'[data-active]:scale-90',
].join(' ');

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Alert.Root className='flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800'>
			<div className='flex-1'>
				<Alert.Title className='text-sm font-semibold'>Notice</Alert.Title>
				<Alert.Description className='mt-0.5 text-sm'>This is a default informational alert.</Alert.Description>
			</div>
		</Alert.Root>
	),
};

export const Success: Story = {
	render: () => (
		<Alert.Root
			status='success'
			className='flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800'>
			<div className='flex-1'>
				<Alert.Title className='text-sm font-semibold'>Success</Alert.Title>
				<Alert.Description className='mt-0.5 text-sm'>
					Your changes have been saved successfully.
				</Alert.Description>
			</div>
		</Alert.Root>
	),
};

export const Warning: Story = {
	render: () => (
		<Alert.Root
			status='warning'
			className='flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800'>
			<div className='flex-1'>
				<Alert.Title className='text-sm font-semibold'>Warning</Alert.Title>
				<Alert.Description className='mt-0.5 text-sm'>
					Please review the information before proceeding.
				</Alert.Description>
			</div>
		</Alert.Root>
	),
};

export const Danger: Story = {
	render: () => (
		<Alert.Root
			status='danger'
			className='flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800'>
			<div className='flex-1'>
				<Alert.Title className='text-sm font-semibold'>Error</Alert.Title>
				<Alert.Description className='mt-0.5 text-sm'>
					Something went wrong. Please try again.
				</Alert.Description>
			</div>
		</Alert.Root>
	),
};

export const Dismissible: Story = {
	render: () => (
		<Alert.Root
			status='success'
			isAutoDismissable
			onDismiss={() => console.log('dismissed')}
			className='flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800'>
			<div className='flex-1'>
				<Alert.Title className='text-sm font-semibold'>Dismissible Alert</Alert.Title>
				<Alert.Description className='mt-0.5 text-sm'>
					Click the × button to dismiss this alert.
				</Alert.Description>
			</div>
			<Alert.Dismiss className={dismissCls}>×</Alert.Dismiss>
		</Alert.Root>
	),
};

export const AutoDismiss: Story = {
	render: () => (
		<Alert.Root
			status='warning'
			isAutoDismissable
			dismissCountdown={3000}
			className='flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800'>
			<div className='flex-1'>
				<Alert.Title className='text-sm font-semibold'>Auto-dismiss in 3s</Alert.Title>
				<Alert.Description className='mt-0.5 text-sm'>
					This alert will disappear automatically.
				</Alert.Description>
			</div>
		</Alert.Root>
	),
};

export const AllStatuses: Story = {
	render: () => (
		<div className='flex flex-col gap-3'>
			{[
				{
					status: undefined,
					border: 'border-gray-200',
					bg: 'bg-gray-50',
					text: 'text-gray-800',
					label: 'Default',
				},
				{
					status: 'success',
					border: 'border-green-200',
					bg: 'bg-green-50',
					text: 'text-green-800',
					label: 'Success',
				},
				{
					status: 'warning',
					border: 'border-yellow-200',
					bg: 'bg-yellow-50',
					text: 'text-yellow-800',
					label: 'Warning',
				},
				{
					status: 'danger',
					border: 'border-red-200',
					bg: 'bg-red-50',
					text: 'text-red-800',
					label: 'Error',
				},
			].map(({ status, border, bg, text, label }) => (
				<Alert.Root
					key={label}
					status={status}
					className={`flex items-start gap-3 rounded-md border ${border} ${bg} px-4 py-3 ${text}`}>
					<div className='flex-1'>
						<Alert.Title className='text-sm font-semibold'>{label}</Alert.Title>
						<Alert.Description className='mt-0.5 text-sm'>
							This is a {label.toLowerCase()} alert message.
						</Alert.Description>
					</div>
				</Alert.Root>
			))}
		</div>
	),
};
