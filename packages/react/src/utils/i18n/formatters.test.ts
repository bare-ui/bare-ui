import { describe, it, expect } from 'vitest';
import {
	formatDate,
	formatNumber,
	formatRelativeTime,
	getDayNames,
	getMonthNames,
	parseLocaleNumber,
} from './formatters';

describe('i18n formatters', () => {
	it('formats numbers per locale', () => {
		expect(formatNumber(1234.5, 'en-US')).toBe('1,234.5');
		// de-DE swaps grouping/decimal separators.
		expect(formatNumber(1234.5, 'de-DE')).toBe('1.234,5');
	});

	it('round-trips locale-formatted numbers back to a value', () => {
		expect(parseLocaleNumber('1,234.5', 'en-US')).toBe(1234.5);
		expect(parseLocaleNumber('1.234,5', 'de-DE')).toBe(1234.5);
		expect(parseLocaleNumber('-42', 'en-US')).toBe(-42);
	});

	it('returns NaN for non-numeric input', () => {
		expect(Number.isNaN(parseLocaleNumber('abc', 'en-US'))).toBe(true);
		expect(Number.isNaN(parseLocaleNumber('', 'en-US'))).toBe(true);
		expect(Number.isNaN(parseLocaleNumber('-', 'en-US'))).toBe(true);
	});

	it('formats relative time via Intl', () => {
		expect(formatRelativeTime(-5, 'minute', 'en-US')).toBe('5 minutes ago');
		expect(formatRelativeTime(-1, 'minute', 'en-US')).toBe('1 minute ago');
		expect(formatRelativeTime(-2, 'hour', 'en-US')).toBe('2 hours ago');
	});

	it('derives day names indexed by getDay()', () => {
		const en = getDayNames('en-US');
		expect(en[0]).toBe('Sunday');
		expect(en[6]).toBe('Saturday');
		expect(getDayNames('de-DE')[1]).toBe('Montag');
	});

	it('derives month names indexed by getMonth()', () => {
		const en = getMonthNames('en-US');
		expect(en[0]).toBe('January');
		expect(en[11]).toBe('December');
		expect(getMonthNames('de-DE')[0]).toBe('Januar');
	});

	it('formats dates per locale', () => {
		const date = new Date(2025, 0, 15);
		expect(formatDate(date, 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })).toBe('January 15, 2025');
		expect(formatDate(date, 'de-DE', { year: 'numeric', month: 'long', day: 'numeric' })).toBe('15. Januar 2025');
	});
});
