<script setup lang="ts">
import { provide } from 'vue'
import { NavigationMenuItemKey } from './keys'

defineOptions({ name: 'NavigationMenuItem' })

const props = defineProps<{
	value?: string
}>()

if (props.value) {
	provide(NavigationMenuItemKey, { value: props.value })
}
</script>

<template>
	<li>
		<slot />
	</li>
</template>
