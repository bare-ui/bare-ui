import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta = {
	title: 'Components/Switch',
	component: Switch.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const trackCls =
	'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors outline-none data-[checked]:bg-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-blue-500 data-[focus-visible]:ring-offset-2';

const thumbCls =
	'pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-sm ring-0 transition-transform data-[checked]:translate-x-5';

export const Default: Story = {
	render: () => (
		<Switch.Root className={trackCls}>
			<Switch.Thumb className={thumbCls} />
		</Switch.Root>
	),
};

export const Checked: Story = {
	render: () => (
		<Switch.Root
			defaultChecked
			className={trackCls}>
			<Switch.Thumb className={thumbCls} />
		</Switch.Root>
	),
};

export const WithLabel: Story = {
	render: () => {
		const [enabled, setEnabled] = useState(false);
		return (
			<label className='flex cursor-pointer items-center gap-3'>
				<Switch.Root
					checked={enabled}
					onChange={setEnabled}
					className={trackCls}>
					<Switch.Thumb className={thumbCls} />
				</Switch.Root>
				<span className='text-sm font-medium text-gray-700'>{enabled ? 'Enabled' : 'Disabled'}</span>
			</label>
		);
	},
};

export const Sizes: Story = {
	render: () => (
		<div className='flex flex-col gap-4'>
			{/* Small */}
			<div className='flex items-center gap-3'>
				<Switch.Root
					defaultChecked
					className='relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors outline-none data-[checked]:bg-blue-600'>
					<Switch.Thumb className='pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-4' />
				</Switch.Root>
				<span className='text-sm text-gray-600'>Small</span>
			</div>
			{/* Medium (default) */}
			<div className='flex items-center gap-3'>
				<Switch.Root
					defaultChecked
					className={trackCls}>
					<Switch.Thumb className={thumbCls} />
				</Switch.Root>
				<span className='text-sm text-gray-600'>Medium</span>
			</div>
			{/* Large */}
			<div className='flex items-center gap-3'>
				<Switch.Root
					defaultChecked
					className='relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors outline-none data-[checked]:bg-blue-600'>
					<Switch.Thumb className='pointer-events-none inline-block size-7 translate-x-0 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-6' />
				</Switch.Root>
				<span className='text-sm text-gray-600'>Large</span>
			</div>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className='flex flex-col gap-3'>
			<Switch.Root
				disabled
				className={trackCls}>
				<Switch.Thumb className={thumbCls} />
			</Switch.Root>
			<Switch.Root
				disabled
				defaultChecked
				className={trackCls}>
				<Switch.Thumb className={thumbCls} />
			</Switch.Root>
		</div>
	),
};

export const SettingsExample: Story = {
	render: () => {
		const [settings, setSettings] = useState({
			notifications: true,
			emails: false,
			marketing: false,
		});

		const toggle = (key: keyof typeof settings) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

		const items = [
			{
				key: 'notifications' as const,
				label: 'Push notifications',
				desc: 'Receive alerts in your browser',
			},
			{
				key: 'emails' as const,
				label: 'Email updates',
				desc: 'Get a weekly digest of activity',
			},
			{
				key: 'marketing' as const,
				label: 'Marketing emails',
				desc: 'Promotions and product announcements',
			},
		];

		return (
			<div className='w-80 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white'>
				{items.map(({ key, label, desc }) => (
					<div
						key={key}
						className='flex items-center justify-between px-4 py-3'>
						<div>
							<p className='text-sm font-medium text-gray-900'>{label}</p>
							<p className='text-xs text-gray-500'>{desc}</p>
						</div>
						<Switch.Root
							checked={settings[key]}
							onChange={() => toggle(key)}
							className={trackCls}>
							<Switch.Thumb className={thumbCls} />
						</Switch.Root>
					</div>
				))}
			</div>
		);
	},
};
