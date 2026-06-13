<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { defaultMessages, mergeMessages, type PartialMessages } from '@/utils/i18n/messages'
import { DEFAULT_LOCALE, WireUIContextKey, type WireUIContextValue } from './wire-ui-context'

defineOptions({ name: 'WireUIProvider', inheritAttrs: false })

const props = defineProps<{
	/**
	 * BCP 47 locale tag propagated to Calendar, DatePicker, NumberInput, Timeago
	 * and any other locale-aware component. Defaults to `en-US`. When nested, a
	 * child provider that omits `locale` inherits the parent's.
	 */
	locale?: string
	/**
	 * Partial overrides for the built-in (English) strings. Merged per-namespace
	 * over the defaults, and over any parent provider's overrides when nested.
	 */
	messages?: PartialMessages
}>()

// A parent provider, if any — child inherits its locale and layers messages.
const parent = inject(WireUIContextKey, null)

const locale = computed(() => props.locale ?? parent?.locale.value ?? DEFAULT_LOCALE)
const messages = computed(() => mergeMessages(parent?.messages.value ?? defaultMessages, props.messages))

provide(WireUIContextKey, { locale, messages } satisfies WireUIContextValue)
</script>

<template>
	<slot />
</template>
