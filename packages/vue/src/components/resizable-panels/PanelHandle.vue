<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useId } from '@/composables/use-id'
import { useWireUIMessages } from '@/context/wire-ui-context'
import { usePanelGroupContext } from './keys'

defineOptions({ name: 'PanelHandle', inheritAttrs: false })

const messages = useWireUIMessages()

const props = withDefaults(
	defineProps<{
		disabled?: boolean
		'aria-label'?: string
	}>(),
	{
		disabled: false,
	},
)

const ctx = usePanelGroupContext()
const id = useId('handle')

onMounted(() => ctx.registerHandle(id))
onUnmounted(() => ctx.unregisterHandle(id))

function onPointerDown(e: PointerEvent) {
	if (props.disabled) return
	const target = e.currentTarget as HTMLElement | null
	target?.setPointerCapture?.(e.pointerId)
	ctx.startDrag(id, { x: e.clientX, y: e.clientY })
}

const cursor = computed(() =>
	props.disabled ? 'default' : ctx.orientation.value === 'horizontal' ? 'col-resize' : 'row-resize',
)

const handleStyle = computed(() => ({
	cursor: cursor.value,
	touchAction: 'none' as const,
	flexShrink: 0,
}))
</script>

<template>
	<div
		role="separator"
		:aria-orientation="ctx.orientation.value === 'horizontal' ? 'vertical' : 'horizontal'"
		:aria-label="$props['aria-label'] ?? messages.resizablePanels.handle"
		:tabindex="props.disabled ? -1 : 0"
		data-handle=""
		:data-orientation="ctx.orientation.value"
		:data-disabled="props.disabled ? '' : undefined"
		:style="handleStyle"
		v-bind="$attrs"
		@pointerdown="onPointerDown" />
</template>
