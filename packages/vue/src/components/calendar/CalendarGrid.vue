<script setup lang="ts">
import { computed } from 'vue'
import {
	buildMonthGrid,
	getWeekdayNames,
	isSameDay,
	isSameMonth,
	startOfDay,
	useCalendarContext,
} from './keys'
import type { CalendarDay, CalendarWeekday } from './Calendar.types'

defineOptions({ name: 'CalendarGrid' })

defineSlots<{
	day?(props: { day: CalendarDay }): unknown
	weekday?(props: { weekday: CalendarWeekday }): unknown
}>()

const ctx = useCalendarContext()
const today = startOfDay(new Date())

const weekdays = computed(() => getWeekdayNames(ctx.weekStartsOn.value, ctx.locale.value))
const days = computed(() => buildMonthGrid(ctx.month.value, ctx.weekStartsOn.value))

function makeDay(d: Date): CalendarDay {
	const isOutsideMonth = !isSameMonth(d, ctx.month.value)
	const isToday = isSameDay(d, today)
	const isSelected = ctx.value.value ? isSameDay(d, ctx.value.value) : false
	const beforeMin = ctx.minDate.value ? d < startOfDay(ctx.minDate.value) : false
	const afterMax = ctx.maxDate.value ? d > startOfDay(ctx.maxDate.value) : false
	const customDisabled = ctx.isDateDisabled.value?.(d) ?? false
	const isDisabled = beforeMin || afterMax || customDisabled
	const isWeekend = d.getDay() === 0 || d.getDay() === 6

	return {
		date: d,
		dayOfMonth: d.getDate(),
		isToday,
		isSelected,
		isOutsideMonth,
		isDisabled,
		isWeekend,
		props: {
			role: 'gridcell',
			type: 'button',
			tabindex: isSelected ? 0 : -1,
			disabled: isDisabled,
			'aria-selected': isSelected,
			'aria-current': isToday ? 'date' : undefined,
			'data-today': isToday ? '' : undefined,
			'data-selected': isSelected ? '' : undefined,
			'data-outside-month': isOutsideMonth ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			'data-weekend': isWeekend ? '' : undefined,
			onClick: () => {
				if (!isDisabled) ctx.selectDate(d)
			},
		},
	}
}

const gridStyle = {
	display: 'grid',
	gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
}
</script>

<template>
	<div
		role="grid"
		:style="gridStyle">
		<template
			v-for="wd in weekdays"
			:key="wd.name">
			<slot
				name="weekday"
				:weekday="wd">
				<div
					role="columnheader"
					:aria-label="wd.name"
					style="text-align: center; padding: 4px 0;">
					{{ wd.short }}
				</div>
			</slot>
		</template>
		<template
			v-for="(d, i) in days"
			:key="i">
			<slot
				name="day"
				:day="makeDay(d)">
				<button
					v-bind="makeDay(d).props"
					:style="{
						padding: '6px',
						background: 'transparent',
						border: 'none',
						color: makeDay(d).isOutsideMonth ? '#a3a3a3' : 'inherit',
						cursor: makeDay(d).isDisabled ? 'not-allowed' : 'pointer',
						opacity: makeDay(d).isDisabled ? 0.4 : 1,
					}">
					{{ makeDay(d).dayOfMonth }}
				</button>
			</slot>
		</template>
	</div>
</template>
