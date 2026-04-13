import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { OTP } from '.';

const meta = {
	title: 'Components/OTP',
	component: OTP.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'One-time password input with individual digit slots.',
			},
		},
	},
} satisfies Meta<typeof OTP.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const slotCls =
	'w-12 h-14 text-center text-lg font-semibold border-2 border-black rounded-xl outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
const containerCls = 'flex items-center gap-2';
const separatorCls = 'text-xl font-bold text-black mx-1';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(OTP.Root, { length: 6, class: containerCls }, () =>
				Array.from({ length: 6 }, (_, i) => h(OTP.Slot, { key: i, index: i, class: slotCls })),
			),
	}),
};

export const WithSeparator: Story = {
	render: () => ({
		setup: () => () =>
			h(OTP.Root, { length: 6, class: containerCls }, () => [
				h(OTP.Slot, { index: 0, class: slotCls }),
				h(OTP.Slot, { index: 1, class: slotCls }),
				h(OTP.Slot, { index: 2, class: slotCls }),
				h(OTP.Separator, { class: separatorCls }),
				h(OTP.Slot, { index: 3, class: slotCls }),
				h(OTP.Slot, { index: 4, class: slotCls }),
				h(OTP.Slot, { index: 5, class: slotCls }),
			]),
	}),
};

export const FourDigit: Story = {
	render: () => ({
		setup: () => () =>
			h(OTP.Root, { length: 4, class: containerCls }, () =>
				Array.from({ length: 4 }, (_, i) => h(OTP.Slot, { key: i, index: i, class: slotCls })),
			),
	}),
};
