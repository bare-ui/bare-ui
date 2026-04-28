import type { JSX } from 'solid-js';

/** Format configuration for timeago display. */
export interface TimeagoFormatConfig {
	/** Text to display for "just now". */
	just: string;
	/** Template for past time (use #time placeholder). */
	past: string;
	/** Template for today's time (use #time placeholder). */
	today: string;
	/** Second format templates. */
	second: { one: string; other: string };
	/** Minute format templates. */
	minute: { one: string; other: string };
	/** Hour format templates. */
	hour: { one: string; other: string };
	/** Array of day names (Sunday to Saturday). */
	days: string[];
	/** Array of month names (January to December). */
	months: string[];
}

/** Plural form type. */
export type TimeagoPlural = 'one' | 'other';

export interface TimeagoProps extends JSX.HTMLAttributes<HTMLTimeElement> {
	/** The date/time to display. */
	datetime: string | Date | number;
	/** Enable live updates. */
	isLive?: boolean;
	/** Display time as duration. */
	isDuration?: boolean;
	/** Display only the time portion (HH:MM format) without date information. */
	timeOnly?: boolean;
	/** Custom format configuration. */
	format?: TimeagoFormatConfig;
	/** Function to determine pluralization form. */
	pluralize?: (n: number) => TimeagoPlural;
}
