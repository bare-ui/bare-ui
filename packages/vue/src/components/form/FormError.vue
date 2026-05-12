<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useFormFieldContext } from './keys'

defineOptions({ name: 'FormError' })

const props = withDefaults(
	defineProps<{
		forceMount?: boolean
	}>(),
	{
		forceMount: false,
	},
)

const ctx = useFormFieldContext()
const visible = computed(() => props.forceMount || ctx.invalid.value)

watch(
	visible,
	(v) => ctx.registerError(v),
	{ immediate: true },
)

onMounted(() => ctx.registerError(visible.value))
onUnmounted(() => ctx.registerError(false))
</script>

<template>
	<div
		v-if="visible"
		:id="ctx.errorId"
		role="alert">
		<slot />
	</div>
</template>
