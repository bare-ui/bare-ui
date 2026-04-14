import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Timeago } from '.';

const meta = {
	title: 'Components/Timeago',
	component: Timeago,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Relative or formatted timestamp that updates live.',
			},
		},
	},
} satisfies Meta<typeof Timeago>;

export default meta;

export const RecentDate = {
	render: () => ({
		setup: () => () => {
			const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

			return h('div', { class: 'flex flex-col gap-4' }, [
				h('div', null, [
					h('span', { class: 'text-sm font-medium text-[#9ca3af]' }, 'Duration (5 minutes ago):'),
					h(Timeago, { datetime: fiveMinutesAgo, isDuration: true, class: 'ml-2 text-sm text-black' }),
				]),
				h('div', null, [
					h('span', { class: 'text-sm font-medium text-[#9ca3af]' }, 'Full date/time:'),
					h(Timeago, { datetime: fiveMinutesAgo, class: 'ml-2 text-sm text-black' }),
				]),
				h('div', null, [
					h('span', { class: 'text-sm font-medium text-[#9ca3af]' }, 'Time only:'),
					h(Timeago, { datetime: fiveMinutesAgo, timeOnly: true, class: 'ml-2 text-sm text-black' }),
				]),
			]);
		},
	}),
} satisfies StoryObj;

export const OlderDate = {
	render: () => ({
		setup: () => () => {
			const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
			const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
			const lastYear = new Date('2025-06-15T10:30:00');

			return h('div', { class: 'flex flex-col gap-4' }, [
				h('div', null, [
					h('span', { class: 'text-sm font-medium text-[#9ca3af]' }, '3 days ago:'),
					h(Timeago, { datetime: threeDaysAgo, class: 'ml-2 text-sm text-black' }),
				]),
				h('div', null, [
					h('span', { class: 'text-sm font-medium text-[#9ca3af]' }, '2 weeks ago:'),
					h(Timeago, { datetime: twoWeeksAgo, class: 'ml-2 text-sm text-black' }),
				]),
				h('div', null, [
					h('span', { class: 'text-sm font-medium text-[#9ca3af]' }, 'Last year:'),
					h(Timeago, { datetime: lastYear, class: 'ml-2 text-sm text-black' }),
				]),
				h('div', null, [
					h('span', { class: 'text-sm font-medium text-[#9ca3af]' }, '3 days ago (duration):'),
					h(Timeago, { datetime: threeDaysAgo, isDuration: true, class: 'ml-2 text-sm text-black' }),
				]),
			]);
		},
	}),
} satisfies StoryObj;
