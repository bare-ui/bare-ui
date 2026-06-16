<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
	addDays,
	addMonths,
	buildMonthGrid,
	getWeekdayNames,
	isSameDay,
	isSameMonth,
	parseISODate,
	startOfDay,
	startOfMonth,
	startOfWeek,
	toISODate,
	useCalendarContext,
} from './keys'
import { getDirection } from '@/composables/use-direction'
import type { CalendarDay, CalendarWeekday } from './Calendar.types'

defineOptions({ name: 'CalendarGrid' })

defineSlots<{
	day?(props: { day: CalendarDay }): unknown
	weekday?(props: { weekday: CalendarWeekday }): unknown
}>()

const ctx = useCalendarContext()
const gridRef = ref<HTMLElement | null>(null)
const today = startOfDay(new Date())

const weekdays = computed(() => getWeekdayNames(ctx.weekStartsOn.value, ctx.locale.value))
const days = computed(() => buildMonthGrid(ctx.month.value, ctx.weekStartsOn.value))

// Split the flat 42-day list into 6 weeks of 7 days so each week can be
// wrapped in a role="row" (required by the ARIA grid pattern).
const weeks = computed(() => {
	const chunks: Date[][] = []
	for (let i = 0; i < days.value.length; i += 7) chunks.push(days.value.slice(i, i + 7))
	return chunks
})

// Track the keyboard-focused date separately from the selected date.
const focusedDate = ref<Date | null>(null)

function isDisabledDate(d: Date): boolean {
	const beforeMin = ctx.minDate.value ? d < startOfDay(ctx.minDate.value) : false
	const afterMax = ctx.maxDate.value ? d > startOfDay(ctx.maxDate.value) : false
	return beforeMin || afterMax || (ctx.isDateDisabled.value?.(d) ?? false)
}

// Exactly one day cell is tabbable (roving tabindex). Prefer the keyboard
// target, then the selected date, then today, then the first selectable day
// of the month — always an enabled, in-month date so Tab can reach the grid.
const tabbableDate = computed(() => {
	const inMonth = (d: Date | null | undefined) =>
		d && isSameMonth(d, ctx.month.value) ? startOfDay(d) : null
	for (const candidate of [inMonth(focusedDate.value), inMonth(ctx.value.value), inMonth(today)]) {
		if (candidate && !isDisabledDate(candidate)) return candidate
	}
	const first = startOfMonth(ctx.month.value)
	for (let i = 0; i < 31; i++) {
		const d = addDays(first, i)
		if (!isSameMonth(d, ctx.month.value)) break
		if (!isDisabledDate(d)) return d
	}
	return first
})

// After a navigation re-renders the grid (possibly a new month), move DOM
// focus to the targeted cell.
watch([focusedDate, () => ctx.month.value], async ([fd]) => {
	if (!fd) return
	await nextTick()
	const cell = gridRef.value?.querySelector<HTMLElement>(`[data-date="${toISODate(fd)}"]`)
	cell?.focus()
}, { flush: 'post' })

// Move the keyboard target, switching month when it crosses a boundary.
// Disabled days are skipped so focus is never lost.
function moveTo(target: Date) {
	const t = startOfDay(target)
	if (isDisabledDate(t)) return
	const monthDiff =
		(t.getFullYear() - ctx.month.value.getFullYear()) * 12 +
		(t.getMonth() - ctx.month.value.getMonth())
	if (monthDiff !== 0) ctx.goToMonth(monthDiff)
	focusedDate.value = t
}

const gridLabel = computed(() =>
	new Intl.DateTimeFormat(ctx.locale.value, { month: 'long', year: 'numeric' }).format(ctx.month.value),
)

function handleKeyDown(e: KeyboardEvent) {
	const targetIso = (e.target as HTMLElement).getAttribute?.('data-date')
	const base = targetIso ? parseISODate(targetIso) : tabbableDate.value
	// RTL mirrors the day grid: ArrowLeft moves to the next day, ArrowRight to the previous.
	const dayStep = getDirection(e.currentTarget as Element) === 'rtl' ? -1 : 1
	let next: Date | null = null
	switch (e.key) {
		case 'ArrowLeft':  next = addDays(base, -dayStep); break
		case 'ArrowRight': next = addDays(base,  dayStep); break
		case 'ArrowUp':    next = addDays(base, -7); break
		case 'ArrowDown':  next = addDays(base,  7); break
		case 'Home':       next = startOfWeek(base, ctx.weekStartsOn.value); break
		case 'End':        next = addDays(startOfWeek(base, ctx.weekStartsOn.value), 6); break
		case 'PageUp':     next = addMonths(base, e.shiftKey ? -12 : -1); break
		case 'PageDown':   next = addMonths(base, e.shiftKey ?  12 :  1); break
	}
	if (next) {
		e.preventDefault()
		moveTo(next)
	}
}

function makeDay(d: Date): CalendarDay {
	const isOutsideMonth = !isSameMonth(d, ctx.month.value)
	const isToday = isSameDay(d, today)
	const isSelected = ctx.value.value ? isSameDay(d, ctx.value.value) : false
	const isDisabled = isDisabledDate(d)
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
			tabindex: isSameDay(d, tabbableDate.value) ? 0 : -1,
			disabled: isDisabled,
			'data-date': toISODate(d),
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

const rowStyle = {
	display: 'grid',
	gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
}
</script>

<template>
	<div
		ref="gridRef"
		role="grid"
		:aria-label="gridLabel"
		@keydown="handleKeyDown">
		<div role="row" :style="rowStyle">
			<template v-for="wd in weekdays" :key="wd.name">
				<slot
					name="weekday"
					:weekday="{ name: wd.name, short: wd.short, props: { role: 'columnheader', 'aria-label': wd.name } }">
					<div
						role="columnheader"
						:aria-label="wd.name"
						style="text-align: center; padding: 4px 0;">
						{{ wd.short }}
					</div>
				</slot>
			</template>
		</div>
		<template v-for="(week, wi) in weeks" :key="wi">
			<div role="row" :style="rowStyle">
				<template v-for="(d, di) in week" :key="di">
					<slot name="day" :day="makeDay(d)">
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
	</div>
</template>
