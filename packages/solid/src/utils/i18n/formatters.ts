/**
 * Locale-aware formatting helpers.
 *
 * Everything delegates to the platform `Intl` APIs — no locale data is bundled.
 * `Intl.*Format` constructors are comparatively expensive, so instances are
 * memoized by `(locale, options)`. The cache is unbounded but keyed by the small
 * set of locale/option combinations an app actually uses, so it settles quickly.
 */

function cacheKey(locale: string, options: unknown): string {
	// Option objects are small and JSON-serializable (enums / booleans / numbers),
	// so a stable stringify is a cheap, collision-free key.
	return options ? `${locale} ${JSON.stringify(options)}` : locale;
}

const dateTimeCache = new Map<string, Intl.DateTimeFormat>();
const numberCache = new Map<string, Intl.NumberFormat>();
const relativeTimeCache = new Map<string, Intl.RelativeTimeFormat>();

/** Memoized {@link Intl.DateTimeFormat} for `(locale, options)`. */
export function getDateTimeFormat(locale: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
	const key = cacheKey(locale, options);
	let fmt = dateTimeCache.get(key);
	if (!fmt) {
		fmt = new Intl.DateTimeFormat(locale, options);
		dateTimeCache.set(key, fmt);
	}
	return fmt;
}

/** Memoized {@link Intl.NumberFormat} for `(locale, options)`. */
export function getNumberFormat(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
	const key = cacheKey(locale, options);
	let fmt = numberCache.get(key);
	if (!fmt) {
		fmt = new Intl.NumberFormat(locale, options);
		numberCache.set(key, fmt);
	}
	return fmt;
}

/** Memoized {@link Intl.RelativeTimeFormat} for `(locale, options)`. */
export function getRelativeTimeFormat(
	locale: string,
	options?: Intl.RelativeTimeFormatOptions,
): Intl.RelativeTimeFormat {
	const key = cacheKey(locale, options);
	let fmt = relativeTimeCache.get(key);
	if (!fmt) {
		fmt = new Intl.RelativeTimeFormat(locale, options);
		relativeTimeCache.set(key, fmt);
	}
	return fmt;
}

/** Format a date/time for `locale`. */
export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
	return getDateTimeFormat(locale, options).format(date);
}

/** Format a number for `locale`. */
export function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string {
	return getNumberFormat(locale, options).format(value);
}

/** Format a relative time (e.g. `-5, 'minute'` → "5 minutes ago") for `locale`. */
export function formatRelativeTime(
	value: number,
	unit: Intl.RelativeTimeFormatUnit,
	locale: string,
	options: Intl.RelativeTimeFormatOptions = { numeric: 'always' },
): string {
	return getRelativeTimeFormat(locale, options).format(value, unit);
}

/**
 * The localized day names (Sunday→Saturday) for `locale`. Index matches
 * `Date.prototype.getDay()`.
 */
export function getDayNames(locale: string, format: 'long' | 'short' | 'narrow' = 'long'): string[] {
	const fmt = getDateTimeFormat(locale, { weekday: format });
	// 2021-08-01 is a Sunday; walking seven consecutive days yields Sun→Sat,
	// matching the index returned by Date.prototype.getDay().
	return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2021, 7, 1 + i)));
}

/**
 * The localized month names (January→December) for `locale`. Index matches
 * `Date.prototype.getMonth()`.
 */
export function getMonthNames(locale: string, format: 'long' | 'short' | 'narrow' = 'long'): string[] {
	const fmt = getDateTimeFormat(locale, { month: format });
	return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2021, i, 1)));
}

interface NumberSeparators {
	group: string;
	decimal: string;
}

const separatorsCache = new Map<string, NumberSeparators>();

/** The grouping and decimal separators `locale` uses, derived from `Intl`. */
function getNumberSeparators(locale: string): NumberSeparators {
	let sep = separatorsCache.get(locale);
	if (!sep) {
		const parts = getNumberFormat(locale).formatToParts(12345.6);
		sep = {
			group: parts.find((p) => p.type === 'group')?.value ?? ',',
			decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
		};
		separatorsCache.set(locale, sep);
	}
	return sep;
}

/**
 * Parse a number a user typed in `locale`'s conventions back into a `number`,
 * stripping group separators and normalizing the decimal mark. Returns `NaN`
 * for input that isn't a valid number (callers decide how to handle it).
 */
export function parseLocaleNumber(input: string, locale: string): number {
	const { group, decimal } = getNumberSeparators(locale);
	let normalized = input.trim();
	if (group) normalized = normalized.split(group).join('');
	if (decimal && decimal !== '.') normalized = normalized.split(decimal).join('.');
	// Drop any remaining locale spacing (e.g. narrow no-break group spaces).
	normalized = normalized.replace(/\s/g, '');
	if (normalized === '' || normalized === '-' || normalized === '.') return NaN;
	return Number(normalized);
}
