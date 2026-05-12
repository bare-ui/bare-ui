<script setup lang="ts">
import { useContextMenuContext } from './keys'

defineOptions({ name: 'ContextMenuTrigger' })

const ctx = useContextMenuContext()

function onContextMenu(e: MouseEvent) {
	if (!ctx.disabled.value) {
		e.preventDefault()
		ctx.openAt(e.clientX, e.clientY)
	}
}
</script>

<template>
	<div
		:data-state="ctx.open.value ? 'open' : 'closed'"
		@contextmenu="onContextMenu">
		<slot />
	</div>
</template>
