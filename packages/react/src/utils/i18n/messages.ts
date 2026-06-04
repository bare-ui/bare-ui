/**
 * Translatable strings catalog.
 *
 * Every user-facing string that components render internally (aria-labels,
 * live-region announcements, default placeholders) lives here so it can be
 * localized through `<WireUIProvider messages={...}>` or a per-component
 * `messages` prop. Values are either plain strings or template functions for
 * the parts that interpolate runtime data.
 *
 * The English defaults below are intentionally byte-identical to the strings
 * the components used to hard-code — overriding is purely additive.
 */
export interface WireUIMessages {
	calendar: {
		/** aria-label for the "go to previous month" button. */
		previousMonth: string;
		/** aria-label for the "go to next month" button. */
		nextMonth: string;
	};
	numberInput: {
		/** aria-label for the increment (step up) button. */
		increment: string;
		/** aria-label for the decrement (step down) button. */
		decrement: string;
	};
	timeago: {
		/** Text shown for timestamps less than a minute old. */
		justNow: string;
		/** Same-day template; receives the already-formatted time. */
		today: (time: string) => string;
	};
	pagination: {
		/** aria-label for the navigation landmark. */
		label: string;
		/** aria-label for a page-number button. */
		page: (page: number) => string;
		/** aria-label for the previous-page button. */
		previous: string;
		/** aria-label for the next-page button. */
		next: string;
	};
	carousel: {
		/** aria-label for the previous-slide button. */
		previous: string;
		/** aria-label for the next-slide button. */
		next: string;
		/** Live-region announcement of the active slide. */
		slide: (current: number, count: number) => string;
	};
	password: {
		/** aria-label for the toggle when the password is hidden. */
		show: string;
		/** aria-label for the toggle when the password is visible. */
		hide: string;
	};
	combobox: {
		/** aria-label for the options toggle button. */
		toggle: string;
	};
	rating: {
		/** aria-label for the rating group when nothing is selected. */
		label: string;
		/** aria-label for the rating group describing the current value. */
		valueText: (value: number, max: number) => string;
		/** aria-label for an individual star control. */
		starText: (star: number, max: number) => string;
	};
	otp: {
		/** aria-label for an individual OTP digit slot (1-based index). */
		digit: (index: number) => string;
	};
	toast: {
		/** aria-label for the toast region landmark. */
		region: string;
		/** aria-label for a toast's close button. */
		close: string;
	};
}

/** A recursively-optional view of {@link WireUIMessages} for partial overrides. */
export type PartialMessages = {
	[K in keyof WireUIMessages]?: Partial<WireUIMessages[K]>;
};

/** The built-in English (`en-US`) strings. */
export const defaultMessages: WireUIMessages = {
	calendar: {
		previousMonth: 'Previous month',
		nextMonth: 'Next month',
	},
	numberInput: {
		increment: 'Increment',
		decrement: 'Decrement',
	},
	timeago: {
		justNow: 'Just Now',
		today: (time) => `Today, ${time}`,
	},
	pagination: {
		label: 'Pagination',
		page: (page) => `Page ${page}`,
		previous: 'Previous page',
		next: 'Next page',
	},
	carousel: {
		previous: 'Previous slide',
		next: 'Next slide',
		slide: (current, count) => `Slide ${current} of ${count}`,
	},
	password: {
		show: 'Show password',
		hide: 'Hide password',
	},
	combobox: {
		toggle: 'Toggle options',
	},
	rating: {
		label: 'Rating',
		valueText: (value, max) => `Rating: ${value} out of ${max}`,
		starText: (star, max) => `${star} out of ${max} stars`,
	},
	otp: {
		digit: (index) => `Digit ${index}`,
	},
	toast: {
		region: 'Notifications',
		close: 'Close notification',
	},
};

/**
 * Shallow-merge each namespace of `overrides` over `base`, returning a complete
 * {@link WireUIMessages}. Namespaces are one level deep, so a per-namespace
 * spread is enough and template functions are treated as leaf values.
 */
export function mergeMessages(base: WireUIMessages, overrides?: PartialMessages): WireUIMessages {
	if (!overrides) return base;
	// Build into a loosely-typed record — TS can't narrow the indexed namespace
	// type across the generic key — then assert the completed shape on return.
	const result: Record<string, unknown> = {};
	for (const key of Object.keys(base) as (keyof WireUIMessages)[]) {
		result[key] = { ...(base[key] as object), ...((overrides[key] as object) ?? {}) };
	}
	return result as unknown as WireUIMessages;
}
