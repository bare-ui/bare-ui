<script setup lang="ts">
import { computed } from 'vue'
import { useMentionContext } from './keys'

defineOptions({ name: 'MentionContent' })

const ctx = useMentionContext()

const style = computed(() => ({
	position: 'absolute' as const,
	top: `${ctx.coords.value.top}px`,
	left: `${ctx.coords.value.left}px`,
}))
</script>

<template>
	<div
		v-if="ctx.open.value"
		:id="ctx.listboxId"
		role="listbox"
		data-state="open"
		:style="style">
		<slot />
	</div>
</template>
