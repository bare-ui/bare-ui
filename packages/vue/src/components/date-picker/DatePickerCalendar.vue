<script setup lang="ts">
import { useDatePickerContext } from './keys'
import { Calendar } from '../calendar'
import type { WeekStart } from '../calendar/Calendar.types'

defineOptions({ name: 'DatePickerCalendar' })

defineProps<{
	defaultMonth?: Date
	month?: Date
	onMonthChange?: (month: Date) => void
	minDate?: Date
	maxDate?: Date
	isDateDisabled?: (date: Date) => boolean
	weekStartsOn?: WeekStart
	locale?: string
}>()

const ctx = useDatePickerContext()

function onChange(next: Date | null) {
	ctx.setValue(next)
	if (ctx.closeOnSelect.value && next) ctx.setOpen(false)
}
</script>

<template>
	<Calendar.Root
		:value="ctx.value.value"
		:on-change="onChange"
		:default-month="defaultMonth"
		:month="month"
		:on-month-change="onMonthChange"
		:min-date="minDate"
		:max-date="maxDate"
		:is-date-disabled="isDateDisabled"
		:week-starts-on="weekStartsOn"
		:locale="locale ?? ctx.locale.value">
		<slot />
	</Calendar.Root>
</template>
