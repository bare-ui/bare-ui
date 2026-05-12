import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { Calendar } from '.';
import type { CalendarDay, CalendarWeekday } from './Calendar.types';

const meta = {
	title: 'Forms/Calendar',
	component: Calendar.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Headless month calendar. Compose Nav + Title + Grid; data-attributes drive selected/today/disabled/outside-month styling.',
			},
		},
	},
} satisfies Meta<typeof Calendar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperCls = 'inline-block rounded-[20px] border border-black bg-white p-3 w-fit self-start';
const navCls = 'flex items-center justify-between mb-2';
const navBtnCls = 'cursor-pointer rounded-[6px] px-2 py-1 text-sm text-black hover:bg-[#f5f5f5] disabled:opacity-40';
const titleCls = 'text-sm font-semibold text-black';
const dayCls =
	'cursor-pointer rounded-[6px] p-1.5 text-center text-sm text-black hover:bg-[#f5f5f5] data-[selected]:bg-black data-[selected]:text-white data-[today]:font-bold data-[today]:underline data-[outside-month]:text-[#a3a3a3] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30';

function renderCalendarBody(): unknown[] {
	return [
		h(Calendar.Nav, { class: navCls }, () => [
			h(Calendar.PrevButton, { class: navBtnCls }, () => '‹'),
			h(Calendar.Title, { class: titleCls }),
			h(Calendar.NextButton, { class: navBtnCls }, () => '›'),
		]),
		h(
			Calendar.Grid,
			{},
			{
				day: ({ day }: { day: CalendarDay }) =>
					h('button', { ...day.props, class: dayCls }, day.dayOfMonth),
				weekday: ({ weekday }: { weekday: CalendarWeekday }) =>
					h(
						'div',
						{ class: 'text-center text-xs font-medium text-[#6b7280] py-1' },
						weekday.short,
					),
			},
		),
	];
}

export const Default: Story = {
	render: () => ({
		setup: () => () => h(Calendar.Root, { class: wrapperCls }, () => renderCalendarBody()),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const selected = ref<Date | null>(new Date());
			return () =>
				h('div', { class: 'flex flex-col gap-2' }, [
					h(
						Calendar.Root,
						{
							value: selected.value,
							onChange: (d: Date | null) => (selected.value = d),
							class: wrapperCls,
						},
						() => renderCalendarBody(),
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, [
						'Selected: ',
						h(
							'span',
							{ class: 'font-medium text-black' },
							selected.value ? selected.value.toLocaleDateString() : '∅',
						),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const selected = ref<Date | null>(null);
			const today = new Date();
			const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
			const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
			const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
			return () =>
				h('div', { class: 'flex flex-col gap-2' }, [
					h(
						Calendar.Root,
						{
							value: selected.value,
							onChange: (d: Date | null) => (selected.value = d),
							minDate,
							maxDate,
							isDateDisabled: isWeekend,
							weekStartsOn: 1,
							class: wrapperCls,
						},
						() => renderCalendarBody(),
					),
					h(
						'p',
						{ class: 'text-xs text-[#6b7280]' },
						'Mon-first, weekends + past disabled, max 2 months ahead.',
					),
				]);
		},
	}),
};
