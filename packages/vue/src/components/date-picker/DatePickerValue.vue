<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useDatePickerContext } from './keys'

defineOptions({ name: 'DatePickerValue' })

const props = defineProps<{
	placeholder?: string
}>()

const ctx = useDatePickerContext()
const slots = useSlots()

const formatted = computed(() => {
	if (!ctx.value.value) return ''
	return new Intl.DateTimeFormat(ctx.locale.value, ctx.formatOptions.value).format(ctx.value.value)
})
</script>

<template>
	<span :data-placeholder="!ctx.value.value ? '' : undefined">
		<template v-if="slots.default">
			<slot
				:date="ctx.value.value"
				:formatted="formatted" />
		</template>
		<template v-else-if="ctx.value.value">{{ formatted }}</template>
		<template v-else>{{ props.placeholder }}</template>
	</span>
</template>
