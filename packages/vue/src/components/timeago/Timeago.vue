<script lang="ts">
import type { TimeagoFormatConfig, TimeagoPlural } from './Timeago.types'

const MS_PER_MINUTE = 1000 * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24
const REFRESH_MS = 60000

const defaultFormat: TimeagoFormatConfig = {
	just: 'Just Now',
	past: '#time ago',
	today: 'Today, #time',
	second: { one: '#num second', other: '#num seconds' },
	minute: { one: '#num minute', other: '#num minutes' },
	hour: { one: '#num hour', other: '#num hours' },
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	months: [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	],
}

const defaultPluralize = (n: number): TimeagoPlural => (n === 1 ? 'one' : 'other')

function toDate(timestamp: string | Date | number): Date {
	return new Date(timestamp)
}

function difference(datetime: Date): number {
	return Math.floor(new Date().getTime() - datetime.getTime())
}
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'Timeago' })

const props = withDefaults(
	defineProps<{
		datetime: string | Date | number
		isLive?: boolean
		isDuration?: boolean
		timeOnly?: boolean
		format?: TimeagoFormatConfig
		pluralize?: (n: number) => TimeagoPlural
	}>(),
	{
		isLive: false,
		isDuration: false,
		timeOnly: false,
		format: () => defaultFormat,
		pluralize: defaultPluralize,
	},
)

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
		return fmt.today.replace('#time', time)
	}

	const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / MS_PER_DAY)
	const day = fmt.days[inputDate.getDay()]

	if (diffDays < 7) return `${day}, ${time}`

	const date = inputDate.getDate()
	const month = fmt.months[inputDate.getMonth()]
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
let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
	if (props.isLive) {
		intervalId = setInterval(() => { tick.value++ }, REFRESH_MS)
	}
})

onUnmounted(() => {
	if (intervalId) clearInterval(intervalId)
})
</script>

<template>
	<time :data-tick="tick" style="display: contents">{{ computeDisplay() }}</time>
</template>
