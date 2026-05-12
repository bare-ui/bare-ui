import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, h, ref } from 'vue';
import { Form } from '.';
import { Input } from '../input';

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
	render: () => ({
		setup: () => () =>
			h(Form.Root, { class: 'flex w-72 flex-col gap-3' }, () => [
				h(Form.Field, { name: 'email' }, () => [
					h(Input.Root, { class: 'flex flex-col gap-1.5' }, () => [
						h(Input.Label, { class: labelCls }, () => 'Email'),
						h(Input.Field, { type: 'email', placeholder: 'you@example.com', class: fieldCls }),
					]),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(Form.Root, { class: 'flex w-72 flex-col gap-3' }, () => [
				h(Form.Field, { name: 'username' }, () => [
					h(Input.Root, { class: 'flex flex-col gap-1.5' }, () => [
						h(Input.Label, { class: labelCls }, () => 'Username'),
						h(Input.Field, { placeholder: 'jdoe', class: fieldCls }),
						h('p', { class: descCls }, '3–20 characters, letters and numbers only.'),
					]),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const email = ref('not-an-email');
			const name = ref('');
			const emailInvalid = computed(() => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
			const nameInvalid = computed(() => name.value.trim().length === 0);
			const formInvalid = computed(() => emailInvalid.value || nameInvalid.value);
			return () =>
				h(
					Form.Root,
					{
						class: 'flex w-80 flex-col gap-4',
						onSubmit: (e: Event) => {
							e.preventDefault();
							alert(`Submitted: ${name.value} <${email.value}>`);
						},
					},
					() => [
						h(
							Form.Field,
							{ name: 'name', invalid: nameInvalid.value, required: true },
							() => [
								h(
									Input.Root,
									{
										value: name.value,
										onChange: (v: string) => (name.value = v),
										isRequired: true,
										invalidType: nameInvalid.value ? 'required' : '',
										errorMessage: { required: 'Name is required.' },
										class: 'flex flex-col gap-1.5',
									},
									() => [
										h(Input.Label, { class: labelCls }, () => 'Name'),
										h(Input.Field, { placeholder: 'Jane Doe', class: fieldCls }),
										h(Input.Error, { class: errorCls }),
									],
								),
							],
						),
						h(
							Form.Field,
							{ name: 'email', invalid: emailInvalid.value, required: true },
							() => [
								h(
									Input.Root,
									{
										value: email.value,
										onChange: (v: string) => (email.value = v),
										isRequired: true,
										invalidType: emailInvalid.value ? 'email' : '',
										errorMessage: { email: 'Please enter a valid email address.' },
										class: 'flex flex-col gap-1.5',
									},
									() => [
										h(Input.Label, { class: labelCls }, () => 'Email'),
										h(Input.Field, { type: 'email', class: fieldCls }),
										h('p', { class: descCls }, 'We\'ll send a magic link.'),
										h(Input.Error, { class: errorCls }),
									],
								),
							],
						),
						h(
							'button',
							{
								type: 'submit',
								disabled: formInvalid.value,
								class: 'cursor-pointer rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50',
							},
							'Submit',
						),
					],
				);
		},
	}),
};
