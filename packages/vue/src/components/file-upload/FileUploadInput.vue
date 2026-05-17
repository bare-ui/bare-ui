<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useFileUploadContext } from './keys'

defineOptions({ name: 'FileUploadInput', inheritAttrs: false })

const ctx = useFileUploadContext()
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

onMounted(() => {
	ctx.registerInput(inputRef.value)
})

onUnmounted(() => {
	ctx.registerInput(null)
})

function onChange(e: Event) {
	const target = e.target as HTMLInputElement
	const list = target.files
	if (list && list.length > 0) ctx.addFiles(Array.from(list))
	target.value = ''
}

const hiddenStyle = {
	position: 'absolute' as const,
	width: '1px',
	height: '1px',
	opacity: 0,
	overflow: 'hidden',
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	whiteSpace: 'nowrap' as const,
}
</script>

<template>
	<input
		ref="inputRef"
		type="file"
		:multiple="ctx.multiple.value"
		:accept="ctx.accept.value"
		:disabled="ctx.disabled.value"
		tabindex="-1"
		aria-hidden="true"
		:style="hiddenStyle"
		v-bind="$attrs"
		@change="onChange" />
</template>
