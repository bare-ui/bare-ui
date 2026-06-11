/**
 * Screen-reader semantics for DatePicker. Verifies the trigger's accessible name
 * and expanded state, the popup's dialog wiring, and that the selected date is
 * reflected in the grid a screen reader navigates — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs, accessibleNameVia } from '@/test/sr';
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

describe('DatePicker — screen reader semantics', () => {
	it('names the trigger from its value/placeholder content', () => {
		renderDP();
		// With no date chosen, SR reads the placeholder as the control's name.
		expectExposedAs('button', 'Pick a date');
	});

	it('announces that the trigger opens a dialog and is collapsed initially', () => {
		renderDP();
		const trigger = screen.getByRole('button', { name: 'Pick a date' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('flips aria-expanded to true once the popup is open', async () => {
		renderDP();
		const trigger = screen.getByRole('button', { name: 'Pick a date' });
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes the trigger→popup relationship via aria-controls', async () => {
		renderDP();
		const trigger = screen.getByRole('button', { name: 'Pick a date' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
	});

	it('names the dialog after its trigger (aria-labelledby)', async () => {
		renderDP();
		await userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
		// SR announces the popup using the trigger's text.
		expect(accessibleNameVia(screen.getByRole('dialog'))).toBe('Pick a date');
	});

	it('reflects the selected date as the trigger name and the grid selection', async () => {
		renderDP({ defaultValue: new Date(2024, 0, 20) });
		// Selected date becomes the trigger's accessible name.
		const trigger = screen.getByRole('button', { name: 'Jan 20, 2024' });
		expect(trigger).toBeInTheDocument();
		await userEvent.click(trigger);
		expect(screen.getByRole('gridcell', { name: '20' })).toHaveAttribute('aria-selected', 'true');
	});
});
