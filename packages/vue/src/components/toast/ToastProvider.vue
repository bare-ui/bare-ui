<script setup lang="ts">
import { provide, ref, toRef } from 'vue'
import { ToastKey, makeId } from './keys'
import type { ToastData } from './Toast.types'

defineOptions({ name: 'ToastProvider' })

const props = withDefaults(
	defineProps<{
		defaultDuration?: number
	}>(),
	{
		defaultDuration: 5000,
	},
)

const toasts = ref<ToastData[]>([])

function dismiss(id: string) {
	toasts.value = toasts.value.filter((t) => t.id !== id)
}

function add(input: Omit<ToastData, 'id'> & { id?: string }) {
	const id = input.id ?? makeId()
	toasts.value = [...toasts.value.filter((t) => t.id !== id), { ...input, id }]
	return id
}

provide(ToastKey, {
	toasts,
	add,
	dismiss,
	defaultDuration: toRef(props, 'defaultDuration'),
})
</script>

<template>
	<slot />
</template>
