import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, Show } from 'solid-js';
import { DatePicker } from './DatePicker';
import { Calendar } from '../calendar/Calendar';

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
const contentCls = 'absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-3';
const navCls = 'flex items-center justify-between mb-2';
const navBtnCls = 'cursor-pointer rounded-[6px] px-2 py-1 text-sm text-black hover:bg-[#f5f5f5] disabled:opacity-40';
const titleCls = 'text-sm font-semibold text-black';
const dayCls =
	'cursor-pointer rounded-[6px] p-1.5 text-center text-sm text-black hover:bg-[#f5f5f5] data-[selected]:bg-black data-[selected]:text-white data-[today]:font-bold data-[today]:underline data-[outside-month]:text-[#a3a3a3] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30';

const PickerContent = () => (
	<DatePicker.Calendar>
		<Calendar.Nav class={navCls}>
			<Calendar.PrevButton class={navBtnCls}>‹</Calendar.PrevButton>
			<Calendar.Title class={titleCls} />
			<Calendar.NextButton class={navBtnCls}>›</Calendar.NextButton>
		</Calendar.Nav>
		<Calendar.Grid
			renderDay={(day) => (
				<button
					{...day.props}
					class={dayCls}>
					{day.dayOfMonth}
				</button>
			)}
			renderWeekday={(wd) => <div class='text-center text-xs font-medium text-[#6b7280] py-1'>{wd.short}</div>}
		/>
	</DatePicker.Calendar>
);

export const Default: Story = {
	render: () => (
		<DatePicker.Root class='relative inline-block'>
			<DatePicker.Trigger class={triggerCls}>
				<DatePicker.Value placeholder={<span class='text-[#a3a3a3]'>Pick a date</span>} />
				<svg
					class='size-4 text-[#6b7280]'
					viewBox='0 0 20 20'
					fill='currentColor'>
					<path d='M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z' />
				</svg>
			</DatePicker.Trigger>
			<DatePicker.Content class={contentCls}>
				<PickerContent />
			</DatePicker.Content>
		</DatePicker.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const [date, setDate] = createSignal<Date | null>(new Date());
		return (
			<div class='flex flex-col gap-2'>
				<label class='text-sm font-medium text-black'>Date of birth</label>
				<DatePicker.Root
					value={date()}
					onChange={setDate}
					class='relative inline-block'>
					<DatePicker.Trigger class={triggerCls + ' w-64 justify-between'}>
						<DatePicker.Value placeholder={<span class='text-[#a3a3a3]'>Select a date</span>} />
						<svg
							class='size-4 text-[#6b7280]'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path d='M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z' />
						</svg>
					</DatePicker.Trigger>
					<DatePicker.Content class={contentCls}>
						<PickerContent />
					</DatePicker.Content>
				</DatePicker.Root>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [from, setFrom] = createSignal<Date | null>(null);
		const [to, setTo] = createSignal<Date | null>(null);

		return (
			<div class='flex w-full max-w-md flex-col gap-3'>
				<label class='text-sm font-medium text-black'>Trip dates</label>
				<div class='flex items-center gap-2'>
					<DatePicker.Root
						value={from()}
						onChange={setFrom}
						class='relative inline-block flex-1'>
						<DatePicker.Trigger class={triggerCls + ' w-full justify-between'}>
							<DatePicker.Value placeholder={<span class='text-[#a3a3a3]'>Departure</span>} />
						</DatePicker.Trigger>
						<DatePicker.Content class={contentCls}>
							<PickerContent />
						</DatePicker.Content>
					</DatePicker.Root>
					<span class='text-[#6b7280]'>→</span>
					<DatePicker.Root
						value={to()}
						onChange={setTo}
						class='relative inline-block flex-1'>
						<DatePicker.Trigger class={triggerCls + ' w-full justify-between'}>
							<DatePicker.Value placeholder={<span class='text-[#a3a3a3]'>Return</span>} />
						</DatePicker.Trigger>
						<DatePicker.Content class={contentCls}>
							<PickerContent />
						</DatePicker.Content>
					</DatePicker.Root>
				</div>
				<Show when={from() && to()}>
					<p class='text-xs text-[#6b7280]'>
						{from()!.toLocaleDateString()} → {to()!.toLocaleDateString()}
					</p>
				</Show>
			</div>
		);
	},
};
