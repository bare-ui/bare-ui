<script setup lang="ts">
import { useToastContext } from './keys'
import ToastShell from './ToastShell.vue'
import type { ToastData } from './Toast.types'

defineOptions({ name: 'ToastViewport' })

defineSlots<{
	default(props: { toast: ToastData; dismiss: () => void }): unknown
}>()

const ctx = useToastContext()
</script>

<template>
	<div
		role="region"
		aria-label="Notifications">
		<ToastShell
			v-for="t in ctx.toasts.value"
			:key="t.id"
			:toast="t"
			:duration="t.duration ?? ctx.defaultDuration.value"
			:on-dismiss="() => ctx.dismiss(t.id)">
			<slot
				:toast="t"
				:dismiss="() => ctx.dismiss(t.id)" />
		</ToastShell>
	</div>
</template>
