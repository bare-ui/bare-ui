import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
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
		// Find a day inside the visible month (e.g., 15).
		const day = screen.getByRole('gridcell', { name: '15' });
		await userEvent.click(day);
		expect(onChange).toHaveBeenCalled();
		const [date] = onChange.mock.calls[0] as [Date];
		expect(date.getDate()).toBe(15);
		expect(date.getMonth()).toBe(0);
		expect(date.getFullYear()).toBe(2024);
	});

	it('clicking a day marks it as selected (data-selected attribute)', async () => {
		renderCalendar();
		const day15 = screen.getByRole('gridcell', { name: '15' });
		expect(day15).not.toHaveAttribute('data-selected');
		await userEvent.click(day15);
		await nextTick();
		expect(day15).toHaveAttribute('data-selected', '');
		expect(day15).toHaveAttribute('aria-selected', 'true');
	});

	it('selecting a new day clears the previous selection', async () => {
		renderCalendar();
		const day15 = screen.getByRole('gridcell', { name: '15' });
		const day20 = screen.getByRole('gridcell', { name: '20' });

		await userEvent.click(day15);
		await nextTick();
		expect(day15).toHaveAttribute('data-selected', '');
		expect(day20).not.toHaveAttribute('data-selected');

		await userEvent.click(day20);
		await nextTick();
		expect(day20).toHaveAttribute('data-selected', '');
		expect(day15).not.toHaveAttribute('data-selected');
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

	describe('keyboard navigation', () => {
		function activeDate() {
			return (document.activeElement as HTMLElement | null)?.getAttribute('data-date');
		}

		it('makes exactly one day cell tabbable (roving tabindex), defaulting to the selected day', () => {
			renderCalendar({ value: new Date(2024, 0, 15) });
			const tabbable = screen.getAllByRole('gridcell').filter((c) => c.getAttribute('tabindex') === '0');
			expect(tabbable).toHaveLength(1);
			expect(tabbable[0]).toHaveTextContent('15');
		});

		it('keeps a day cell tabbable even when nothing is selected', () => {
			renderCalendar();
			const tabbable = screen.getAllByRole('gridcell').filter((c) => c.getAttribute('tabindex') === '0');
			expect(tabbable).toHaveLength(1);
		});

		it('ArrowRight/ArrowLeft move focus by one day', async () => {
			renderCalendar({ value: new Date(2024, 0, 15) });
			screen.getByRole('gridcell', { name: '15' }).focus();
			await userEvent.keyboard('{ArrowRight}');
			await nextTick();
			await nextTick();
			expect(screen.getByRole('gridcell', { name: '16' })).toHaveFocus();
			await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
			await nextTick();
			await nextTick();
			expect(screen.getByRole('gridcell', { name: '14' })).toHaveFocus();
		});

		it('ArrowDown/ArrowUp move focus by one week', async () => {
			renderCalendar({ value: new Date(2024, 0, 15) });
			screen.getByRole('gridcell', { name: '15' }).focus();
			await userEvent.keyboard('{ArrowDown}');
			await nextTick();
			await nextTick();
			expect(screen.getByRole('gridcell', { name: '22' })).toHaveFocus();
			await userEvent.keyboard('{ArrowUp}');
			await nextTick();
			await nextTick();
			expect(screen.getByRole('gridcell', { name: '15' })).toHaveFocus();
		});

		it('Home/End move to the start and end of the week', async () => {
			// weekStartsOn defaults to Sunday. Jan 15 2024 is a Monday → week is Jan 14–20.
			renderCalendar({ value: new Date(2024, 0, 15) });
			screen.getByRole('gridcell', { name: '15' }).focus();
			await userEvent.keyboard('{Home}');
			await nextTick();
			await nextTick();
			expect(screen.getByRole('gridcell', { name: '14' })).toHaveFocus();
			await userEvent.keyboard('{End}');
			await nextTick();
			await nextTick();
			expect(screen.getByRole('gridcell', { name: '20' })).toHaveFocus();
		});

		it('PageDown/PageUp change the month and keep focus on the same day', async () => {
			renderCalendar({ value: new Date(2024, 0, 15) });
			screen.getByRole('gridcell', { name: '15' }).focus();
			await userEvent.keyboard('{PageDown}');
			await nextTick();
			await nextTick();
			expect(screen.getByText('February 2024')).toBeInTheDocument();
			expect(activeDate()).toBe('2024-02-15');
			await userEvent.keyboard('{PageUp}');
			await nextTick();
			await nextTick();
			expect(screen.getByText('January 2024')).toBeInTheDocument();
			expect(activeDate()).toBe('2024-01-15');
		});

		it('Shift+PageDown/Up change the year', async () => {
			renderCalendar({ value: new Date(2024, 0, 15) });
			screen.getByRole('gridcell', { name: '15' }).focus();
			await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
			await nextTick();
			await nextTick();
			expect(screen.getByText('January 2025')).toBeInTheDocument();
			expect(activeDate()).toBe('2025-01-15');
		});

		it('crossing a month boundary with an arrow key advances the month', async () => {
			renderCalendar({ value: new Date(2024, 0, 31) });
			(document.querySelector('[data-date="2024-01-31"]') as HTMLElement).focus();
			await userEvent.keyboard('{ArrowRight}');
			await nextTick();
			await nextTick();
			expect(screen.getByText('February 2024')).toBeInTheDocument();
			expect(activeDate()).toBe('2024-02-01');
		});

		it('does not move focus onto a disabled day', async () => {
			renderCalendar({
				value: new Date(2024, 0, 15),
				maxDate: new Date(2024, 0, 15),
			});
			screen.getByRole('gridcell', { name: '15' }).focus();
			await userEvent.keyboard('{ArrowRight}');
			await nextTick();
			await nextTick();
			// 16 is past maxDate (disabled) → focus stays on 15.
			expect(screen.getByRole('gridcell', { name: '15' })).toHaveFocus();
		});
	});
});
