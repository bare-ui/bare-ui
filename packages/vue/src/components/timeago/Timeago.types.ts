export interface TimeagoFormatConfig {
	just: string;
	past: string;
	today: string;
	second: { one: string; other: string };
	minute: { one: string; other: string };
	hour: { one: string; other: string };
	days: string[];
	months: string[];
}

export type TimeagoPlural = 'one' | 'other';

export interface TimeagoProps {
	datetime: string | Date | number;
	isLive?: boolean;
	isDuration?: boolean;
	timeOnly?: boolean;
	/**
	 * BCP 47 locale for the default Intl-driven output. Falls back to the nearest
	 * `WireUIProvider`, then `en-US`. Ignored when `format` is set.
	 */
	locale?: string;
	format?: TimeagoFormatConfig;
	pluralize?: (n: number) => TimeagoPlural;
	class?: string;
}
