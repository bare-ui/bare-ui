import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeago } from './Timeago';

describe('Timeago — screen reader semantics', () => {
	it('renders a <time> element carrying a machine-readable datetime', () => {
		const date = new Date('2025-01-15T14:30:00.000Z');
		render(
			<Timeago
				datetime={date}
				isDuration
			/>,
		);
		const time = document.querySelector('time')!;
		// The relative/short text is for sighted users; the dateTime attribute gives
		// the SR (and crawlers) the unambiguous full ISO timestamp.
		expect(time).toHaveAttribute('datetime', date.toISOString());
	});

	it('exposes the human display text as the time element content', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render(
			<Timeago
				datetime={fiveMinutesAgo}
				isDuration
			/>,
		);
		// The visible/announced text is the relative phrasing.
		expect(screen.getByText('5 minutes ago').tagName.toLowerCase()).toBe('time');
	});

	it('keeps the machine value full even when the display is time-only', () => {
		const date = new Date('2025-01-15T14:30:00.000Z');
		render(
			<Timeago
				datetime={date}
				timeOnly
			/>,
		);
		const time = document.querySelector('time')!;
		// Display collapses to HH:MM, but the dateTime still carries the full date.
		expect(time).toHaveAttribute('datetime', date.toISOString());
	});

	it('lets a consumer attach a fuller accessible name without losing the machine value', () => {
		const date = new Date('2025-01-15T14:30:00.000Z');
		render(
			<Timeago
				datetime={date}
				isDuration
				aria-label='January 15, 2025 at 2:30 PM'
			/>,
		);
		const time = document.querySelector('time')!;
		// Consumer-supplied accessible name overrides the terse relative text for SR.
		expect(time).toHaveAttribute('aria-label', 'January 15, 2025 at 2:30 PM');
		expect(time).toHaveAttribute('datetime', date.toISOString());
	});
});
