<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { CalendarKey, addMonths, isSameMonth, startOfDay, startOfMonth } from './keys'
import { useWireUILocale, useWireUIMessages } from '@/context/wire-ui-context'
import type { WeekStart } from './Calendar.types'

defineOptions({ name: 'CalendarRoot' })

const props = withDefaults(
	defineProps<{
		value?: Date | null
		defaultValue?: Date | null
		onChange?: (date: Date | null) => void
		defaultMonth?: Date
		month?: Date
		onMonthChange?: (month: Date) => void
		minDate?: Date
		maxDate?: Date
		isDateDisabled?: (date: Date) => boolean
		weekStartsOn?: WeekStart
		/**
		 * BCP 47 locale for month/weekday names. Falls back to the nearest
		 * `WireUIProvider`, then `en-US`.
		 */
		locale?: string
	}>(),
	{
		defaultValue: null,
		weekStartsOn: 0,
	},
)

const uncontrolledValue = ref<Date | null>(props.defaultValue ?? null)
const isValueControlled = computed(() => props.value !== undefined)
const value = computed<Date | null>(() =>
	isValueControlled.value ? (props.value as Date | null) : uncontrolledValue.value,
)

const initialMonth = startOfMonth(props.defaultMonth ?? value.value ?? new Date())
const uncontrolledMonth = ref<Date>(initialMonth)
const isMonthControlled = computed(() => props.month !== undefined)
const month = computed<Date>(() =>
	isMonthControlled.value ? startOfMonth(props.month as Date) : uncontrolledMonth.value,
)

const weekStartsOn = computed(() => props.weekStartsOn)
// Resolve against the nearest WireUIProvider; an explicit prop always wins.
const locale = useWireUILocale(() => props.locale)
const messages = useWireUIMessages()
const minDate = computed(() => props.minDate)
const maxDate = computed(() => props.maxDate)
const isDateDisabled = computed(() => props.isDateDisabled)

function setMonth(next: Date) {
	const normalized = startOfMonth(next)
	if (!isMonthControlled.value) uncontrolledMonth.value = normalized
	props.onMonthChange?.(normalized)
}

function goToMonth(offset: number) {
	setMonth(addMonths(month.value, offset))
}

function selectDate(date: Date) {
	const normalized = startOfDay(date)
	if (!isValueControlled.value) uncontrolledValue.value = normalized
	props.onChange?.(normalized)
	if (!isSameMonth(normalized, month.value)) setMonth(normalized)
}

const canGoPrev = computed(
	() => !props.minDate || addMonths(month.value, -1) >= startOfMonth(props.minDate),
)
const canGoNext = computed(
	() => !props.maxDate || addMonths(month.value, 1) <= startOfMonth(props.maxDate),
)

provide(CalendarKey, {
	month,
	value,
	weekStartsOn,
	locale,
	minDate,
	maxDate,
	isDateDisabled,
	goToMonth,
	selectDate,
	canGoPrev,
	canGoNext,
})
</script>

<template>
	<div
		role="application"
		:aria-label="messages.calendar.label">
		<slot />
	</div>
</template>
