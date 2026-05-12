<script setup lang="ts">
import { computed } from 'vue'
import { useContextMenuContext } from './keys'

defineOptions({ name: 'ContextMenuContent', inheritAttrs: false })

const ctx = useContextMenuContext()

const contentStyle = computed(() => ({
	position: 'fixed' as const,
	left: `${ctx.position.value.x}px`,
	top: `${ctx.position.value.y}px`,
	zIndex: 50,
}))
</script>

<template>
	<Teleport to="body">
		<div
			v-if="ctx.open.value"
			role="menu"
			data-state="open"
			data-context-menu-content
			v-bind="$attrs"
			:style="contentStyle">
			<slot />
		</div>
	</Teleport>
</template>
