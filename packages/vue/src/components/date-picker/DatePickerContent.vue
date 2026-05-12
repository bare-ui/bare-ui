<script setup lang="ts">
import { useDatePickerContext } from './keys'

defineOptions({ name: 'DatePickerContent' })

const ctx = useDatePickerContext()
</script>

<template>
	<div
		v-if="ctx.open.value"
		:id="ctx.contentId"
		role="dialog"
		:aria-labelledby="ctx.triggerId"
		data-state="open">
		<slot />
	</div>
</template>
