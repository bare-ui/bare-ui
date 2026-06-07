/**
 * Screen-reader semantics for DatePicker. Verifies the trigger's accessible name
 * and expanded state, the popup's dialog wiring, and that the selected date is
 * reflected in the grid a screen reader navigates — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { DatePicker } from './DatePicker';
import { Calendar } from '../calendar/Calendar';
import { expectExposedAs, accessibleNameVia } from '@/test/sr';

function renderDP(props: Partial<ComponentProps<typeof DatePicker.Root>> = {}) {
	return render(() => (
		<DatePicker.Root {...props}>
			<DatePicker.Trigger>
				<DatePicker.Value placeholder='Pick a date' />
			</DatePicker.Trigger>
			<DatePicker.Content>
				<DatePicker.Calendar defaultMonth={new Date(2024, 0, 15)}>
					<Calendar.Nav>
						<Calendar.PrevButton />
						<Calendar.Title />
						<Calendar.NextButton />
					</Calendar.Nav>
					<Calendar.Grid />
				</DatePicker.Calendar>
			</DatePicker.Content>
		</DatePicker.Root>
	));
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
