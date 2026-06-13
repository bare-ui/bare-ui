<script setup lang="ts">
import { useToastContext } from './keys'
import ToastShell from './ToastShell.vue'
import { useWireUIMessages } from '@/context/wire-ui-context'
import type { ToastData } from './Toast.types'

defineOptions({ name: 'ToastViewport' })

const messages = useWireUIMessages()

defineSlots<{
	default(props: { toast: ToastData; dismiss: () => void }): unknown
}>()

const ctx = useToastContext()
</script>

<template>
	<div
		role="region"
		:aria-label="messages.toast.region">
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
