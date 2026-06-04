'use client';

import { createContext, useContext } from 'react';
import { defaultMessages, type WireUIMessages } from '@/utils/i18n/messages';

/** Locale used when no `<WireUIProvider>` (or explicit prop) sets one. */
export const DEFAULT_LOCALE = 'en-US';

export interface WireUIContextValue {
	/** BCP 47 locale tag (e.g. `en-US`, `de-DE`). */
	locale: string;
	/** Fully-resolved message catalog (defaults merged with overrides). */
	messages: WireUIMessages;
}

export const WireUIContext = createContext<WireUIContextValue | null>(null);

/**
 * The active locale. A `localeProp` (a component's own `locale` prop) always
 * wins; otherwise the nearest provider's locale, then `en-US`.
 */
export function useWireUILocale(localeProp?: string): string {
	const ctx = useContext(WireUIContext);
	return localeProp ?? ctx?.locale ?? DEFAULT_LOCALE;
}

/**
 * The resolved message catalog. Falls back to the English defaults when no
 * provider is mounted.
 */
export function useWireUIMessages(): WireUIMessages {
	return useContext(WireUIContext)?.messages ?? defaultMessages;
}

/** Both the active locale and resolved messages in one call. */
export function useWireUI(): WireUIContextValue {
	const ctx = useContext(WireUIContext);
	return ctx ?? { locale: DEFAULT_LOCALE, messages: defaultMessages };
}
