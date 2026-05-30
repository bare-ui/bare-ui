import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { DatePicker } from '.';
import { Calendar } from '../calendar';
import type { CalendarDay, CalendarWeekday } from '../calendar/Calendar.types';

const meta = {
	title: 'Forms/DatePicker',
	component: DatePicker.Root,
	subcomponents: {
		'DatePicker.Trigger': DatePicker.Trigger,
		'DatePicker.Value': DatePicker.Value,
		'DatePicker.Content': DatePicker.Content,
		'DatePicker.Calendar': DatePicker.Calendar,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Trigger + popover Calendar. Closes on selection by default.' },
		},
	},
} satisfies Meta<typeof DatePicker.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls =
	'inline-flex cursor-pointer items-center gap-2 rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:ring-2 data-[state=open]:ring-black data-[state=open]:ring-offset-1';
const contentCls =
	'absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-3';
const navCls = 'flex items-center justify-between mb-2';
const navBtnCls = 'cursor-pointer rounded-[6px] px-2 py-1 text-sm text-black hover:bg-[#f5f5f5] disabled:opacity-40';
const titleCls = 'text-sm font-semibold text-black';
const dayCls =
	'cursor-pointer rounded-[6px] p-1.5 text-center text-sm text-black hover:bg-[#f5f5f5] data-[selected]:bg-black data-[selected]:text-white data-[today]:font-bold data-[today]:underline data-[outside-month]:text-[#a3a3a3] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30';

const calendarIcon = () =>
	h('svg', { class: 'size-4 text-[#6b7280]', viewBox: '0 0 20 20', fill: 'currentColor' }, [
		h('path', {
			d: 'M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z',
		}),
	]);

function pickerContent() {
	return h(DatePicker.Calendar, {}, () => [
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
	]);
}

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(DatePicker.Root, { class: 'relative inline-block' }, () => [
				h(DatePicker.Trigger, { class: triggerCls }, () => [
					h(DatePicker.Value, { placeholder: 'Pick a date' }),
					calendarIcon(),
				]),
				h(DatePicker.Content, { class: contentCls }, () => [pickerContent()]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const date = ref<Date | null>(new Date());
			return () =>
				h('div', { class: 'flex flex-col gap-2' }, [
					h('label', { class: 'text-sm font-medium text-black' }, 'Date of birth'),
					h(
						DatePicker.Root,
						{
							value: date.value,
							onChange: (d: Date | null) => (date.value = d),
							class: 'relative inline-block',
						},
						() => [
							h(DatePicker.Trigger, { class: `${triggerCls} w-64 justify-between` }, () => [
								h(DatePicker.Value, { placeholder: 'Select a date' }),
								calendarIcon(),
							]),
							h(DatePicker.Content, { class: contentCls }, () => [pickerContent()]),
						],
					),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const from = ref<Date | null>(null);
			const to = ref<Date | null>(null);
			return () =>
				h('div', { class: 'flex w-full max-w-md flex-col gap-3' }, [
					h('label', { class: 'text-sm font-medium text-black' }, 'Trip dates'),
					h('div', { class: 'flex items-center gap-2' }, [
						h(
							DatePicker.Root,
							{
								value: from.value,
								onChange: (d: Date | null) => (from.value = d),
								class: 'relative inline-block flex-1',
							},
							() => [
								h(
									DatePicker.Trigger,
									{ class: `${triggerCls} w-full justify-between` },
									() => [h(DatePicker.Value, { placeholder: 'Departure' })],
								),
								h(DatePicker.Content, { class: contentCls }, () => [pickerContent()]),
							],
						),
						h('span', { class: 'text-[#6b7280]' }, '→'),
						h(
							DatePicker.Root,
							{
								value: to.value,
								onChange: (d: Date | null) => (to.value = d),
								class: 'relative inline-block flex-1',
							},
							() => [
								h(
									DatePicker.Trigger,
									{ class: `${triggerCls} w-full justify-between` },
									() => [h(DatePicker.Value, { placeholder: 'Return' })],
								),
								h(DatePicker.Content, { class: contentCls }, () => [pickerContent()]),
							],
						),
					]),
					from.value && to.value
						? h(
								'p',
								{ class: 'text-xs text-[#6b7280]' },
								`${from.value.toLocaleDateString()} → ${to.value.toLocaleDateString()}`,
							)
						: null,
				]);
		},
	}),
};
