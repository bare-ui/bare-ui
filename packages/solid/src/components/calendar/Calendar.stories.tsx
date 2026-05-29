import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Calendar } from './Calendar';

const meta = {
	title: 'Forms/Calendar',
	component: Calendar.Root,
	subcomponents: {
		'Calendar.Nav': Calendar.Nav,
		'Calendar.PrevButton': Calendar.PrevButton,
		'Calendar.NextButton': Calendar.NextButton,
		'Calendar.Title': Calendar.Title,
		'Calendar.Grid': Calendar.Grid,
	},
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

export const Default: Story = {
	render: () => (
		<Calendar.Root class={wrapperCls}>
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
		</Calendar.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const [selected, setSelected] = createSignal<Date | null>(new Date());
		return (
			<div class='flex flex-col gap-2'>
				<Calendar.Root
					value={selected()}
					onChange={setSelected}
					class={wrapperCls}>
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
						renderWeekday={(wd) => (
							<div class='text-center text-xs font-medium text-[#6b7280] py-1'>{wd.short}</div>
						)}
					/>
				</Calendar.Root>
				<p class='text-xs text-[#6b7280]'>
					Selected:{' '}
					<span class='font-medium text-black'>{selected() ? selected()!.toLocaleDateString() : '∅'}</span>
				</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [selected, setSelected] = createSignal<Date | null>(null);
		const today = new Date();
		const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
		const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
		return (
			<div class='flex flex-col gap-2'>
				<Calendar.Root
					value={selected()}
					onChange={setSelected}
					minDate={minDate}
					maxDate={maxDate}
					isDateDisabled={isWeekend}
					weekStartsOn={1}
					class={wrapperCls}>
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
						renderWeekday={(wd) => (
							<div class='text-center text-xs font-medium text-[#6b7280] py-1'>{wd.short}</div>
						)}
					/>
				</Calendar.Root>
				<p class='text-xs text-[#6b7280]'>Mon-first, weekends + past disabled, max 2 months ahead.</p>
			</div>
		);
	},
};
