'use client';

import { createContext, useContext, type Accessor } from 'solid-js';
import { defaultMessages, type WireUIMessages } from '@/utils/i18n/messages';

/** Locale used when no `<WireUIProvider>` (or explicit prop) sets one. */
export const DEFAULT_LOCALE = 'en-US';

export interface WireUIContextValue {
	/** BCP 47 locale tag (e.g. `en-US`, `de-DE`). */
	readonly locale: string;
	/** Fully-resolved message catalog (defaults merged with overrides). */
	readonly messages: WireUIMessages;
}

export const WireUIContext = createContext<WireUIContextValue | null>(null);

// Reused when no provider is mounted so consumers never branch on `null`. The
// getters keep it shaped like a live context value (and tree-shake-friendly).
const FALLBACK: WireUIContextValue = {
	get locale() {
		return DEFAULT_LOCALE;
	},
	get messages() {
		return defaultMessages;
	},
};

/**
 * The nearest Wire UI context, or a default (en-US + English messages) value
 * when no `<WireUIProvider>` is mounted. `locale` / `messages` are reactive
 * getters — read them inside a tracking scope (JSX, a memo, an accessor) to
 * follow provider changes.
 */
export function useWireUI(): WireUIContextValue {
	return useContext(WireUIContext) ?? FALLBACK;
}

/**
 * The active locale as an accessor. A component's own `locale` prop (passed as
 * an accessor) always wins; otherwise the nearest provider's locale, then
 * `en-US`.
 */
export function useWireUILocale(localeProp?: () => string | undefined): Accessor<string> {
	const ctx = useWireUI();
	return () => localeProp?.() ?? ctx.locale;
}

/** The resolved message catalog as an accessor. */
export function useWireUIMessages(): Accessor<WireUIMessages> {
	const ctx = useWireUI();
	return () => ctx.messages;
}
