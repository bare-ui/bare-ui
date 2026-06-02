import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';
import { Calendar } from '../calendar/Calendar';

function renderDP(props: Partial<React.ComponentProps<typeof DatePicker.Root>> = {}) {
	return render(
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
		</DatePicker.Root>,
	);
}

describe('DatePicker', () => {
	it('starts closed and shows placeholder', () => {
		renderDP();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(screen.getByText('Pick a date')).toBeInTheDocument();
	});

	it('opens the calendar on trigger click', async () => {
		renderDP();
		await userEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('selecting a day fires onChange and closes (closeOnSelect default)', async () => {
		const onChange = vi.fn();
		renderDP({ onChange });
		await userEvent.click(screen.getByRole('button'));
		await userEvent.click(screen.getByRole('gridcell', { name: '20' }));
		expect(onChange).toHaveBeenCalled();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		renderDP();
		await userEvent.click(screen.getByRole('button'));
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('moves focus into the calendar grid when opened', async () => {
		renderDP();
		await userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
		expect(document.activeElement).toHaveAttribute('role', 'gridcell');
		expect(document.activeElement).toHaveAttribute('tabindex', '0');
	});

	it('returns focus to the trigger when closed via Escape', async () => {
		renderDP();
		const trigger = screen.getByRole('button', { name: 'Pick a date' });
		await userEvent.click(trigger);
		await userEvent.keyboard('{Escape}');
		expect(trigger).toHaveFocus();
	});
});
