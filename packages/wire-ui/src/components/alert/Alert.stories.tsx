import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = {
	title: 'Components/Alert',
	component: Alert.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Alert.Root>;

export default meta;

const alertCls = 'flex items-start gap-3 rounded-[8px] border-2 border-black bg-[#f5f5f5] px-4 py-3 text-black';

const dismissCls = [
	'ml-auto flex size-6 cursor-pointer items-center justify-center rounded-[8px]',
	'text-current opacity-60 outline-none',
	'[data-hover]:opacity-100',
	'[data-focus-visible]:ring-2 [data-focus-visible]:ring-black [data-focus-visible]:ring-offset-1',
	'[data-active]:scale-90',
].join(' ');

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Alert.Root className={alertCls}>
			<div className='flex-1'>
				<Alert.Title className='text-sm font-semibold'>Notice</Alert.Title>
				<Alert.Description className='mt-0.5 text-sm'>This is a default informational alert.</Alert.Description>
			</div>
		</Alert.Root>
	),
};

export const Success: Story = {
	render: () => (
		<Alert.Root status='success' className={alertCls}>
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
		<Alert.Root status='warning' className={alertCls}>
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
		<Alert.Root status='danger' className={alertCls}>
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
			className={alertCls}>
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
			className={alertCls}>
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
				{ status: undefined, label: 'Default' },
				{ status: 'success' as const, label: 'Success' },
				{ status: 'warning' as const, label: 'Warning' },
				{ status: 'danger' as const, label: 'Error' },
			].map(({ status, label }) => (
				<Alert.Root key={label} status={status} className={alertCls}>
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
