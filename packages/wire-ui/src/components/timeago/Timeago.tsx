import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const Timeago = React.forwardRef<HTMLTimeElement, TimeagoProps>(
	(
		{
			datetime,
			isLive = false,
			isDuration = false,
			timeOnly = false,
			format = defaultFormat,
			pluralize = defaultPluralize,
			className,
			...rest
		},
		ref,
	) => {
		const getTimeOnly = useCallback((): string => {
			const parsetime = toDate(datetime);
			const hours = parsetime.getHours();
			const minutes = parsetime.getMinutes();
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		}, [datetime]);

		const getDuration = useCallback((): string => {
			const parsetime = toDate(datetime);
			const mSeconds = difference(parsetime);
			const pastTime = format.past;

			if (mSeconds < MS_PER_MINUTE) {
				return format.just;
			}

			let timeValue: string;
			if (mSeconds < MS_PER_HOUR) {
				const time = Math.round(mSeconds / MS_PER_MINUTE);
				const pluralType = pluralize(time);
				timeValue = format.minute[pluralType].replace('#num', time.toString());
			} else {
				const time = Math.round(mSeconds / MS_PER_HOUR);
				const pluralType = pluralize(time);
				timeValue = format.hour[pluralType].replace('#num', time.toString());
			}

			return pastTime.replace('#time', timeValue);
		}, [datetime, format, pluralize]);

		const getDateTime = useCallback((): string => {
			const inputDate = toDate(datetime);
			const today = new Date();
			const time = getTimeOnly();

			const inputDateCopy = new Date(inputDate);
			const todayCopy = new Date(today);
			inputDateCopy.setHours(0, 0, 0, 0);
			todayCopy.setHours(0, 0, 0, 0);

			if (inputDateCopy.getTime() === todayCopy.getTime()) {
				return format.today.replace('#time', time);
			}

			const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / MS_PER_DAY);
			const day = format.days[inputDate.getDay()];

			if (diffDays < 7) {
				return `${day}, ${time}`;
			}

			const date = inputDate.getDate();
			const month = format.months[inputDate.getMonth()];
			const year = inputDate.getFullYear();

			if (year === today.getFullYear()) {
				return `${month} ${date}, ${time}`;
			}

			return `${month} ${date} ${year}, ${time}`;
		}, [datetime, format, getTimeOnly]);

		const computeDisplay = useCallback((): string => {
			if (isDuration) return getDuration();
			if (timeOnly) return getTimeOnly();
			return getDateTime();
		}, [isDuration, timeOnly, getDuration, getTimeOnly, getDateTime]);

		const [tick, setTick] = useState(0);
		const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

		useEffect(() => {
			if (isLive) {
				intervalRef.current = setInterval(() => {
					setTick((t) => t + 1);
				}, REFRESH_MS);
			}

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		}, [isLive]);

		// Suppress unused warning — tick drives re-renders for live updates
		void tick;

		const display = computeDisplay();

		return (
			<time
				ref={ref}
				className={className}
				{...rest}>
				{display}
			</time>
		);
	},
);

Timeago.displayName = 'Timeago';

export { Timeago };
