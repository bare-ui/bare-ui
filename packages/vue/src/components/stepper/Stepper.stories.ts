import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Stepper } from '.';

const meta = {
	title: 'Layout/Stepper',
	component: Stepper.Root,
	subcomponents: {
		'Stepper.List': Stepper.List,
		'Stepper.Item': Stepper.Item,
		'Stepper.Trigger': Stepper.Trigger,
		'Stepper.Separator': Stepper.Separator,
		'Stepper.Content': Stepper.Content,
		'Stepper.PrevTrigger': Stepper.PrevTrigger,
		'Stepper.NextTrigger': Stepper.NextTrigger,
	},
	tags: ['autodocs'],
	args: { count: 3 },
	parameters: {
		docs: {
			description: {
				component:
					'Multi-step / wizard flow. Steps expose `data-state` (`active` / `completed` / `inactive`); navigate with triggers or the built-in Prev/Next buttons. Set `linear` to prevent skipping ahead.',
			},
		},
	},
} satisfies Meta<typeof Stepper.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
	{ title: 'Account', body: 'Create your account credentials.' },
	{ title: 'Profile', body: 'Tell us a bit about yourself.' },
	{ title: 'Review', body: 'Confirm everything looks right.' },
];

const triggerCls =
	'flex items-center gap-2 text-sm font-medium text-[#9ca3af] data-[state=active]:text-black data-[state=completed]:text-black disabled:cursor-not-allowed';
const dotCls =
	'flex size-7 items-center justify-center rounded-full border border-[#d1d5db] text-xs data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=completed]:border-black data-[state=completed]:bg-black data-[state=completed]:text-white';

export const Default: Story = {
	render: () => ({
		setup() {
			const step = ref(0);
			const setStep = (i: number) => { step.value = i; };

			return () =>
				h(
					Stepper.Root,
					{
						count: steps.length,
						value: step.value,
						onChange: setStep,
						class: 'w-full max-w-md space-y-6',
					},
					() => [
						h(Stepper.List, { class: 'flex items-center' }, () =>
							steps.map((s, i) =>
								h(
									Stepper.Item,
									{ key: s.title, index: i, class: 'flex flex-1 items-center last:flex-none' },
									() => [
										h(Stepper.Trigger, { class: triggerCls }, () => [
											h(
												'span',
												{
													class: dotCls,
													'data-state': i === step.value ? 'active' : i < step.value ? 'completed' : 'inactive',
												},
												i < step.value ? '✓' : String(i + 1),
											),
											s.title,
										]),
										i < steps.length - 1
											? h(Stepper.Separator, { class: 'mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black' })
											: null,
									],
								),
							),
						),
						h('div', { class: 'flex justify-between' }, [
							h(
								Stepper.PrevTrigger,
								{ class: 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40' },
								() => 'Back',
							),
							h(
								Stepper.NextTrigger,
								{ class: 'rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40' },
								() => 'Next',
							),
						]),
					],
				);
		},
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const horizontal = ref(1);
			const vertical = ref(1);
			const linear = ref(0);

			const horizontalItems = () =>
				steps.map((s, i) =>
					h(
						Stepper.Item,
						{ key: s.title, index: i, class: 'flex flex-1 items-center last:flex-none' },
						() => [
							h(Stepper.Trigger, { class: triggerCls }, () => [
								h(
									'span',
									{
										class: dotCls,
										'data-state':
											i === horizontal.value ? 'active' : i < horizontal.value ? 'completed' : 'inactive',
									},
									i < horizontal.value ? '✓' : String(i + 1),
								),
								s.title,
							]),
							i < steps.length - 1
								? h(Stepper.Separator, { class: 'mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black' })
								: null,
						],
					),
				);

			return () =>
				h('div', { class: 'flex flex-col gap-10' }, [
					h('div', null, [
						h('p', { class: 'mb-3 text-sm font-medium text-[#374151]' }, 'Horizontal'),
						h(
							Stepper.Root,
							{
								count: steps.length,
								value: horizontal.value,
								onChange: (i: number) => { horizontal.value = i; },
								class: 'w-full max-w-md',
							},
							() => [h(Stepper.List, { class: 'flex items-center' }, horizontalItems)],
						),
					]),

					h('div', null, [
						h('p', { class: 'mb-3 text-sm font-medium text-[#374151]' }, 'Vertical'),
						h(
							Stepper.Root,
							{
								count: steps.length,
								value: vertical.value,
								onChange: (i: number) => { vertical.value = i; },
								orientation: 'vertical',
								class: 'w-full max-w-sm',
							},
							() => [
								h(Stepper.List, { class: 'flex flex-col gap-1' }, () =>
									steps.map((s, i) =>
										h(
											Stepper.Item,
											{ key: s.title, index: i, class: 'flex flex-col' },
											() => [
												h(Stepper.Trigger, { class: triggerCls }, () => [
													h(
														'span',
														{
															class: dotCls,
															'data-state':
																i === vertical.value ? 'active' : i < vertical.value ? 'completed' : 'inactive',
														},
														i < vertical.value ? '✓' : String(i + 1),
													),
													s.title,
												]),
												i < steps.length - 1
													? h(Stepper.Separator, {
															class: 'ml-3.5 h-6 w-px bg-[#e5e7eb] data-[state=completed]:bg-black',
														})
													: null,
											],
										),
									),
								),
							],
						),
					]),

					h('div', null, [
						h('p', { class: 'mb-3 text-sm font-medium text-[#374151]' }, 'Linear (no skipping ahead)'),
						h(
							Stepper.Root,
							{
								linear: true,
								count: steps.length,
								value: linear.value,
								onChange: (i: number) => { linear.value = i; },
								class: 'w-full max-w-md space-y-4',
							},
							() => [
								h(Stepper.List, { class: 'flex items-center' }, () =>
									steps.map((s, i) =>
										h(
											Stepper.Item,
											{ key: s.title, index: i, class: 'flex flex-1 items-center last:flex-none' },
											() => [
												h(Stepper.Trigger, { class: triggerCls }, () => [
													h(
														'span',
														{
															class: dotCls,
															'data-state':
																i === linear.value ? 'active' : i < linear.value ? 'completed' : 'inactive',
														},
														i < linear.value ? '✓' : String(i + 1),
													),
													s.title,
												]),
												i < steps.length - 1
													? h(Stepper.Separator, {
															class: 'mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black',
														})
													: null,
											],
										),
									),
								),
								h('div', { class: 'flex justify-between' }, [
									h(
										Stepper.PrevTrigger,
										{ class: 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40' },
										() => 'Back',
									),
									h(
										Stepper.NextTrigger,
										{ class: 'rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40' },
										() => 'Next',
									),
								]),
							],
						),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const step = ref(0);

			return () =>
				h('div', { class: 'w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-6' }, [
					h(
						Stepper.Root,
						{
							count: steps.length,
							value: step.value,
							onChange: (i: number) => { step.value = i; },
							class: 'space-y-6',
						},
						() => [
							h(Stepper.List, { class: 'flex items-center' }, () =>
								steps.map((s, i) =>
									h(
										Stepper.Item,
										{ key: s.title, index: i, class: 'flex flex-1 items-center last:flex-none' },
										() => [
											h(Stepper.Trigger, { class: triggerCls }, () => [
												h(
													'span',
													{
														class: dotCls,
														'data-state': i === step.value ? 'active' : i < step.value ? 'completed' : 'inactive',
													},
													i < step.value ? '✓' : String(i + 1),
												),
												s.title,
											]),
											i < steps.length - 1
												? h(Stepper.Separator, {
														class: 'mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black',
													})
												: null,
										],
									),
								),
							),

							h(Stepper.Content, { index: 0, class: 'space-y-3' }, () => [
								h('p', { class: 'text-sm font-semibold text-black' }, 'Account'),
								h('input', {
									type: 'email',
									placeholder: 'Email address',
									class: 'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black',
								}),
								h('input', {
									type: 'password',
									placeholder: 'Password',
									class: 'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black',
								}),
							]),

							h(Stepper.Content, { index: 1, class: 'space-y-3' }, () => [
								h('p', { class: 'text-sm font-semibold text-black' }, 'Profile'),
								h('input', {
									type: 'text',
									placeholder: 'Full name',
									class: 'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black',
								}),
								h('textarea', {
									placeholder: 'Short bio',
									rows: 3,
									class: 'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black',
								}),
							]),

							h(Stepper.Content, { index: 2, class: 'rounded-lg bg-[#f5f5f5] p-4 text-sm text-[#374151]' }, () => [
								h('p', { class: 'mb-1 font-semibold text-black' }, 'Review'),
								'Everything looks good. Submit to finish setting up your account.',
							]),

							h('div', { class: 'flex justify-between' }, [
								h(
									Stepper.PrevTrigger,
									{ class: 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40' },
									() => 'Back',
								),
								h(
									Stepper.NextTrigger,
									{ class: 'rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40' },
									() => (step.value === steps.length - 1 ? 'Submit' : 'Next'),
								),
							]),
						],
					),
				]);
		},
	}),
};
