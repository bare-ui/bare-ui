import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Switch } from '.';

const meta = {
	title: 'Forms/Switch',
	component: Switch.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Toggle switch with checked state and thumb animation.',
			},
		},
	},
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const trackCls =
	'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-black bg-[#e5e5e5] transition-colors outline-none data-[checked]:bg-black data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2';

const thumbCls =
	'pointer-events-none inline-block size-5 translate-x-0 rounded-full border border-black bg-white transition-transform data-[checked]:translate-x-5';

export const Default: Story = {
	render: () => ({
		setup() {
			const enabled = ref(false);
			return () =>
				h('div', { class: 'flex items-center gap-3' }, [
					h('label', { class: 'text-sm font-medium text-black' }, 'Enable notifications'),
					h(
						Switch.Root,
						{
							checked: enabled.value,
							onChange: () => (enabled.value = !enabled.value),
							class: trackCls,
						},
						() => [h(Switch.Thumb, { class: thumbCls })],
					),
				]);
		},
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const notifications = ref(true);
			const emails = ref(false);
			const marketing = ref(false);

			return () => {
				const items = [
					{
						label: 'Push notifications',
						value: notifications,
						toggle: () => (notifications.value = !notifications.value),
					},
					{ label: 'Email updates', value: emails, toggle: () => (emails.value = !emails.value) },
					{
						label: 'Marketing emails',
						value: marketing,
						toggle: () => (marketing.value = !marketing.value),
					},
				];

				return h(
					'div',
					{ class: 'w-80 divide-y divide-[#2a2a2a] rounded-[8px] border border-black bg-white' },
					items.map(({ label, value, toggle }) =>
						h('div', { key: label, class: 'flex items-center justify-between px-4 py-3' }, [
							h('p', { class: 'text-sm font-medium text-black' }, label),
							h(Switch.Root, { checked: value.value, onChange: toggle, class: trackCls }, () => [
								h(Switch.Thumb, { class: thumbCls }),
							]),
						]),
					),
				);
			};
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const notifications = ref(true);
			const emails = ref(false);
			const marketing = ref(false);

			return () => {
				const items = [
					{
						label: 'Push notifications',
						desc: 'Receive alerts in your browser',
						value: notifications,
						toggle: () => (notifications.value = !notifications.value),
					},
					{
						label: 'Email updates',
						desc: 'Get a weekly digest of activity',
						value: emails,
						toggle: () => (emails.value = !emails.value),
					},
					{
						label: 'Marketing emails',
						desc: 'Promotions and product announcements',
						value: marketing,
						toggle: () => (marketing.value = !marketing.value),
					},
				];

				return h(
					'div',
					{ class: 'w-80 divide-y divide-[#2a2a2a] rounded-[20px] border border-black bg-white' },
					items.map(({ label, desc, value, toggle }) =>
						h('div', { key: label, class: 'flex items-center justify-between px-4 py-3' }, [
							h('div', null, [
								h('p', { class: 'text-sm font-medium text-black' }, label),
								h('p', { class: 'text-xs text-[#6b7280]' }, desc),
							]),
							h(Switch.Root, { checked: value.value, onChange: toggle, class: trackCls }, () => [
								h(Switch.Thumb, { class: thumbCls }),
							]),
						]),
					),
				);
			};
		},
	}),
};
