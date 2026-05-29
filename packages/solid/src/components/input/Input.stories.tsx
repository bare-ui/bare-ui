import type { Meta, StoryObj } from 'storybook-solidjs-vite';
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
		<Input.Root class='flex w-full max-w-xs flex-col gap-1.5'>
			<Input.Label class='text-sm font-medium text-black'>Full Name</Input.Label>
			<Input.Field
				placeholder='John Doe'
				class={fieldCls}
			/>
		</Input.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Input.Root
			invalidType='email'
			defaultValue='not-an-email'
			errorMessage={{ email: 'Please enter a valid email address' }}
			class='flex w-full max-w-xs flex-col gap-1.5'>
			<Input.Label class='text-sm font-medium text-black'>Email</Input.Label>
			<Input.Field
				type='email'
				class={fieldCls}
			/>
			<Input.Error class='text-xs text-black' />
		</Input.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='flex flex-col gap-6 max-w-xs'>
			<Input.Root class='flex flex-col gap-1.5'>
				<Input.Label class='text-sm font-medium text-black'>Full Name</Input.Label>
				<Input.Field
					placeholder='John Doe'
					class={fieldCls}
				/>
			</Input.Root>

			<Input.Root
				invalidType='email'
				defaultValue='not-an-email'
				errorMessage={{ email: 'Please enter a valid email address' }}
				class='flex flex-col gap-1.5'>
				<Input.Label class='text-sm font-medium text-black'>Email</Input.Label>
				<Input.Field
					type='email'
					class={fieldCls}
				/>
				<Input.Error class='text-xs text-black' />
			</Input.Root>

			<Input.Root
				isSuccess
				defaultValue='available_user'
				class='flex flex-col gap-1.5'>
				<Input.Label class='text-sm font-medium text-black'>Username</Input.Label>
				<Input.Field class={fieldCls} />
				<span class='text-xs text-black'>Username is available</span>
			</Input.Root>
		</div>
	),
};
