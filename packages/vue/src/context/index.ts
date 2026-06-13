import type { PartialMessages } from '@/utils/i18n/messages'

export { default as WireUIProvider } from './WireUIProvider.vue'
export {
	useWireUILocale,
	useWireUIMessages,
	useWireUI,
	DEFAULT_LOCALE,
	WireUIContextKey,
} from './wire-ui-context'
export type { WireUIContextValue } from './wire-ui-context'

/** Props accepted by {@link WireUIProvider}. */
export interface WireUIProviderProps {
	/** BCP 47 locale tag propagated to locale-aware components. Defaults to `en-US`. */
	locale?: string
	/** Partial overrides for the built-in (English) strings. */
	messages?: PartialMessages
}
