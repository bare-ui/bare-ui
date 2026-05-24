import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
		const [step, setStep] = useState(0);
		return (
			<Stepper.Root
				count={steps.length}
				value={step}
				onChange={setStep}
				className='w-full max-w-md space-y-6'>
				<Stepper.List className='flex items-center'>
					{steps.map((s, i) => (
						<Stepper.Item
							key={s.title}
							index={i}
							className='flex flex-1 items-center last:flex-none'>
							<Stepper.Trigger className={triggerCls}>
								<span
									className={dotCls}
									data-state={i === step ? 'active' : i < step ? 'completed' : 'inactive'}>
									{i < step ? '✓' : i + 1}
								</span>
								{s.title}
							</Stepper.Trigger>
							{i < steps.length - 1 && (
								<Stepper.Separator className='mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black' />
							)}
						</Stepper.Item>
					))}
				</Stepper.List>

				{steps.map((s, i) => (
					<Stepper.Content
						key={s.title}
						index={i}
						className='rounded-xl border border-[#e5e7eb] p-4 text-sm text-[#374151]'>
						<p className='mb-1 font-semibold text-black'>{s.title}</p>
						{s.body}
					</Stepper.Content>
				))}

				<div className='flex justify-between'>
					<Stepper.PrevTrigger className='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40'>
						Back
					</Stepper.PrevTrigger>
					<Stepper.NextTrigger className='rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40'>
						Next
					</Stepper.NextTrigger>
				</div>
			</Stepper.Root>
		);
	},
};

export const Vertical: Story = {
	render: () => {
		const [step, setStep] = useState(1);
		return (
			<Stepper.Root
				count={steps.length}
				value={step}
				onChange={setStep}
				orientation='vertical'
				className='w-full max-w-sm'>
				<Stepper.List className='flex flex-col gap-1'>
					{steps.map((s, i) => (
						<Stepper.Item
							key={s.title}
							index={i}
							className='flex flex-col'>
							<Stepper.Trigger className={triggerCls}>
								<span
									className={dotCls}
									data-state={i === step ? 'active' : i < step ? 'completed' : 'inactive'}>
									{i < step ? '✓' : i + 1}
								</span>
								{s.title}
							</Stepper.Trigger>
							{i < steps.length - 1 && (
								<Stepper.Separator className='ml-3.5 h-6 w-px bg-[#e5e7eb] data-[state=completed]:bg-black' />
							)}
						</Stepper.Item>
					))}
				</Stepper.List>
			</Stepper.Root>
		);
	},
};
