import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createMemo, createSignal } from 'solid-js';
import { Form } from './Form';
import { Input } from '../input/Input';

const meta = {
	title: 'Forms/Form',
	component: Form.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Headless form primitives. Wraps any field component (here, the wire-ui `Input`) with shared layout, validation, and submit semantics.',
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
		<Form.Root class='flex w-72 flex-col gap-3'>
			<Form.Field name='email'>
				<Input.Root class='flex flex-col gap-1.5'>
					<Input.Label class={labelCls}>Email</Input.Label>
					<Input.Field
						type='email'
						placeholder='you@example.com'
						class={fieldCls}
					/>
				</Input.Root>
			</Form.Field>
		</Form.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Form.Root class='flex w-72 flex-col gap-3'>
			<Form.Field name='username'>
				<Input.Root class='flex flex-col gap-1.5'>
					<Input.Label class={labelCls}>Username</Input.Label>
					<Input.Field
						placeholder='jdoe'
						class={fieldCls}
					/>
					<p class={descCls}>3–20 characters, letters and numbers only.</p>
				</Input.Root>
			</Form.Field>
		</Form.Root>
	),
};

export const Complex: Story = {
	render: () => {
		const [email, setEmail] = createSignal('not-an-email');
		const [name, setName] = createSignal('');
		const emailInvalid = createMemo(() => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email()));
		const nameInvalid = createMemo(() => name().trim().length === 0);
		const formInvalid = createMemo(() => emailInvalid() || nameInvalid());

		return (
			<Form.Root
				class='flex w-80 flex-col gap-4'
				onSubmit={(e) => {
					e.preventDefault();
					alert(`Submitted: ${name()} <${email()}>`);
				}}>
				<Form.Field
					name='name'
					invalid={nameInvalid()}
					required>
					<Input.Root
						value={name()}
						onChange={setName}
						isRequired
						invalidType={nameInvalid() ? 'required' : ''}
						errorMessage={{ required: 'Name is required.' }}
						class='flex flex-col gap-1.5'>
						<Input.Label class={labelCls}>Name</Input.Label>
						<Input.Field
							placeholder='Jane Doe'
							class={fieldCls}
						/>
						<Input.Error class={errorCls} />
					</Input.Root>
				</Form.Field>

				<Form.Field
					name='email'
					invalid={emailInvalid()}
					required>
					<Input.Root
						value={email()}
						onChange={setEmail}
						isRequired
						invalidType={emailInvalid() ? 'email' : ''}
						errorMessage={{ email: 'Please enter a valid email address.' }}
						class='flex flex-col gap-1.5'>
						<Input.Label class={labelCls}>Email</Input.Label>
						<Input.Field
							type='email'
							class={fieldCls}
						/>
						<p class={descCls}>We'll send a magic link.</p>
						<Input.Error class={errorCls} />
					</Input.Root>
				</Form.Field>

				<button
					type='submit'
					disabled={formInvalid()}
					class='cursor-pointer rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50'>
					Submit
				</button>
			</Form.Root>
		);
	},
};
