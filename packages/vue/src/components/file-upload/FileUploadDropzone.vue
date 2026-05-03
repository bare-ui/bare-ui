<script setup lang="ts">
import { useFileUploadContext } from './keys'

defineOptions({ name: 'FileUploadDropzone', inheritAttrs: false })

const ctx = useFileUploadContext()

function onClick() {
	if (!ctx.disabled.value) ctx.openPicker()
}

function onKeyDown(e: KeyboardEvent) {
	if (!ctx.disabled.value && (e.key === 'Enter' || e.key === ' ')) {
		e.preventDefault()
		ctx.openPicker()
	}
}

function onDragEnter(e: DragEvent) {
	e.preventDefault()
	if (!ctx.disabled.value) ctx.setDragging(true)
}

function onDragOver(e: DragEvent) {
	e.preventDefault()
	if (!ctx.disabled.value) ctx.setDragging(true)
}

function onDragLeave(e: DragEvent) {
	e.preventDefault()
	const current = e.currentTarget as HTMLElement | null
	const related = e.relatedTarget as Node | null
	if (current && related && current.contains(related)) return
	ctx.setDragging(false)
}

function onDrop(e: DragEvent) {
	e.preventDefault()
	ctx.setDragging(false)
	if (ctx.disabled.value) return
	if (!e.dataTransfer) return
	const dropped = Array.from(e.dataTransfer.files)
	if (dropped.length > 0) ctx.addFiles(dropped)
}
</script>

<template>
	<div
		role="button"
		:tabindex="ctx.disabled.value ? -1 : 0"
		:aria-disabled="ctx.disabled.value || undefined"
		:data-dragging="ctx.isDragging.value ? '' : undefined"
		:data-disabled="ctx.disabled.value ? '' : undefined"
		v-bind="$attrs"
		@click="onClick"
		@keydown="onKeyDown"
		@dragenter="onDragEnter"
		@dragover="onDragOver"
		@dragleave="onDragLeave"
		@drop="onDrop">
		<slot />
	</div>
</template>
