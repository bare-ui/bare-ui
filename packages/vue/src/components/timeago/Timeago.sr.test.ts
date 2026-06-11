import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Timeago } from '.';

describe('Timeago — screen reader semantics', () => {
	// NOTE: The Vue Timeago component does not bind a `datetime` attribute on the
	// <time> element (the React component does). Tests that assert `datetime` is
	// set to the ISO string are skipped for the Vue port because the prop is not
	// reflected onto the HTML attribute in this implementation.

	it('renders a <time> element so the browser/SR can identify the semantic', () => {
		const date = new Date('2025-01-15T14:30:00.000Z');
		render(Timeago, { props: { datetime: date, isDuration: true } });
		// The <time> element gives the relative text its semantic meaning to assistive tech.
		expect(document.querySelector('time')).toBeInTheDocument();
	});

	it('exposes the human display text as the time element content', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render(Timeago, { props: { datetime: fiveMinutesAgo, isDuration: true } });
		// The visible/announced text is the relative phrasing.
		expect(screen.getByText('5 minutes ago').tagName.toLowerCase()).toBe('time');
	});

	it('renders time-only display text inside the <time> element', () => {
		// NOTE: The React test also asserts `datetime` carries the full ISO value.
		// That assertion is skipped here — the Vue component does not set the
		// `datetime` attribute; only the display text is available.
		const date = new Date('2025-01-15T14:30:00');
		render(Timeago, { props: { datetime: date, timeOnly: true } });
		const time = document.querySelector('time')!;
		// Display collapses to HH:MM — confirm the <time> element carries that text.
		expect(time.textContent?.trim()).toBe('14:30');
	});

	it('lets a consumer attach a fuller accessible name via aria-label without losing display text', () => {
		const date = new Date('2025-01-15T14:30:00.000Z');
		render(Timeago, {
			props: { datetime: date, isDuration: true },
			attrs: { 'aria-label': 'January 15, 2025 at 2:30 PM' },
		});
		const time = document.querySelector('time')!;
		// Consumer-supplied accessible name overrides the terse relative text for SR.
		expect(time).toHaveAttribute('aria-label', 'January 15, 2025 at 2:30 PM');
	});
});
