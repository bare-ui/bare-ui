/**
 * Translatable strings catalog.
 *
 * Every user-facing string that components render internally (aria-labels,
 * live-region announcements, default placeholders) lives here so it can be
 * localized through `<WireUIProvider :messages="...">` or a per-component
 * `messages` prop. Values are either plain strings or template functions for
 * the parts that interpolate runtime data.
 *
 * The English defaults below are intentionally byte-identical to the strings
 * the components used to hard-code — overriding is purely additive.
 */
export interface WireUIMessages {
	calendar: {
		/** aria-label for the "go to previous month" button. */
		previousMonth: string
		/** aria-label for the "go to next month" button. */
		nextMonth: string
	}
	numberInput: {
		/** aria-label for the increment (step up) button. */
		increment: string
		/** aria-label for the decrement (step down) button. */
		decrement: string
	}
	timeago: {
		/** Text shown for timestamps less than a minute old. */
		justNow: string
		/** Same-day template; receives the already-formatted time. */
		today: (time: string) => string
	}
}

/** A recursively-optional view of {@link WireUIMessages} for partial overrides. */
export type PartialMessages = {
	[K in keyof WireUIMessages]?: Partial<WireUIMessages[K]>
}

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
}

/**
 * Shallow-merge each namespace of `overrides` over `base`, returning a complete
 * {@link WireUIMessages}. Namespaces are one level deep, so a per-namespace
 * spread is enough and template functions are treated as leaf values.
 */
export function mergeMessages(base: WireUIMessages, overrides?: PartialMessages): WireUIMessages {
	if (!overrides) return base
	// Build into a loosely-typed record — TS can't narrow the indexed namespace
	// type across the generic key — then assert the completed shape on return.
	const result: Record<string, unknown> = {}
	for (const key of Object.keys(base) as (keyof WireUIMessages)[]) {
		result[key] = { ...(base[key] as object), ...((overrides[key] as object) ?? {}) }
	}
	return result as unknown as WireUIMessages
}
