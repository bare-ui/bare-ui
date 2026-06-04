'use client';

import React, { useCallback, useState } from 'react';
import { useInterval } from '@/hooks/use-interval';
import { useWireUILocale, useWireUIMessages } from '@/context/wire-ui-context';
import { formatRelativeTime, getDayNames, getMonthNames } from '@/utils/i18n/formatters';
import type { TimeagoPlural, TimeagoProps } from './Timeago.types';

const MS_PER_MINUTE = 1000 * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const REFRESH_MS = 60000;

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
			locale: localeProp,
			format,
			pluralize = defaultPluralize,
			className,
			...rest
		},
		ref,
	) => {
		const locale = useWireUILocale(localeProp);
		const messages = useWireUIMessages();

		const getTimeOnly = useCallback((): string => {
			const parsetime = toDate(datetime);
			const hours = parsetime.getHours();
			const minutes = parsetime.getMinutes();
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		}, [datetime]);

		const getDuration = useCallback((): string => {
			const parsetime = toDate(datetime);
			const mSeconds = difference(parsetime);

			// Legacy path: an explicit `format` override drives the #time/#num
			// templates and the caller-supplied pluralization.
			if (format) {
				if (mSeconds < MS_PER_MINUTE) return format.just;
				let timeValue: string;
				if (mSeconds < MS_PER_HOUR) {
					const time = Math.round(mSeconds / MS_PER_MINUTE);
					timeValue = format.minute[pluralize(time)].replace('#num', time.toString());
				} else {
					const time = Math.round(mSeconds / MS_PER_HOUR);
					timeValue = format.hour[pluralize(time)].replace('#num', time.toString());
				}
				return format.past.replace('#time', timeValue);
			}

			// Default path: delegate to Intl.RelativeTimeFormat for the active locale.
			if (mSeconds < MS_PER_MINUTE) return messages.timeago.justNow;
			if (mSeconds < MS_PER_HOUR) {
				return formatRelativeTime(-Math.round(mSeconds / MS_PER_MINUTE), 'minute', locale);
			}
			return formatRelativeTime(-Math.round(mSeconds / MS_PER_HOUR), 'hour', locale);
		}, [datetime, format, pluralize, locale, messages]);

		const getDateTime = useCallback((): string => {
			const inputDate = toDate(datetime);
			const today = new Date();
			const time = getTimeOnly();

			const inputDateCopy = new Date(inputDate);
			const todayCopy = new Date(today);
			inputDateCopy.setHours(0, 0, 0, 0);
			todayCopy.setHours(0, 0, 0, 0);

			if (inputDateCopy.getTime() === todayCopy.getTime()) {
				return format ? format.today.replace('#time', time) : messages.timeago.today(time);
			}

			// Day/month names come from the `format` override when present, else
			// from Intl for the active locale.
			const dayNames = format ? format.days : getDayNames(locale);
			const monthNames = format ? format.months : getMonthNames(locale);

			const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / MS_PER_DAY);
			const day = dayNames[inputDate.getDay()];

			if (diffDays < 7) {
				return `${day}, ${time}`;
			}

			const date = inputDate.getDate();
			const month = monthNames[inputDate.getMonth()];
			const year = inputDate.getFullYear();

			if (year === today.getFullYear()) {
				return `${month} ${date}, ${time}`;
			}

			return `${month} ${date} ${year}, ${time}`;
		}, [datetime, format, getTimeOnly, locale, messages]);

		const computeDisplay = useCallback((): string => {
			if (isDuration) return getDuration();
			if (timeOnly) return getTimeOnly();
			return getDateTime();
		}, [isDuration, timeOnly, getDuration, getTimeOnly, getDateTime]);

		const [tick, setTick] = useState(0);

		useInterval(() => setTick((t) => t + 1), isLive ? REFRESH_MS : null);

		// Suppress unused warning — tick drives re-renders for live updates
		void tick;

		const display = computeDisplay();

		// Expose the machine-readable ISO value so screen readers (and crawlers)
		// get an unambiguous full timestamp, not just the relative/short display text.
		const machineValue = toDate(datetime).toISOString();

		return (
			<time
				ref={ref}
				dateTime={machineValue}
				className={className}
				// The relative/short display is computed against `new Date()`, so the
				// server-rendered text and the client's first-hydration text can differ
				// (clock drift, and timezone-sensitive formatting when the server runs in
				// UTC). The machine-readable `dateTime` is deterministic; we suppress the
				// warning only for this element's text, which React reconciles to the
				// client value after hydration. (React's documented case for timestamps.)
				suppressHydrationWarning
				{...rest}>
				{display}
			</time>
		);
	},
);

Timeago.displayName = 'Timeago';

export { Timeago };
