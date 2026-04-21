import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { OTP } from '.';

const meta = {
	title: 'Forms/OTP',
	component: OTP.Root,
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
	render: () => ({
		setup: () => () =>
			h(
				OTP.Root,
				{ length: 6, class: 'flex items-center gap-2' },
				() =>
					Array.from({ length: 6 }).map((_, i) =>
						h(OTP.Slot, { key: i, index: i, class: slotCls }),
					),
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(OTP.Root, { length: 6, class: 'flex items-center gap-2' }, () => [
				...[0, 1, 2].map((i) => h(OTP.Slot, { key: i, index: i, class: slotCls })),
				h(OTP.Separator, { class: 'text-xl font-light text-[#6b7280]' }),
				...[3, 4, 5].map((i) => h(OTP.Slot, { key: i, index: i, class: slotCls })),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const value = ref('');
			const status = ref<'idle' | 'success' | 'error'>('idle');

			const handleComplete = (v: string) => {
				status.value = v === '123456' ? 'success' : 'error';
			};

			const handleChange = (v: string) => {
				value.value = v;
				if (v.length < 6) status.value = 'idle';
			};

			return () => {
				const completeCls = [
					'h-12 w-10 rounded-[8px] border border-black text-center text-lg font-mono font-semibold',
					'outline-none transition-all caret-transparent',
					status.value === 'success'
						? 'bg-black text-white'
						: status.value === 'error'
							? 'bg-[#f5f5f5] text-black'
							: 'bg-white text-black data-[active]:ring-4 data-[active]:ring-black/20',
				].join(' ');

				return h('div', { class: 'flex flex-col items-center gap-4' }, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280]' },
						'Try 123456',
					),
					h(
						OTP.Root,
						{
							value: value.value,
							onChange: handleChange,
							onComplete: handleComplete,
							length: 6,
							class: 'flex items-center gap-2',
						},
						() =>
							Array.from({ length: 6 }).map((_, i) =>
								h(OTP.Slot, { key: i, index: i, class: completeCls }),
							),
					),
					...(status.value === 'success'
						? [h('p', { class: 'text-sm font-medium text-black' }, '\u2713 Code verified')]
						: []),
					...(status.value === 'error'
						? [h('p', { class: 'text-sm font-medium text-black' }, '\u2717 Invalid code, try again')]
						: []),
				]);
			};
		},
	}),
};
