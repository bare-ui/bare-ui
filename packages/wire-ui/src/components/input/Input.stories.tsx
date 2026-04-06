import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
	title: 'Components/Input',
	component: Input.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Input.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const fieldCls =
	'w-full rounded-[8px] border-2 border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';

export const Default: Story = {
	render: () => (
		<Input.Root className='w-72'>
			<Input.Field placeholder='Enter text...' className={fieldCls} />
		</Input.Root>
	),
};

export const WithLabel: Story = {
	render: () => (
		<Input.Root className='flex w-72 flex-col gap-1.5'>
			<Input.Label className='text-sm font-medium text-black'>Full Name</Input.Label>
			<Input.Field placeholder='John Doe' className={fieldCls} />
		</Input.Root>
	),
};

export const Required: Story = {
	render: () => (
		<Input.Root isRequired className='flex w-72 flex-col gap-1.5'>
			<Input.Label className='text-sm font-medium text-black'>Username</Input.Label>
			<Input.Field placeholder='Required field' className={fieldCls} />
			<Input.Error className='text-xs text-black'>This field is required</Input.Error>
		</Input.Root>
	),
};

export const WithError: Story = {
	render: () => (
		<Input.Root
			invalidType='email'
			defaultValue='not-an-email'
			errorMessage={{ email: 'Please enter a valid email address' }}
			className='flex w-72 flex-col gap-1.5'>
			<Input.Label className='text-sm font-medium text-black'>Email</Input.Label>
			<Input.Field type='email' className={fieldCls} />
			<Input.Error className='text-xs text-black' />
		</Input.Root>
	),
};

export const ErrorState: Story = {
	render: () => (
		<Input.Root
			invalidType='custom'
			defaultValue='admin'
			errorMessage={{ custom: 'This username is already taken' }}
			className='flex w-72 flex-col gap-1.5'>
			<Input.Label className='text-sm font-medium text-black'>Username</Input.Label>
			<Input.Field className={fieldCls} />
			<Input.Error className='text-xs text-black' />
		</Input.Root>
	),
};

export const SuccessState: Story = {
	render: () => (
		<Input.Root isSuccess defaultValue='available_user' className='flex w-72 flex-col gap-1.5'>
			<Input.Label className='text-sm font-medium text-black'>Username</Input.Label>
			<Input.Field className={fieldCls} />
			<span className='text-xs text-black'>Username is available</span>
		</Input.Root>
	),
};
