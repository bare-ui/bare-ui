import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';

function renderCalendar(props: Partial<React.ComponentProps<typeof Calendar.Root>> = {}) {
	return render(
		<Calendar.Root defaultMonth={new Date(2024, 0, 15)} {...props}>
			<Calendar.Nav>
				<Calendar.PrevButton />
				<Calendar.Title />
				<Calendar.NextButton />
			</Calendar.Nav>
			<Calendar.Grid />
		</Calendar.Root>,
	);
}

describe('Calendar', () => {
	it('renders 42 day cells (6 weeks)', () => {
		renderCalendar();
		const cells = screen.getAllByRole('gridcell');
		expect(cells).toHaveLength(42);
	});

	it('shows the month/year title', () => {
		renderCalendar();
		expect(screen.getByText('January 2024')).toBeInTheDocument();
	});

	it('Next/Prev buttons advance the month', async () => {
		renderCalendar();
		await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
		expect(screen.getByText('February 2024')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
		await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
		expect(screen.getByText('December 2023')).toBeInTheDocument();
	});

	it('clicking a day fires onChange', async () => {
		const onChange = vi.fn();
		renderCalendar({ onChange });
		// Find a day inside the visible month (e.g., 15)
		const day = screen.getByRole('gridcell', { name: '15' });
		await userEvent.click(day);
		expect(onChange).toHaveBeenCalled();
		const [date] = onChange.mock.calls[0] as [Date];
		expect(date.getDate()).toBe(15);
		expect(date.getMonth()).toBe(0);
		expect(date.getFullYear()).toBe(2024);
	});

	it('disables days outside [minDate, maxDate]', () => {
		renderCalendar({
			minDate: new Date(2024, 0, 10),
			maxDate: new Date(2024, 0, 20),
		});
		// Pick days that appear only once in the 6-week grid (Jan 12-31 — Feb only spills to 11).
		expect(screen.getByRole('gridcell', { name: '15' })).not.toBeDisabled();
		expect(screen.getByRole('gridcell', { name: '12' })).not.toBeDisabled();
		expect(screen.getByRole('gridcell', { name: '25' })).toBeDisabled();
		expect(screen.getByRole('gridcell', { name: '28' })).toBeDisabled();
	});
});
