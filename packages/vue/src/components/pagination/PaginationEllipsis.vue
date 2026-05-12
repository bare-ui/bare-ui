<script setup lang="ts">
import { useSlots } from 'vue'

defineOptions({ name: 'PaginationEllipsis' })

const slots = useSlots()
</script>

<template>
	<li
		role="presentation"
		aria-hidden="true">
		<slot v-if="slots.default" />
		<template v-else>…</template>
	</li>
</template>
