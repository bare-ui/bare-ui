<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useFocusTrap } from '@/composables/use-focus-trap';
import { useSheetContext } from './keys';

defineOptions({ name: 'SheetContent' })

const ctx = useSheetContext()
const contentRef = useTemplateRef<HTMLDivElement>('contentRef')

useFocusTrap(contentRef, { active: computed(() => ctx.open && ctx.modal) })

function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max)
}

function transformFor(offset: number): string {
	return ctx.side === 'top' ? `translateY(${-offset}px)` : `translateY(${offset}px)`
}

const contentStyle = computed(() => {
	const rawOffset =
		ctx.dragOffset !== null
			? ctx.dragOffset
			: ctx.open
				? (ctx.snapOffsets[clamp(ctx.activeSnap, 0, ctx.snapOffsets.length - 1)] ?? 0)
				: ctx.closedOffset

	// Avoid sub-pixel floating-point noise
	const offset = Math.round(rawOffset * 100) / 100

	const anchor =
		ctx.side === 'top'
			? { left: '0', right: '0', top: '0', height: `${ctx.maxSize}px` }
			: { left: '0', right: '0', bottom: '0', height: `${ctx.maxSize}px` }

	return {
		position: 'fixed' as const,
		...anchor,
		transform: transformFor(offset),
	}
})
</script>

<template>
	<div
		ref="contentRef"
		role="dialog"
		:aria-modal="ctx.modal || undefined"
		:aria-labelledby="ctx.titleId"
		:aria-describedby="ctx.descriptionId"
		:tabindex="-1"
		:data-state="ctx.open ? 'open' : 'closed'"
		:data-side="ctx.side"
		:data-dragging="ctx.dragOffset !== null ? '' : undefined"
		:style="contentStyle"
		@click.stop
	>
		<slot />
	</div>
</template>
