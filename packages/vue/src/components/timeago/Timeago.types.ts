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
	format?: TimeagoFormatConfig;
	pluralize?: (n: number) => TimeagoPlural;
	class?: string;
}
