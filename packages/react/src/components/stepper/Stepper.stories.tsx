import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

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
									data-state={
										i === step ? 'active'
										: i < step ?
											'completed'
										:	'inactive'
									}>
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

export const Composed: Story = {
	render: () => {
		const [horizontal, setHorizontal] = useState(1);
		const [vertical, setVertical] = useState(1);
		const [linear, setLinear] = useState(0);
		return (
			<div className='flex flex-col gap-10'>
				<div>
					<p className='mb-3 text-sm font-medium text-[#374151]'>Horizontal</p>
					<Stepper.Root
						count={steps.length}
						value={horizontal}
						onChange={setHorizontal}
						className='w-full max-w-md'>
						<Stepper.List className='flex items-center'>
							{steps.map((s, i) => (
								<Stepper.Item
									key={s.title}
									index={i}
									className='flex flex-1 items-center last:flex-none'>
									<Stepper.Trigger className={triggerCls}>
										<span
											className={dotCls}
											data-state={
												i === horizontal ? 'active'
												: i < horizontal ?
													'completed'
												:	'inactive'
											}>
											{i < horizontal ? '✓' : i + 1}
										</span>
										{s.title}
									</Stepper.Trigger>
									{i < steps.length - 1 && (
										<Stepper.Separator className='mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black' />
									)}
								</Stepper.Item>
							))}
						</Stepper.List>
					</Stepper.Root>
				</div>

				<div>
					<p className='mb-3 text-sm font-medium text-[#374151]'>Vertical</p>
					<Stepper.Root
						count={steps.length}
						value={vertical}
						onChange={setVertical}
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
											data-state={
												i === vertical ? 'active'
												: i < vertical ?
													'completed'
												:	'inactive'
											}>
											{i < vertical ? '✓' : i + 1}
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
				</div>

				<div>
					<p className='mb-3 text-sm font-medium text-[#374151]'>Linear (no skipping ahead)</p>
					<Stepper.Root
						linear
						count={steps.length}
						value={linear}
						onChange={setLinear}
						className='w-full max-w-md space-y-4'>
						<Stepper.List className='flex items-center'>
							{steps.map((s, i) => (
								<Stepper.Item
									key={s.title}
									index={i}
									className='flex flex-1 items-center last:flex-none'>
									<Stepper.Trigger className={triggerCls}>
										<span
											className={dotCls}
											data-state={
												i === linear ? 'active'
												: i < linear ?
													'completed'
												:	'inactive'
											}>
											{i < linear ? '✓' : i + 1}
										</span>
										{s.title}
									</Stepper.Trigger>
									{i < steps.length - 1 && (
										<Stepper.Separator className='mx-3 h-px flex-1 bg-[#e5e7eb] data-[state=completed]:bg-black' />
									)}
								</Stepper.Item>
							))}
						</Stepper.List>
						<div className='flex justify-between'>
							<Stepper.PrevTrigger className='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40'>
								Back
							</Stepper.PrevTrigger>
							<Stepper.NextTrigger className='rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40'>
								Next
							</Stepper.NextTrigger>
						</div>
					</Stepper.Root>
				</div>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [step, setStep] = useState(0);
		return (
			<div className='w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-6'>
				<Stepper.Root
					count={steps.length}
					value={step}
					onChange={setStep}
					className='space-y-6'>
					<Stepper.List className='flex items-center'>
						{steps.map((s, i) => (
							<Stepper.Item
								key={s.title}
								index={i}
								className='flex flex-1 items-center last:flex-none'>
								<Stepper.Trigger className={triggerCls}>
									<span
										className={dotCls}
										data-state={
											i === step ? 'active'
											: i < step ?
												'completed'
											:	'inactive'
										}>
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

					<Stepper.Content
						index={0}
						className='space-y-3'>
						<p className='text-sm font-semibold text-black'>Account</p>
						<input
							type='email'
							placeholder='Email address'
							className='w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black'
						/>
						<input
							type='password'
							placeholder='Password'
							className='w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black'
						/>
					</Stepper.Content>

					<Stepper.Content
						index={1}
						className='space-y-3'>
						<p className='text-sm font-semibold text-black'>Profile</p>
						<input
							type='text'
							placeholder='Full name'
							className='w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black'
						/>
						<textarea
							placeholder='Short bio'
							rows={3}
							className='w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-black'
						/>
					</Stepper.Content>

					<Stepper.Content
						index={2}
						className='rounded-lg bg-[#f5f5f5] p-4 text-sm text-[#374151]'>
						<p className='mb-1 font-semibold text-black'>Review</p>
						Everything looks good. Submit to finish setting up your account.
					</Stepper.Content>

					<div className='flex justify-between'>
						<Stepper.PrevTrigger className='rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40'>
							Back
						</Stepper.PrevTrigger>
						<Stepper.NextTrigger className='rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40'>
							{step === steps.length - 1 ? 'Submit' : 'Next'}
						</Stepper.NextTrigger>
					</div>
				</Stepper.Root>
			</div>
		);
	},
};
