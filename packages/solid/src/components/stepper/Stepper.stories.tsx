import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For, Show } from 'solid-js';
import { Stepper } from './Stepper';

const meta = {
	title: 'Layout/Stepper',
	component: Stepper.Root,
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
	render: () => {
		const [step, setStep] = createSignal(0);
		return (
			<Stepper.Root
				count={steps.length}
				value={step()}
				onChange={setStep}
				class='w-full max-w-md space-y-6'>
				<Stepper.List class='flex items-center'>
					<For each={steps}>
						{(s, i) => (
							<Stepper.Item
								index={i()}
								class='flex flex-1 items-center last:flex-none'>
								<Stepper.Trigger class={triggerCls}>
									<span
										class={dotCls}
										data-state={i() === step() ? 'active' : i() < step() ? 'completed' : 'inactive'}>
										{i() < step() ? '✓' : i() + 1}
									</span>
									{s.title}
								</Stepper.Trigger>
								<Show when={i() < steps.length - 1}>
									<Stepper.Separator class='mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black' />
								</Show>
							</Stepper.Item>
						)}
					</For>
				</Stepper.List>

				<For each={steps}>
					{(s, i) => (
						<Stepper.Content
							index={i()}
							class='rounded-xl border border-[#e5e7eb] p-4 text-sm text-[#374151]'>
							<p class='mb-1 font-semibold text-black'>{s.title}</p>
							{s.body}
						</Stepper.Content>
					)}
				</For>

				<div class='flex justify-between'>
					<Stepper.PrevTrigger class='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40'>
						Back
					</Stepper.PrevTrigger>
					<Stepper.NextTrigger class='rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40'>
						Next
					</Stepper.NextTrigger>
				</div>
			</Stepper.Root>
		);
	},
};

export const Vertical: Story = {
	render: () => {
		const [step, setStep] = createSignal(1);
		return (
			<Stepper.Root
				count={steps.length}
				value={step()}
				onChange={setStep}
				orientation='vertical'
				class='w-full max-w-sm'>
				<Stepper.List class='flex flex-col gap-1'>
					<For each={steps}>
						{(s, i) => (
							<Stepper.Item
								index={i()}
								class='flex flex-col'>
								<Stepper.Trigger class={triggerCls}>
									<span
										class={dotCls}
										data-state={i() === step() ? 'active' : i() < step() ? 'completed' : 'inactive'}>
										{i() < step() ? '✓' : i() + 1}
									</span>
									{s.title}
								</Stepper.Trigger>
								<Show when={i() < steps.length - 1}>
									<Stepper.Separator class='ml-3.5 h-6 w-px bg-[#e5e7eb] data-[state=completed]:bg-black' />
								</Show>
							</Stepper.Item>
						)}
					</For>
				</Stepper.List>
			</Stepper.Root>
		);
	},
};
