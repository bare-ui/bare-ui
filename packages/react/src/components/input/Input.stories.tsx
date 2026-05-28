import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
	title: 'Forms/Input',
	component: Input.Root,
	subcomponents: {
		'Input.Field': Input.Field,
		'Input.Label': Input.Label,
		'Input.Error': Input.Error,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Compound text input with consumer-controlled error state.',
			},
		},
	},
} satisfies Meta<typeof Input.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const fieldCls =
	'w-full rounded-[8px] bg-white border border-black px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1';

export const Default: Story = {
	render: () => (
		<Input.Root className='flex w-full max-w-xs flex-col gap-1.5'>
			<Input.Label className='text-sm font-medium text-black'>Full Name</Input.Label>
			<Input.Field placeholder='John Doe' className={fieldCls} />
		</Input.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Input.Root
			invalidType='email'
			defaultValue='not-an-email'
			errorMessage={{ email: 'Please enter a valid email address' }}
			className='flex w-full max-w-xs flex-col gap-1.5'>
			<Input.Label className='text-sm font-medium text-black'>Email</Input.Label>
			<Input.Field type='email' className={fieldCls} />
			<Input.Error className='text-xs text-black' />
		</Input.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<div className='flex flex-col gap-6 max-w-xs'>
			<Input.Root className='flex flex-col gap-1.5'>
				<Input.Label className='text-sm font-medium text-black'>Full Name</Input.Label>
				<Input.Field placeholder='John Doe' className={fieldCls} />
			</Input.Root>

			<Input.Root
				invalidType='email'
				defaultValue='not-an-email'
				errorMessage={{ email: 'Please enter a valid email address' }}
				className='flex flex-col gap-1.5'>
				<Input.Label className='text-sm font-medium text-black'>Email</Input.Label>
				<Input.Field type='email' className={fieldCls} />
				<Input.Error className='text-xs text-black' />
			</Input.Root>

			<Input.Root isSuccess defaultValue='available_user' className='flex flex-col gap-1.5'>
				<Input.Label className='text-sm font-medium text-black'>Username</Input.Label>
				<Input.Field className={fieldCls} />
				<span className='text-xs text-black'>Username is available</span>
			</Input.Root>
		</div>
	),
};
