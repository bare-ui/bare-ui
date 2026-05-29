import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For, Show } from 'solid-js';
import { OTP } from './OTP';

const meta = {
	title: 'Forms/OTP',
	component: OTP.Root,
	subcomponents: {
		'OTP.Slot': OTP.Slot,
		'OTP.Separator': OTP.Separator,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'One-time password input with configurable length and completion callback.',
			},
		},
	},
} satisfies Meta<typeof OTP.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const slotCls = [
	'h-12 w-10 rounded-[8px] border border-black bg-white text-center text-lg font-mono font-semibold text-black',
	'outline-none transition-all caret-transparent',
	'data-[active]:ring-4 data-[active]:ring-black/20',
].join(' ');

export const Default: Story = {
	render: () => (
		<OTP.Root
			length={6}
			class='flex items-center gap-2'>
			<For each={Array.from({ length: 6 }, (_, i) => i)}>
				{(i) => (
					<OTP.Slot
						index={i}
						class={slotCls}
					/>
				)}
			</For>
		</OTP.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<OTP.Root
			length={6}
			class='flex items-center gap-2'>
			<For each={[0, 1, 2]}>
				{(i) => (
					<OTP.Slot
						index={i}
						class={slotCls}
					/>
				)}
			</For>
			<OTP.Separator class='text-xl font-light text-[#6b7280]' />
			<For each={[3, 4, 5]}>
				{(i) => (
					<OTP.Slot
						index={i}
						class={slotCls}
					/>
				)}
			</For>
		</OTP.Root>
	),
};

export const Complex: Story = {
	render: () => {
		const [value, setValue] = createSignal('');
		const [status, setStatus] = createSignal<'idle' | 'success' | 'error'>('idle');

		const handleComplete = (v: string) => {
			setStatus(v === '123456' ? 'success' : 'error');
		};

		const handleChange = (v: string) => {
			setValue(v);
			if (v.length < 6) setStatus('idle');
		};

		const completeCls = () =>
			[
				'h-12 w-10 rounded-[8px] border border-black text-center text-lg font-mono font-semibold',
				'outline-none transition-all caret-transparent',
				status() === 'success' ?
					'bg-black text-white'
				: status() === 'error' ?
					'bg-[#f5f5f5] text-black'
				:	'bg-white text-black data-[active]:ring-4 data-[active]:ring-black/20',
			].join(' ');

		return (
			<div class='flex flex-col items-center gap-4'>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280]'>Try 123456</p>
				<OTP.Root
					value={value()}
					onChange={handleChange}
					onComplete={handleComplete}
					length={6}
					class='flex items-center gap-2'>
					<For each={Array.from({ length: 6 }, (_, i) => i)}>
						{(i) => (
							<OTP.Slot
								index={i}
								class={completeCls()}
							/>
						)}
					</For>
				</OTP.Root>
				<Show when={status() === 'success'}>
					<p class='text-sm font-medium text-black'>&#10003; Code verified</p>
				</Show>
				<Show when={status() === 'error'}>
					<p class='text-sm font-medium text-black'>&#10007; Invalid code, try again</p>
				</Show>
			</div>
		);
	},
};
