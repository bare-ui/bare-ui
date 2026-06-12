/**
 * Screen-reader semantics for Calendar. Verifies the ARIA grid pattern a screen
 * reader navigates — role=grid, columnheader relationships, and the
 * selected/today state day cells announce — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Calendar } from '.';

const {
	Root: CalendarRoot,
	Nav: CalendarNav,
	PrevButton: CalendarPrevButton,
	NextButton: CalendarNextButton,
	Title: CalendarTitle,
	Grid: CalendarGrid,
} = Calendar;

function renderCalendar(props: Record<string, unknown> = {}) {
	return render({
		template: `
			<CalendarRoot :defaultMonth="defaultMonth" v-bind="rootProps">
				<CalendarNav>
					<CalendarPrevButton />
					<CalendarTitle />
					<CalendarNextButton />
				</CalendarNav>
				<CalendarGrid />
			</CalendarRoot>
		`,
		components: {
			CalendarRoot,
			CalendarNav,
			CalendarPrevButton,
			CalendarNextButton,
			CalendarTitle,
			CalendarGrid,
		},
		setup() {
			return {
				defaultMonth: new Date(2024, 0, 15),
				rootProps: props,
			};
		},
	});
}

describe('Calendar — screen reader semantics', () => {
	it('exposes a grid element for the calendar days', () => {
		renderCalendar();
		expect(screen.getByRole('grid')).toBeTruthy();
	});

	it('exposes the weekday column headers', () => {
		renderCalendar();
		const grid = screen.getByRole('grid');
		expect(within(grid).getAllByRole('columnheader')).toHaveLength(7);
	});

	it('names each weekday columnheader in full so SR reads "Sunday", not "Sun"', () => {
		renderCalendar();
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
		expect(title.closest('[aria-live="polite"]') ?? title).toHaveAttribute('aria-live', 'polite');
	});

	it('marks the selected day with aria-selected and leaves others unselected', () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const selected = screen.getByRole('gridcell', { name: '15', selected: true });
		expect(selected).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('gridcell', { name: '16' })).toHaveAttribute('aria-selected', 'false');
	});

	it("exposes today as aria-current='date'", () => {
		const today = new Date();
		render({
			template: `
				<CalendarRoot :defaultMonth="today">
					<CalendarGrid />
				</CalendarRoot>
			`,
			components: { CalendarRoot, CalendarGrid },
			setup() {
				return { today };
			},
		});
		const current = document.querySelector('[aria-current="date"]');
		expect(current).not.toBeNull();
		expect(current).toHaveTextContent(String(today.getDate()));
	});

	it('moves the selected-state announcement to the day the user picks', async () => {
		renderCalendar({ defaultValue: new Date(2024, 0, 15) });
		await userEvent.click(screen.getByRole('gridcell', { name: '20' }));
		await nextTick();
		expect(screen.getByRole('gridcell', { name: '20' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute('aria-selected', 'false');
	});

	it('updates the month live-region announcement when navigating', async () => {
		renderCalendar();
		await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
		await nextTick();
		const feb = screen.getByText('February 2024');
		expect(feb.closest('[aria-live="polite"]') ?? feb).toHaveAttribute('aria-live', 'polite');
	});

	it('wraps day cells in role="row" containers for ARIA grid compliance', () => {
		renderCalendar();
		const grid = screen.getByRole('grid');
		// At least the weekday header row and one week row must be present.
		const rows = within(grid).getAllByRole('row');
		expect(rows.length).toBeGreaterThanOrEqual(2);
	});
});

describe('Calendar — keyboard navigation', () => {
	it('ArrowRight moves focus one day forward', async () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{ArrowRight}');
		await nextTick();
		await nextTick();
		expect(screen.getByRole('gridcell', { name: '16' })).toHaveFocus();
	});

	it('ArrowLeft moves focus one day backward', async () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{ArrowLeft}');
		await nextTick();
		await nextTick();
		expect(screen.getByRole('gridcell', { name: '14' })).toHaveFocus();
	});

	it('ArrowDown moves focus one week forward', async () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{ArrowDown}');
		await nextTick();
		await nextTick();
		expect(screen.getByRole('gridcell', { name: '22' })).toHaveFocus();
	});

	it('ArrowUp moves focus one week backward', async () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{ArrowUp}');
		await nextTick();
		await nextTick();
		// Use data-date to avoid ambiguity — Feb 8 is also in the January grid.
		expect(document.activeElement).toHaveAttribute('data-date', '2024-01-08');
	});

	it('PageDown moves focus to the same day in the next month', async () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{PageDown}');
		await nextTick();
		await nextTick();
		// Should now show February 2024 with Feb 15 focused.
		expect(screen.getByText('February 2024')).toBeInTheDocument();
		expect(screen.getByRole('gridcell', { name: '15', selected: false })).toHaveFocus();
	});

	it('PageUp moves focus to the same day in the previous month', async () => {
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{PageUp}');
		await nextTick();
		await nextTick();
		// Should now show December 2023 with Dec 15 focused.
		expect(screen.getByText('December 2023')).toBeInTheDocument();
		expect(screen.getByRole('gridcell', { name: '15', selected: false })).toHaveFocus();
	});

	it('Home moves focus to the start of the week', async () => {
		// Jan 15 2024 is a Monday; Home should go to Sunday Jan 14 (week starts Sunday by default).
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{Home}');
		await nextTick();
		await nextTick();
		expect(screen.getByRole('gridcell', { name: '14' })).toHaveFocus();
	});

	it('End moves focus to the end of the week', async () => {
		// Jan 15 2024 is a Monday; End should go to Saturday Jan 20 (week starts Sunday by default).
		renderCalendar({ value: new Date(2024, 0, 15) });
		const day15 = screen.getByRole('gridcell', { name: '15', selected: true });
		day15.focus();
		await userEvent.keyboard('{End}');
		await nextTick();
		await nextTick();
		expect(screen.getByRole('gridcell', { name: '20' })).toHaveFocus();
	});
});
