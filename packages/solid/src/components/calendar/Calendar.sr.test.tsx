/**
 * Screen-reader semantics for Calendar. Verifies the ARIA grid pattern a screen
 * reader navigates — role=grid, row/columnheader relationships, and the
 * selected/today state day cells announce — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { type ComponentProps } from 'solid-js';
import { Calendar } from './Calendar';
import { expectExposedAs } from '@/test/sr';

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

describe('Calendar — screen reader semantics', () => {
	it('exposes the days as a grid named by the visible month', () => {
		renderCalendar();
		expectExposedAs('grid', 'January 2024');
	});

	it('exposes the days as a grid laid out in rows', () => {
		renderCalendar();
		const grid = screen.getByRole('grid');
		// One weekday header row + six week rows.
		expect(within(grid).getAllByRole('row')).toHaveLength(7);
	});

	it('names each weekday columnheader in full so SR reads "Sunday", not "Sun"', () => {
		renderCalendar();
		// Visible label is the short form; the accessible name is the full weekday.
		expectExposedAs('columnheader', 'Sunday');
		expectExposedAs('columnheader', 'Saturday');
		expect(screen.getAllByRole('columnheader')).toHaveLength(7);
	});

	it('exposes the navigation buttons by accessible name', () => {
		renderCalendar();
		expectExposedAs('button', 'Previous month');
		expectExposedAs('button', 'Next month');
	});

	it('announces the visible month via a polite live region', () => {
		renderCalendar();
		const title = screen.getByText('January 2024');
		expect(title).toHaveAttribute('aria-live', 'polite');
	});

	it('marks the selected day with aria-selected and leaves others unselected', () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const selected = screen.getByRole('gridcell', { name: '15', selected: true });
		expect(selected).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('gridcell', { name: '16' })).toHaveAttribute('aria-selected', 'false');
	});

	it("exposes today as aria-current='date'", () => {
		const today = new Date();
		render(() => (
			<Calendar.Root defaultMonth={today}>
				<Calendar.Grid />
			</Calendar.Root>
		));
		const current = document.querySelector('[aria-current="date"]');
		expect(current).not.toBeNull();
		expect(current).toHaveTextContent(String(today.getDate()));
	});

	it('moves the selected-state announcement to the day the user picks', async () => {
		renderCalendar({ defaultValue: new Date(2024, 0, 15) });
		await userEvent.click(screen.getByRole('gridcell', { name: '20' }));
		expect(screen.getByRole('gridcell', { name: '20' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute('aria-selected', 'false');
	});

	it('updates the month live-region announcement when navigating', async () => {
		renderCalendar();
		await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
		expect(screen.getByText('February 2024')).toHaveAttribute('aria-live', 'polite');
	});
});
