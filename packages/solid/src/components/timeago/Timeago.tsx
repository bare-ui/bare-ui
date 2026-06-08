'use client';

import { createEffect, createMemo, createSignal, splitProps } from 'solid-js';
import { createInterval } from '@/primitives/create-interval';
import type { TimeagoFormatConfig, TimeagoPlural, TimeagoProps } from './Timeago.types';

const MS_PER_MINUTE = 1000 * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const REFRESH_MS = 60000;

const defaultFormat: TimeagoFormatConfig = {
	just: 'Just Now',
	past: '#time ago',
	today: 'Today, #time',
	second: { one: '#num second', other: '#num seconds' },
	minute: { one: '#num minute', other: '#num minutes' },
	hour: { one: '#num hour', other: '#num hours' },
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	months: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
};

const defaultPluralize = (n: number): TimeagoPlural => (n === 1 ? 'one' : 'other');

function toDate(timestamp: string | Date | number): Date {
	return new Date(timestamp);
}

function difference(datetime: Date | number): number {
	const time = datetime instanceof Date ? datetime.getTime() : datetime;
	return Math.floor(new Date().getTime() - time);
}

function Timeago(props: TimeagoProps) {
	const [local, rest] = splitProps(props, [
		'datetime',
		'isLive',
		'isDuration',
		'timeOnly',
		'format',
		'pluralize',
		'class',
	]);

	const format = () => local.format ?? defaultFormat;
	const pluralize = () => local.pluralize ?? defaultPluralize;

	// `tick` forces the display memo to re-evaluate every minute when isLive is on.
	const [tick, setTick] = createSignal(0);

	const getTimeOnly = (): string => {
		const parsetime = toDate(local.datetime);
		const hours = parsetime.getHours();
		const minutes = parsetime.getMinutes();
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	};

	const getDuration = (): string => {
		const fmt = format();
		const parsetime = toDate(local.datetime);
		const mSeconds = difference(parsetime);
		const pastTime = fmt.past;

		if (mSeconds < MS_PER_MINUTE) {
			return fmt.just;
		}

		let timeValue: string;
		if (mSeconds < MS_PER_HOUR) {
			const time = Math.round(mSeconds / MS_PER_MINUTE);
			const pluralType = pluralize()(time);
			timeValue = fmt.minute[pluralType].replace('#num', time.toString());
		} else {
			const time = Math.round(mSeconds / MS_PER_HOUR);
			const pluralType = pluralize()(time);
			timeValue = fmt.hour[pluralType].replace('#num', time.toString());
		}

		return pastTime.replace('#time', timeValue);
	};

	const getDateTime = (): string => {
		const fmt = format();
		const inputDate = toDate(local.datetime);
		const today = new Date();
		const time = getTimeOnly();

		const inputDateCopy = new Date(inputDate);
		const todayCopy = new Date(today);
		inputDateCopy.setHours(0, 0, 0, 0);
		todayCopy.setHours(0, 0, 0, 0);

		if (inputDateCopy.getTime() === todayCopy.getTime()) {
			return fmt.today.replace('#time', time);
		}

		const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / MS_PER_DAY);
		const day = fmt.days[inputDate.getDay()];

		if (diffDays < 7) {
			return `${day}, ${time}`;
		}

		const date = inputDate.getDate();
		const month = fmt.months[inputDate.getMonth()];
		const year = inputDate.getFullYear();

		if (year === today.getFullYear()) {
			return `${month} ${date}, ${time}`;
		}

		return `${month} ${date} ${year}, ${time}`;
	};

	const display = createMemo(() => {
		// Subscribe to tick — re-runs the memo each minute when isLive is on.
		tick();
		if (local.isDuration) return getDuration();
		if (local.timeOnly) return getTimeOnly();
		return getDateTime();
	});

	const { start, stop } = createInterval(() => setTick((t) => t + 1), REFRESH_MS, { autoStart: false });
	createEffect(() => (local.isLive ? start() : stop()));

	// Expose the machine-readable ISO value so screen readers (and crawlers) get an
	// unambiguous full timestamp, not just the relative/short display text. Guard
	// against invalid dates (toISOString throws on NaN).
	const machineValue = (): string | undefined => {
		const parsed = toDate(local.datetime);
		return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
	};

	return (
		<time
			datetime={machineValue()}
			class={local.class}
			{...rest}>
			{display()}
		</time>
	);
}

export { Timeago };