<script setup lang="ts">
import { computed, onMounted, onUnmounted, useAttrs } from 'vue'
import { useId } from '@/composables/use-id'
import { useWireUIMessages } from '@/context/wire-ui-context'
import { usePanelGroupContext } from './keys'

defineOptions({ name: 'PanelHandle', inheritAttrs: false })

const messages = useWireUIMessages()

const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)

// `aria-label` arrives as a fall-through attribute (kebab attribute names don't
// bind to a declared prop). An explicit value wins; otherwise the localized
// default. The name is applied to the separator explicitly, so exclude it from
// the attrs spread to avoid a duplicate binding overriding our value.
const attrs = useAttrs()
const ariaLabel = computed(
	() => (attrs['aria-label'] as string | undefined) ?? messages.value.resizablePanels.handle,
)
const handleAttrs = computed(() => {
	const { ['aria-label']: _ariaLabel, ...rest } = attrs
	void _ariaLabel
	return rest
})

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

// A focusable role="separator" is a window splitter and REQUIRES aria-valuenow.
const values = computed(() => ctx.getHandleValues(id))

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
		:aria-label="ariaLabel"
		:aria-valuenow="values?.now"
		:aria-valuemin="values?.min"
		:aria-valuemax="values?.max"
		:tabindex="props.disabled ? -1 : 0"
		data-handle=""
		:data-orientation="ctx.orientation.value"
		:data-disabled="props.disabled ? '' : undefined"
		:style="handleStyle"
		v-bind="handleAttrs"
		@pointerdown="onPointerDown" />
</template>
