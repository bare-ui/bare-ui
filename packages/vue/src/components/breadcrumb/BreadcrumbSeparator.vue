<script setup lang="ts">
import { useSlots } from 'vue'

defineOptions({ name: 'BreadcrumbSeparator' })

const slots = useSlots()
</script>

<template>
	<span
		role="presentation"
		aria-hidden="true">
		<slot v-if="slots.default" />
		<template v-else>/</template>
	</span>
</template>
