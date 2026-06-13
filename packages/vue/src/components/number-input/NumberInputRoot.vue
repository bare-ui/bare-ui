<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { NumberInputKey } from './keys'
import { useWireUILocale } from '@/context/wire-ui-context'

defineOptions({ name: 'NumberInputRoot' })

const props = withDefaults(
	defineProps<{
		value?: number | null
		defaultValue?: number | null
		onChange?: (value: number | null) => void
		min?: number
		max?: number
		step?: number
		precision?: number
		disabled?: boolean
		readOnly?: boolean
		/**
		 * BCP 47 locale for number formatting. Falls back to the nearest
		 * `WireUIProvider`, then `en-US`. Only used when `formatOptions` is set.
		 */
		locale?: string
		/** `Intl.NumberFormat` options for displaying/parsing the value. */
		formatOptions?: Intl.NumberFormatOptions
	}>(),
	{
		defaultValue: null,
		step: 1,
		disabled: false,
		readOnly: false,
	},
)

function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max)
}

function decimalsOf(step: number) {
	const s = step.toString()
	const dot = s.indexOf('.')
	return dot === -1 ? 0 : s.length - dot - 1
}

function round(value: number, decimals: number) {
	const factor = Math.pow(10, decimals)
	return Math.round(value * factor) / factor
}

const uncontrolled = ref<number | null>(props.defaultValue)
const isControlled = computed(() => props.value !== undefined)
const value = computed<number | null>(() =>
	isControlled.value ? (props.value as number | null) : uncontrolled.value,
)

const min = computed(() => props.min ?? Number.NEGATIVE_INFINITY)
const max = computed(() => props.max ?? Number.POSITIVE_INFINITY)
const step = computed(() => props.step)
const precision = computed(() => props.precision ?? decimalsOf(props.step))
const disabled = computed(() => props.disabled)
const readOnly = computed(() => props.readOnly)
const locale = useWireUILocale(() => props.locale)
const formatOptions = computed(() => props.formatOptions)

function setValue(next: number | null) {
	const normalized =
		next === null || Number.isNaN(next) ? null : round(clamp(next, min.value, max.value), precision.value)
	if (!isControlled.value) uncontrolled.value = normalized
	props.onChange?.(normalized)
}

function stepBy(delta: number) {
	if (props.disabled || props.readOnly) return
	const base = value.value ?? 0
	setValue(base + delta)
}

function increment() {
	stepBy(props.step)
}

function decrement() {
	stepBy(-props.step)
}

provide(NumberInputKey, {
	value,
	min,
	max,
	step,
	precision,
	disabled,
	readOnly,
	locale,
	formatOptions,
	setValue,
	increment,
	decrement,
	stepBy,
})
</script>

<template>
	<div
		:data-disabled="props.disabled ? '' : undefined"
		:data-readonly="props.readOnly ? '' : undefined">
		<slot />
	</div>
</template>
