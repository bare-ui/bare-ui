import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from './Form';
import { Input } from '../input/Input';

const meta = {
	title: 'Forms/Form',
	component: Form.Root,
	subcomponents: {
		'Form.Field': Form.Field,
		'Form.Label': Form.Label,
		'Form.Control': Form.Control,
		'Form.Description': Form.Description,
		'Form.Error': Form.Error,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Headless form primitives. Wraps any field component (here, the wire-ui `Input`) with shared layout, validation, and submit semantics.',
			},
		},
	},
} satisfies Meta<typeof Form.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const labelCls = 'text-sm font-medium text-black';
const fieldCls =
	'w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 data-[invalid]:border-black disabled:opacity-50';
const descCls = 'text-xs text-[#6b7280]';
const errorCls = 'text-xs font-medium text-black';

export const Default: Story = {
	render: () => (
		<Form.Root className='flex w-72 flex-col gap-3'>
			<Form.Field name='email'>
				<Input.Root className='flex flex-col gap-1.5'>
					<Input.Label className={labelCls}>Email</Input.Label>
					<Input.Field type='email' placeholder='you@example.com' className={fieldCls} />
				</Input.Root>
			</Form.Field>
		</Form.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Form.Root className='flex w-72 flex-col gap-3'>
			<Form.Field name='username'>
				<Input.Root className='flex flex-col gap-1.5'>
					<Input.Label className={labelCls}>Username</Input.Label>
					<Input.Field placeholder='jdoe' className={fieldCls} />
					<p className={descCls}>3–20 characters, letters and numbers only.</p>
				</Input.Root>
			</Form.Field>
		</Form.Root>
	),
};

export const Complex: Story = {
	render: () => {
		const [email, setEmail] = useState('not-an-email');
		const [name, setName] = useState('');
		const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const nameInvalid = name.trim().length === 0;
		const formInvalid = emailInvalid || nameInvalid;

		return (
			<Form.Root
				className='flex w-80 flex-col gap-4'
				onSubmit={(e) => {
					e.preventDefault();
					alert(`Submitted: ${name} <${email}>`);
				}}>
				<Form.Field name='name' invalid={nameInvalid} required>
					<Input.Root
						value={name}
						onChange={setName}
						isRequired
						invalidType={nameInvalid ? 'required' : ''}
						errorMessage={{ required: 'Name is required.' }}
						className='flex flex-col gap-1.5'>
						<Input.Label className={labelCls}>Name</Input.Label>
						<Input.Field placeholder='Jane Doe' className={fieldCls} />
						<Input.Error className={errorCls} />
					</Input.Root>
				</Form.Field>

				<Form.Field name='email' invalid={emailInvalid} required>
					<Input.Root
						value={email}
						onChange={setEmail}
						isRequired
						invalidType={emailInvalid ? 'email' : ''}
						errorMessage={{ email: 'Please enter a valid email address.' }}
						className='flex flex-col gap-1.5'>
						<Input.Label className={labelCls}>Email</Input.Label>
						<Input.Field type='email' className={fieldCls} />
						<p className={descCls}>We'll send a magic link.</p>
						<Input.Error className={errorCls} />
					</Input.Root>
				</Form.Field>

				<button
					type='submit'
					disabled={formInvalid}
					className='cursor-pointer rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50'>
					Submit
				</button>
			</Form.Root>
		);
	},
};
