'use client';

import { createMemo, useContext, type JSX } from 'solid-js';
import { defaultMessages, mergeMessages, type PartialMessages } from '@/utils/i18n/messages';
import { DEFAULT_LOCALE, WireUIContext, type WireUIContextValue } from './wire-ui-context';

export interface WireUIProviderProps {
	/**
	 * BCP 47 locale tag propagated to Calendar, DatePicker, NumberInput, Timeago
	 * and any other locale-aware component. Defaults to `en-US`. When nested, a
	 * child provider that omits `locale` inherits the parent's.
	 */
	locale?: string;
	/**
	 * Partial overrides for the built-in (English) strings. Merged per-namespace
	 * over the defaults, and over any parent provider's overrides when nested.
	 */
	messages?: PartialMessages;
	children?: JSX.Element;
}

/**
 * Provides a locale and translatable strings to Wire UI components. Optional —
 * components fall back to `en-US` and their English defaults without it.
 *
 * @example
 * <WireUIProvider locale="de-DE" messages={{ calendar: { nextMonth: 'Nächster Monat' } }}>
 *   <App />
 * </WireUIProvider>
 */
export function WireUIProvider(props: WireUIProviderProps) {
	const parent = useContext(WireUIContext);

	// Re-merge only when the parent's catalog or this provider's overrides change.
	const messages = createMemo(() => mergeMessages(parent?.messages ?? defaultMessages, props.messages));

	const value: WireUIContextValue = {
		get locale() {
			return props.locale ?? parent?.locale ?? DEFAULT_LOCALE;
		},
		get messages() {
			return messages();
		},
	};

	return <WireUIContext.Provider value={value}>{props.children}</WireUIContext.Provider>;
}
