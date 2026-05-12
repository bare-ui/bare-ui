import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal, type ComponentProps } from 'solid-js';
import { Calendar } from './Calendar';

function renderCalendar(props: Partial<ComponentProps<typeof Calendar.Root>> = {}) {
	return render(() => (
		<Calendar.Root
			defaultMonth={new Date(2024, 0, 15)}
			{...props}>
			<Calendar.Nav>
				<Calendar.PrevButton />
				<Calendar.Title />
				<Calendar.NextButton />
			</Calendar.Nav>
			<Calendar.Grid />
		</Calendar.Root>
	));
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
		expect(screen.getByRole('gridcell', { name: '15' })).not.toBeDisabled();
		expect(screen.getByRole('gridcell', { name: '12' })).not.toBeDisabled();
		expect(screen.getByRole('gridcell', { name: '25' })).toBeDisabled();
		expect(screen.getByRole('gridcell', { name: '28' })).toBeDisabled();
	});

	it('clicking a day marks it as selected (data-selected attribute)', async () => {
		renderCalendar();
		const day15 = screen.getByRole('gridcell', { name: '15' });
		expect(day15).not.toHaveAttribute('data-selected');
		await userEvent.click(day15);
		expect(day15).toHaveAttribute('data-selected', '');
		expect(day15).toHaveAttribute('aria-selected', 'true');
	});

	it('selecting a new day clears the previous selection', async () => {
		renderCalendar();
		const day15 = screen.getByRole('gridcell', { name: '15' });
		const day20 = screen.getByRole('gridcell', { name: '20' });

		await userEvent.click(day15);
		expect(day15).toHaveAttribute('data-selected', '');
		expect(day20).not.toHaveAttribute('data-selected');

		await userEvent.click(day20);
		expect(day20).toHaveAttribute('data-selected', '');
		expect(day15).not.toHaveAttribute('data-selected');
	});

	it('controlled value updates selection reactively', async () => {
		// Use days 15/20 — Jan's 6-week grid spills into Feb 1–10, so days 1–10
		// have duplicate matches. Days 11–30 of Jan are unique in the rendered grid.
		const [date, setDate] = createSignal<Date | null>(new Date(2024, 0, 15));

		// Scope queries to this render's container — `screen` is document-wide.
		const result = render(() => (
			<Calendar.Root
				defaultMonth={new Date(2024, 0, 15)}
				value={date()}
				onChange={setDate}>
				<Calendar.Grid />
			</Calendar.Root>
		));

		const day15 = result.getByRole('gridcell', { name: '15' });
		const day20 = result.getByRole('gridcell', { name: '20' });

		// Initial: 15 is selected
		expect(day15).toHaveAttribute('data-selected', '');
		expect(day20).not.toHaveAttribute('data-selected');

		// Click 20: 15 should clear, 20 should be selected
		await userEvent.click(day20);
		expect(day20).toHaveAttribute('data-selected', '');
		expect(day15).not.toHaveAttribute('data-selected');
	});
});
