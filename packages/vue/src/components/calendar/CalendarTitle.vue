<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useCalendarContext } from './keys'

defineOptions({ name: 'CalendarTitle' })

const ctx = useCalendarContext()
const slots = useSlots()

const label = computed(() =>
	new Intl.DateTimeFormat(ctx.locale.value, { month: 'long', year: 'numeric' }).format(ctx.month.value),
)
</script>

<template>
	<div aria-live="polite">
		<slot v-if="slots.default" />
		<template v-else>{{ label }}</template>
	</div>
</template>
