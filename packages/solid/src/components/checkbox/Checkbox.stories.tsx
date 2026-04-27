import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { Checkbox } from './Checkbox';

const meta = {
	title: 'Forms/Checkbox',
	component: Checkbox.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Multi-select checkbox group with controlled state.',
			},
		},
	},
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Checkbox.Root
			name='fruits'
			class='flex flex-col gap-3'>
			<For each={['Apple', 'Banana', 'Cherry']}>
				{(fruit) => (
					<Checkbox.Item
						value={fruit.toLowerCase()}
						class='group flex cursor-pointer items-center gap-2'>
						<span class='flex h-5 w-5 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black'>
							<Checkbox.Indicator>
								<svg
									class='h-3 w-3'
									viewBox='0 0 12 12'
									fill='none'>
									<path
										d='M2 6l3 3 5-5'
										stroke='currentColor'
										stroke-width='2'
									/>
								</svg>
							</Checkbox.Indicator>
						</span>
						<Checkbox.Label class='select-none text-sm text-black'>{fruit}</Checkbox.Label>
					</Checkbox.Item>
				)}
			</For>
		</Checkbox.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const composedItems = [
			{ value: 'terms', label: 'Terms of Service', desc: 'You agree to our terms' },
			{ value: 'privacy', label: 'Privacy Policy', desc: 'You accept our privacy policy' },
			{ value: 'newsletter', label: 'Newsletter', desc: 'Receive weekly updates' },
		];

		return (
			<Checkbox.Root
				name='agreements'
				class='flex flex-col gap-4'>
				<For each={composedItems}>
					{(item) => (
						<Checkbox.Item
							value={item.value}
							class='group flex cursor-pointer items-start gap-3'>
							<span class='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black'>
								<Checkbox.Indicator>
									<svg
										class='h-3 w-3'
										viewBox='0 0 12 12'
										fill='none'>
										<path
											d='M2 6l3 3 5-5'
											stroke='currentColor'
											stroke-width='2'
										/>
									</svg>
								</Checkbox.Indicator>
							</span>
							<div class='flex flex-col'>
								<Checkbox.Label class='select-none text-sm font-medium text-black'>
									{item.label}
								</Checkbox.Label>
								<span class='text-xs text-[#6b7280]'>{item.desc}</span>
							</div>
						</Checkbox.Item>
					)}
				</For>
			</Checkbox.Root>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const settingsItems = [
			{ value: 'notifications', label: 'Push Notifications' },
			{ value: 'emails', label: 'Email Updates' },
			{ value: 'analytics', label: 'Usage Analytics' },
		];

		return (
			<div class='w-full max-w-sm rounded-[20px] border border-black bg-white'>
				<div class='px-5 py-4'>
					<p class='text-sm font-medium text-black'>Settings</p>
				</div>
				<Checkbox.Root
					name='settings'
					class='flex flex-col divide-y divide-black/10'>
					<For each={settingsItems}>
						{(item) => (
							<Checkbox.Item
								value={item.value}
								class='group flex cursor-pointer items-center justify-between px-5 py-4'>
								<Checkbox.Label class='select-none text-sm text-black'>{item.label}</Checkbox.Label>
								<span class='flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black'>
									<Checkbox.Indicator>
										<svg
											class='h-3 w-3'
											viewBox='0 0 12 12'
											fill='none'>
											<path
												d='M2 6l3 3 5-5'
												stroke='currentColor'
												stroke-width='2'
											/>
										</svg>
									</Checkbox.Indicator>
								</span>
							</Checkbox.Item>
						)}
					</For>
				</Checkbox.Root>
			</div>
		);
	},
};
