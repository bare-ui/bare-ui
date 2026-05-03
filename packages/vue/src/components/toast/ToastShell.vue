<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import type { ToastData } from './Toast.types'

defineOptions({ name: 'ToastShell' })

const props = defineProps<{
	toast: ToastData
	duration: number
	onDismiss: () => void
}>()

let timer: ReturnType<typeof setTimeout> | null = null
let remaining = props.duration
let startedAt = Date.now()

function clearTimer() {
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
}

function startTimer() {
	clearTimer()
	if (remaining <= 0) return
	startedAt = Date.now()
	timer = setTimeout(() => {
		props.onDismiss()
	}, remaining)
}

watch(
	() => [props.duration, props.toast.id] as const,
	() => {
		if (props.duration > 0) {
			remaining = props.duration
			startTimer()
		}
	},
	{ immediate: true },
)

onUnmounted(clearTimer)

function pauseOnHover() {
	return props.toast.pauseOnHover !== false
}

function handleEnter() {
	if (!pauseOnHover()) return
	clearTimer()
	remaining = remaining - (Date.now() - startedAt)
}

function handleLeave() {
	if (!pauseOnHover()) return
	startTimer()
}
</script>

<template>
	<div
		role="status"
		aria-live="polite"
		:data-status="toast.status ?? 'default'"
		@pointerenter="handleEnter"
		@pointerleave="handleLeave"
		@focus="handleEnter"
		@blur="handleLeave">
		<slot />
	</div>
</template>
