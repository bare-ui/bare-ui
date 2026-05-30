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
						...steps.map((s, i) =>
							h(
								Stepper.Content,
								{ key: s.title, index: i, class: 'rounded-xl border border-[#e5e7eb] p-4 text-sm text-[#374151]' },
								() => [
									h('p', { class: 'mb-1 font-semibold text-black' }, s.title),
									s.body,
								],
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

export const Vertical: Story = {
	render: () => ({
		setup() {
			const step = ref(1);
			const setStep = (i: number) => { step.value = i; };

			return () =>
				h(
					Stepper.Root,
					{
						count: steps.length,
						value: step.value,
						onChange: setStep,
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
													'data-state': i === step.value ? 'active' : i < step.value ? 'completed' : 'inactive',
												},
												i < step.value ? '✓' : String(i + 1),
											),
											s.title,
										]),
										i < steps.length - 1
											? h(Stepper.Separator, { class: 'ml-3.5 h-6 w-px bg-[#e5e7eb] data-[state=completed]:bg-black' })
											: null,
									],
								),
							),
						),
					],
				);
		},
	}),
};
