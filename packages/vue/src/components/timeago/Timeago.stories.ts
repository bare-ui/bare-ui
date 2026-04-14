import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Timeago } from '.';

const meta = {
	title: 'Media/Timeago',
	component: Timeago,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Relative time display with duration, full date/time, and time-only formats.',
			},
		},
	},
} satisfies Meta<typeof Timeago>;

export default meta;

export const Default = {
	render: () => ({
		setup: () => () => {
			const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

			return h('div', {}, [
				h('span', { class: 'text-sm font-medium text-[#6b7280]' }, 'Duration: '),
				h(Timeago, { datetime: fiveMinutesAgo, isDuration: true, class: 'text-sm text-black' }),
			]);
		},
	}),
} satisfies StoryObj;

export const Composed = {
	render: () => ({
		setup: () => () => {
			const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

			return h('div', { class: 'flex flex-col gap-3' }, [
				h('div', {}, [
					h('span', { class: 'text-sm font-medium text-[#6b7280]' }, 'Duration: '),
					h(Timeago, { datetime: fiveMinutesAgo, isDuration: true, class: 'text-sm text-black' }),
				]),
				h('div', {}, [
					h('span', { class: 'text-sm font-medium text-[#6b7280]' }, 'Full date/time: '),
					h(Timeago, { datetime: fiveMinutesAgo, class: 'text-sm text-black' }),
				]),
				h('div', {}, [
					h('span', { class: 'text-sm font-medium text-[#6b7280]' }, 'Time only: '),
					h(Timeago, { datetime: fiveMinutesAgo, timeOnly: true, class: 'text-sm text-black' }),
				]),
			]);
		},
	}),
} satisfies StoryObj;

export const Complex = {
	render: () => ({
		setup: () => () => {
			const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
			const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
			const lastYear = new Date('2025-06-15T10:30:00');

			return h('div', { class: 'flex flex-col gap-3' }, [
				h('div', {}, [
					h('span', { class: 'text-sm font-medium text-[#6b7280]' }, '3 days ago: '),
					h(Timeago, { datetime: threeDaysAgo, class: 'text-sm text-black' }),
				]),
				h('div', {}, [
					h('span', { class: 'text-sm font-medium text-[#6b7280]' }, '2 weeks ago: '),
					h(Timeago, { datetime: twoWeeksAgo, class: 'text-sm text-black' }),
				]),
				h('div', {}, [
					h('span', { class: 'text-sm font-medium text-[#6b7280]' }, 'Last year: '),
					h(Timeago, { datetime: lastYear, class: 'text-sm text-black' }),
				]),
			]);
		},
	}),
} satisfies StoryObj;
