import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '.';
import { Calendar } from '../calendar';

const {
	Root: DatePickerRoot,
	Trigger: DatePickerTrigger,
	Value: DatePickerValue,
	Content: DatePickerContent,
	Calendar: DatePickerCalendar,
} = DatePicker;

const {
	Nav: CalendarNav,
	PrevButton: CalendarPrevButton,
	Title: CalendarTitle,
	NextButton: CalendarNextButton,
	Grid: CalendarGrid,
} = Calendar;

function renderDP(props: Record<string, unknown> = {}) {
	return render({
		template: `
			<DatePickerRoot v-bind="rootProps">
				<DatePickerTrigger>
					<DatePickerValue placeholder="Pick a date" />
				</DatePickerTrigger>
				<DatePickerContent>
					<DatePickerCalendar :defaultMonth="new Date(2024, 0, 15)">
						<CalendarNav>
							<CalendarPrevButton />
							<CalendarTitle />
							<CalendarNextButton />
						</CalendarNav>
						<CalendarGrid />
					</DatePickerCalendar>
				</DatePickerContent>
			</DatePickerRoot>
		`,
		components: {
			DatePickerRoot,
			DatePickerTrigger,
			DatePickerValue,
			DatePickerContent,
			DatePickerCalendar,
			CalendarNav,
			CalendarPrevButton,
			CalendarTitle,
			CalendarNextButton,
			CalendarGrid,
		},
		setup() {
			return { rootProps: props };
		},
	});
}

describe('DatePicker', () => {
	it('starts closed and shows placeholder', () => {
		renderDP();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(screen.getByText('Pick a date')).toBeInTheDocument();
	});

	it('opens the calendar on trigger click', async () => {
		renderDP();
		await userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('selecting a day fires onChange and closes (closeOnSelect default)', async () => {
		const onChange = vi.fn();
		renderDP({ onChange });
		await userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
		await userEvent.click(screen.getByRole('gridcell', { name: '20' }));
		expect(onChange).toHaveBeenCalled();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		renderDP();
		await userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('moves focus into the calendar grid when opened', async () => {
		renderDP();
		await userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
		await nextTick();
		expect(document.activeElement).toHaveAttribute('role', 'gridcell');
		expect(document.activeElement).toHaveAttribute('tabindex', '0');
	});

	it('returns focus to the trigger when closed via Escape', async () => {
		renderDP();
		const trigger = screen.getByRole('button', { name: 'Pick a date' });
		await userEvent.click(trigger);
		await nextTick();
		await userEvent.keyboard('{Escape}');
		await nextTick();
		expect(trigger).toHaveFocus();
	});
});
