<script setup lang="ts">
import { useSheetContext } from './keys';

defineOptions({ name: 'SheetHandle' })

const ctx = useSheetContext()

function onPointerDown(e: PointerEvent) {
	;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
	ctx.startDrag(e.clientX, e.clientY)
}

function onPointerMove(e: PointerEvent) {
	ctx.moveDrag(e.clientX, e.clientY)
}

function onPointerUp(e: PointerEvent) {
	;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
	ctx.endDrag()
}

function onPointerCancel() {
	ctx.endDrag()
}
</script>

<template>
	<div
		role="button"
		aria-label="Drag to resize"
		data-sheet-handle=""
		:style="{ touchAction: 'none' }"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerCancel"
	>
		<slot />
	</div>
</template>
