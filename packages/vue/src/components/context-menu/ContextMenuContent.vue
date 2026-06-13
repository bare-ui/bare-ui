<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContextMenuContext } from './keys'
import { useMenuNavigation } from '@/composables/use-menu-navigation'
import { useIsMounted } from '@/composables/use-is-mounted'

defineOptions({ name: 'ContextMenuContent', inheritAttrs: false })

const ctx = useContextMenuContext()
// Teleport has no server-side target, so only mount it on the client. The server
// and first client render then agree (both render nothing) and hydration stays clean.
const mounted = useIsMounted()
const menuRef = ref<HTMLElement | null>(null)
const { onKeyDown } = useMenuNavigation(menuRef, {
	open: ctx.open,
	onClose: ctx.close,
})

const contentStyle = computed(() => ({
	position: 'fixed' as const,
	left: `${ctx.position.value.x}px`,
	top: `${ctx.position.value.y}px`,
	zIndex: 50,
}))
</script>

<template>
	<Teleport v-if="mounted" to="body">
		<div
			v-if="ctx.open.value"
			ref="menuRef"
			role="menu"
			data-state="open"
			data-context-menu-content
			v-bind="$attrs"
			:style="contentStyle"
			@keydown="onKeyDown">
			<slot />
		</div>
	</Teleport>
</template>
