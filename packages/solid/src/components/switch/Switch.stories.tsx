import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For } from 'solid-js';
import { Switch } from './Switch';

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
	render: () => {
		const [enabled, setEnabled] = createSignal(false);

		return (
			<div class='flex items-center gap-3'>
				<label class='text-sm font-medium text-black'>Enable notifications</label>
				<Switch.Root
					checked={enabled()}
					onChange={() => setEnabled(!enabled())}
					class={trackCls}>
					<Switch.Thumb class={thumbCls} />
				</Switch.Root>
			</div>
		);
	},
};

export const Composed: Story = {
	render: () => {
		const [notifications, setNotifications] = createSignal(true);
		const [emails, setEmails] = createSignal(false);
		const [marketing, setMarketing] = createSignal(false);

		const items = () => [
			{ label: 'Push notifications', value: notifications(), onChange: () => setNotifications(!notifications()) },
			{ label: 'Email updates', value: emails(), onChange: () => setEmails(!emails()) },
			{ label: 'Marketing emails', value: marketing(), onChange: () => setMarketing(!marketing()) },
		];

		return (
			<div class='w-80 divide-y divide-[#2a2a2a] rounded-[8px] border border-black bg-white'>
				<For each={items()}>
					{(item) => (
						<div class='flex items-center justify-between px-4 py-3'>
							<p class='text-sm font-medium text-black'>{item.label}</p>
							<Switch.Root
								checked={item.value}
								onChange={item.onChange}
								class={trackCls}>
								<Switch.Thumb class={thumbCls} />
							</Switch.Root>
						</div>
					)}
				</For>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [notifications, setNotifications] = createSignal(true);
		const [emails, setEmails] = createSignal(false);
		const [marketing, setMarketing] = createSignal(false);

		const items = () => [
			{
				label: 'Push notifications',
				desc: 'Receive alerts in your browser',
				value: notifications(),
				onChange: () => setNotifications(!notifications()),
			},
			{
				label: 'Email updates',
				desc: 'Get a weekly digest of activity',
				value: emails(),
				onChange: () => setEmails(!emails()),
			},
			{
				label: 'Marketing emails',
				desc: 'Promotions and product announcements',
				value: marketing(),
				onChange: () => setMarketing(!marketing()),
			},
		];

		return (
			<div class='w-80 divide-y divide-[#2a2a2a] rounded-[20px] border border-black bg-white'>
				<For each={items()}>
					{(item) => (
						<div class='flex items-center justify-between px-4 py-3'>
							<div>
								<p class='text-sm font-medium text-black'>{item.label}</p>
								<p class='text-xs text-[#6b7280]'>{item.desc}</p>
							</div>
							<Switch.Root
								checked={item.value}
								onChange={item.onChange}
								class={trackCls}>
								<Switch.Thumb class={thumbCls} />
							</Switch.Root>
						</div>
					)}
				</For>
			</div>
		);
	},
};
