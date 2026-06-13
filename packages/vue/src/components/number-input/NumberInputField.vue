<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNumberInputContext } from './keys'
import { formatNumber, parseLocaleNumber } from '@/utils/i18n/formatters'

defineOptions({ name: 'NumberInputField', inheritAttrs: false })

const ctx = useNumberInputContext()

// Render the committed value: locale-formatted when `formatOptions` is set,
// otherwise the raw numeric string (default, back-compatible behavior).
function formatValue(v: number | null): string {
	if (v === null) return ''
	return ctx.formatOptions.value ? formatNumber(v, ctx.locale.value, ctx.formatOptions.value) : String(v)
}

const text = ref<string>(formatValue(ctx.value.value))

// Re-sync the visible text whenever the committed value, locale, or format
// options change (typing alone doesn't change ctx.value — the field commits on
// blur — so this won't stomp on in-progress input).
watch(
	[() => ctx.value.value, () => ctx.locale.value, () => ctx.formatOptions.value],
	() => {
		text.value = formatValue(ctx.value.value)
	},
)

const ariaValueNow = computed(() => ctx.value.value ?? undefined)
const ariaValueMin = computed(() => (Number.isFinite(ctx.min.value) ? ctx.min.value : undefined))
const ariaValueMax = computed(() => (Number.isFinite(ctx.max.value) ? ctx.max.value : undefined))

function onKeyDown(e: KeyboardEvent) {
	if (e.defaultPrevented || ctx.disabled.value || ctx.readOnly.value) return
	if (e.key === 'ArrowUp') {
		e.preventDefault()
		ctx.stepBy(ctx.step.value)
	} else if (e.key === 'ArrowDown') {
		e.preventDefault()
		ctx.stepBy(-ctx.step.value)
	} else if (e.key === 'PageUp') {
		e.preventDefault()
		ctx.stepBy(ctx.step.value * 10)
	} else if (e.key === 'PageDown') {
		e.preventDefault()
		ctx.stepBy(-ctx.step.value * 10)
	} else if (e.key === 'Home' && Number.isFinite(ctx.min.value)) {
		e.preventDefault()
		ctx.setValue(ctx.min.value)
	} else if (e.key === 'End' && Number.isFinite(ctx.max.value)) {
		e.preventDefault()
		ctx.setValue(ctx.max.value)
	}
}

function commitText(raw: string) {
	const trimmed = raw.trim()
	if (trimmed === '' || trimmed === '-' || trimmed === '.') {
		ctx.setValue(null)
		text.value = ''
		return
	}
	const parsed = ctx.formatOptions.value ? parseLocaleNumber(trimmed, ctx.locale.value) : Number(trimmed)
	if (Number.isNaN(parsed)) {
		// Revert to the last good value.
		text.value = formatValue(ctx.value.value)
		return
	}
	ctx.setValue(parsed)
	// Re-render the formatted value even when the committed number is unchanged
	// (the value-sync watcher above only fires on a change).
	text.value = formatValue(parsed)
}

function onBlur() {
	commitText(text.value)
}
</script>

<template>
	<input
		v-model="text"
		type="text"
		inputmode="decimal"
		role="spinbutton"
		:aria-valuenow="ariaValueNow"
		:aria-valuemin="ariaValueMin"
		:aria-valuemax="ariaValueMax"
		:disabled="ctx.disabled.value"
		:readonly="ctx.readOnly.value"
		v-bind="$attrs"
		@keydown="onKeyDown"
		@blur="onBlur" />
</template>
