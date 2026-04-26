import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { ProgressBar } from './ProgressBar';

const meta = {
	title: 'Feedback/ProgressBar',
	component: ProgressBar,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Accessible progress indicator with role="progressbar" and ARIA attributes.',
			},
		},
	},
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const trackCls =
	'w-full overflow-hidden rounded-full bg-[#e5e5e5] [&_[data-part=fill]]:h-full [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:bg-black [&_[data-part=fill]]:transition-[width] [&_[data-part=fill]]:duration-300';

export const Default: Story = {
	render: () => (
		<div class='w-80'>
			<ProgressBar
				percentage={60}
				class={['h-2', trackCls].join(' ')}
			/>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex w-80 flex-col gap-3'>
			<For each={[0, 25, 50, 75, 100]}>
				{(p) => (
					<div class='flex items-center gap-3'>
						<div class='w-8 text-right text-xs text-[#6b7280]'>{p}%</div>
						<ProgressBar
							percentage={p}
							class={['flex-1 h-2', trackCls].join(' ')}
						/>
					</div>
				)}
			</For>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='w-80'>
			<div class='mb-1 flex justify-between text-sm'>
				<span class='font-medium text-black'>Storage used</span>
				<span class='text-[#6b7280]'>68%</span>
			</div>
			<ProgressBar
				percentage={68}
				class={['h-2', trackCls].join(' ')}
			/>
			<p class='mt-1 text-xs text-[#6b7280]'>6.8 GB of 10 GB used</p>
		</div>
	),
};
