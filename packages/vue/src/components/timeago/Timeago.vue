<script lang="ts">
import type { TimeagoPlural } from './Timeago.types'

const MS_PER_MINUTE = 1000 * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24
const REFRESH_MS = 60000

const defaultPluralize = (n: number): TimeagoPlural => (n === 1 ? 'one' : 'other')

function toDate(timestamp: string | Date | number): Date {
	return new Date(timestamp)
}

function difference(datetime: Date): number {
	return Math.floor(new Date().getTime() - datetime.getTime())
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useInterval } from '@/composables/use-interval'
import { useWireUILocale, useWireUIMessages } from '@/context/wire-ui-context'
import { formatRelativeTime, getDayNames, getMonthNames } from '@/utils/i18n/formatters'
import type { TimeagoFormatConfig } from './Timeago.types'

defineOptions({ name: 'Timeago' })

const props = withDefaults(
	defineProps<{
		datetime: string | Date | number
		isLive?: boolean
		isDuration?: boolean
		timeOnly?: boolean
		/**
		 * BCP 47 locale for the default Intl-driven output. Falls back to the
		 * nearest `WireUIProvider`, then `en-US`. Ignored when `format` is set.
		 */
		locale?: string
		/**
		 * Legacy template overrides. When provided, the `#time`/`#num` templates
		 * and `pluralize` drive the output instead of the locale's Intl formatting.
		 */
		format?: TimeagoFormatConfig
		pluralize?: (n: number) => TimeagoPlural
	}>(),
	{
		isLive: false,
		isDuration: false,
		timeOnly: false,
		pluralize: defaultPluralize,
	},
)

const locale = useWireUILocale(() => props.locale)
const messages = useWireUIMessages()

function getTimeOnly(): string {
	const parsetime = toDate(props.datetime)
	const hours = parsetime.getHours()
	const minutes = parsetime.getMinutes()
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function getDuration(): string {
	const parsetime = toDate(props.datetime)
	const mSeconds = difference(parsetime)
	const fmt = props.format

	// Legacy path: an explicit `format` override drives the #time/#num templates
	// and the caller-supplied pluralization.
	if (fmt) {
		const plur = props.pluralize
		if (mSeconds < MS_PER_MINUTE) return fmt.just
		let timeValue: string
		if (mSeconds < MS_PER_HOUR) {
			const time = Math.round(mSeconds / MS_PER_MINUTE)
			timeValue = fmt.minute[plur(time)].replace('#num', time.toString())
		} else {
			const time = Math.round(mSeconds / MS_PER_HOUR)
			timeValue = fmt.hour[plur(time)].replace('#num', time.toString())
		}
		return fmt.past.replace('#time', timeValue)
	}

	// Default path: delegate to Intl.RelativeTimeFormat for the active locale.
	if (mSeconds < MS_PER_MINUTE) return messages.value.timeago.justNow
	if (mSeconds < MS_PER_HOUR) {
		return formatRelativeTime(-Math.round(mSeconds / MS_PER_MINUTE), 'minute', locale.value)
	}
	return formatRelativeTime(-Math.round(mSeconds / MS_PER_HOUR), 'hour', locale.value)
}

function getDateTime(): string {
	const inputDate = toDate(props.datetime)
	const today = new Date()
	const time = getTimeOnly()
	const fmt = props.format

	const inputDateCopy = new Date(inputDate)
	const todayCopy = new Date(today)
	inputDateCopy.setHours(0, 0, 0, 0)
	todayCopy.setHours(0, 0, 0, 0)

	if (inputDateCopy.getTime() === todayCopy.getTime()) {
		return fmt ? fmt.today.replace('#time', time) : messages.value.timeago.today(time)
	}

	// Day/month names come from the `format` override when present, else from
	// Intl for the active locale.
	const dayNames = fmt ? fmt.days : getDayNames(locale.value)
	const monthNames = fmt ? fmt.months : getMonthNames(locale.value)

	const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / MS_PER_DAY)
	const day = dayNames[inputDate.getDay()]

	if (diffDays < 7) return `${day}, ${time}`

	const date = inputDate.getDate()
	const month = monthNames[inputDate.getMonth()]
	const year = inputDate.getFullYear()

	if (year === today.getFullYear()) return `${month} ${date}, ${time}`
	return `${month} ${date} ${year}, ${time}`
}

function computeDisplay(): string {
	if (props.isDuration) return getDuration()
	if (props.timeOnly) return getTimeOnly()
	return getDateTime()
}

const tick = ref(0)
const { start, stop } = useInterval(
	() => { tick.value++ },
	REFRESH_MS,
	{ autoStart: props.isLive },
)
watch(() => props.isLive, (live) => (live ? start() : stop()))
</script>

<template>
	<time :data-tick="tick" style="display: contents">{{ computeDisplay() }}</time>
</template>
