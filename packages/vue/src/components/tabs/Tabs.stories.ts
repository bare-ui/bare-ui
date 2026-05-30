import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Tabs } from '.';

const meta = {
	title: 'Layout/Tabs',
	component: Tabs.Root,
	subcomponents: {
		'Tabs.List': Tabs.List,
		'Tabs.Trigger': Tabs.Trigger,
		'Tabs.Content': Tabs.Content,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Accessible tabs with horizontal/vertical orientation, automatic/manual activation, and full keyboard navigation.',
			},
		},
	},
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const listCls = 'flex gap-1 border-b border-black';

const triggerCls = [
	'cursor-pointer px-4 py-2 text-sm font-medium text-black outline-none',
	'border-b-2 border-transparent -mb-px transition-colors',
	'hover:bg-[#f5f5f5]',
	'data-[state=active]:border-black data-[state=active]:font-semibold',
	'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-1',
	'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
].join(' ');

const contentCls = 'mt-4 text-sm text-black outline-none';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Tabs.Root, { defaultValue: 'overview', class: 'w-full max-w-lg' }, () => [
				h(Tabs.List, { class: listCls }, () => [
					h(Tabs.Trigger, { value: 'overview', class: triggerCls }, () => 'Overview'),
					h(Tabs.Trigger, { value: 'details', class: triggerCls }, () => 'Details'),
					h(Tabs.Trigger, { value: 'reviews', class: triggerCls }, () => 'Reviews'),
				]),
				h(Tabs.Content, { value: 'overview', class: contentCls }, () => 'A high-level summary of the product features and what makes it special.'),
				h(Tabs.Content, { value: 'details', class: contentCls }, () => 'Detailed specifications, dimensions, materials, and technical information.'),
				h(Tabs.Content, { value: 'reviews', class: contentCls }, () => 'Customer reviews and ratings from verified buyers.'),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const tabs = [
				{ value: 'general', label: 'General' },
				{ value: 'profile', label: 'Profile' },
				{ value: 'security', label: 'Security' },
				{ value: 'notifications', label: 'Notifications' },
			];
			const panels: Record<string, [string, string]> = {
				general: ['General settings', 'Configure language, timezone, and account preferences.'],
				profile: ['Profile', 'Update your name, photo, and biography.'],
				security: ['Security', 'Manage password, two-factor auth, and active sessions.'],
				notifications: ['Notifications', 'Choose what events you want to be notified about.'],
			};
			const verticalTriggerCls = [
				'cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm font-medium text-black outline-none',
				'transition-colors hover:bg-[#f5f5f5]',
				'data-[state=active]:bg-black data-[state=active]:text-white',
				'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black',
			].join(' ');
			return () =>
				h(Tabs.Root, { defaultValue: 'general', orientation: 'vertical', class: 'flex w-full max-w-2xl gap-6' }, () => [
					h(Tabs.List, { class: 'flex flex-col gap-1 border-r border-black pr-3 min-w-[140px]' }, () =>
						tabs.map((tab) => h(Tabs.Trigger, { key: tab.value, value: tab.value, class: verticalTriggerCls }, () => tab.label)),
					),
					h('div', { class: 'flex-1' },
						tabs.map((tab) =>
							h(Tabs.Content, { value: tab.value, class: 'text-sm text-black outline-none' }, () => [
								h('h3', { class: 'text-base font-semibold mb-1' }, panels[tab.value][0]),
								h('p', { class: 'text-[#6b7280]' }, panels[tab.value][1]),
							]),
						),
					),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const tabs = [
				{ value: 'inbox', label: 'Inbox', count: 12 },
				{ value: 'starred', label: 'Starred', count: 3 },
				{ value: 'archive', label: 'Archive', count: 0 },
			];
			const panels: Record<string, [string, string]> = {
				inbox: ['You have 12 new messages.', 'Use ←/→ then press Enter to switch tabs (manual activation mode).'],
				starred: ['3 starred conversations.', 'Pinned items live here.'],
				archive: ['Your archive is empty.', 'Messages you archive will appear here.'],
			};
			const complexTriggerCls = [
				'flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-black outline-none',
				'transition-colors hover:bg-white',
				'data-[state=active]:bg-white data-[state=active]:font-semibold',
				'data-[focus-visible]:ring-2 data-[focus-visible]:ring-inset data-[focus-visible]:ring-black',
			].join(' ');
			return () =>
				h(Tabs.Root, { defaultValue: 'inbox', activationMode: 'manual', class: 'w-full max-w-lg rounded-[20px] border border-black bg-white overflow-hidden' }, () => [
					h(Tabs.List, { class: 'flex border-b border-black bg-[#f5f5f5]' }, () =>
						tabs.map((tab) =>
							h(Tabs.Trigger, { key: tab.value, value: tab.value, class: complexTriggerCls }, () => [
								tab.label,
								tab.count > 0
									? h('span', { class: 'inline-flex min-w-[20px] items-center justify-center rounded-full border border-black bg-black px-1.5 py-0.5 text-xs font-bold leading-none text-white' }, tab.count)
									: null,
							]),
						),
					),
					...tabs.map((tab) =>
						h(Tabs.Content, { value: tab.value, class: 'p-5 text-sm text-black outline-none' }, () => [
							h('p', { class: 'font-medium' }, panels[tab.value][0]),
							h('p', { class: 'mt-1 text-[#6b7280]' }, panels[tab.value][1]),
						]),
					),
				]);
		},
	}),
};
