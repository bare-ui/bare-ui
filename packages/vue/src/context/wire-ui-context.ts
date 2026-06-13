import { computed, inject, toValue, type ComputedRef, type InjectionKey, type MaybeRefOrGetter } from 'vue'
import { defaultMessages, type WireUIMessages } from '@/utils/i18n/messages'

/** Locale used when no `<WireUIProvider>` (or explicit prop) sets one. */
export const DEFAULT_LOCALE = 'en-US'

export interface WireUIContextValue {
	/** BCP 47 locale tag (e.g. `en-US`, `de-DE`), reactive. */
	locale: ComputedRef<string>
	/** Fully-resolved message catalog (defaults merged with overrides), reactive. */
	messages: ComputedRef<WireUIMessages>
}

/**
 * Injection key for the value a `<WireUIProvider>` supplies. Components resolve
 * locale/messages through the composables below rather than injecting directly.
 */
export const WireUIContextKey: InjectionKey<WireUIContextValue> = Symbol('WireUIContext')

/**
 * The active locale as a reactive ref. A `localeProp` (a component's own
 * `locale` prop) always wins; otherwise the nearest provider's locale, then
 * `en-US`. Accepts a plain value, ref, or getter so it can track a prop.
 */
export function useWireUILocale(localeProp?: MaybeRefOrGetter<string | undefined>): ComputedRef<string> {
	const ctx = inject(WireUIContextKey, null)
	return computed(() => toValue(localeProp) ?? ctx?.locale.value ?? DEFAULT_LOCALE)
}

/**
 * The resolved message catalog as a reactive ref. Falls back to the English
 * defaults when no provider is mounted.
 */
export function useWireUIMessages(): ComputedRef<WireUIMessages> {
	const ctx = inject(WireUIContextKey, null)
	return computed(() => ctx?.messages.value ?? defaultMessages)
}

/** Both the active locale and resolved messages in one call. */
export function useWireUI(): WireUIContextValue {
	return {
		locale: useWireUILocale(),
		messages: useWireUIMessages(),
	}
}
