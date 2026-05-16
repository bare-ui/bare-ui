<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useId } from '@/composables/use-id'
import { usePanelGroupContext } from './keys'

defineOptions({ name: 'Panel' })

const props = defineProps<{
	defaultSize?: number
	minSize?: number
	maxSize?: number
}>()

const ctx = usePanelGroupContext()
const id = useId('panel')

const config = computed(() => ({
	defaultSize: props.defaultSize,
	minSize: props.minSize,
	maxSize: props.maxSize,
}))

onMounted(() => ctx.registerPanel(id, config.value))
onUnmounted(() => ctx.unregisterPanel(id))

watch(config, (c) => ctx.updatePanel(id, c))

const effectiveSize = computed(() => {
	const idx = ctx.getPanelIndex(id)
	if (idx >= 0) return ctx.getPanelSize(id)
	return props.defaultSize ?? 0
})

const sizeStyle = computed(() =>
	ctx.orientation.value === 'horizontal'
		? {
				flexBasis: `${effectiveSize.value}%`,
				flexGrow: 0,
				flexShrink: 0,
				minWidth: 0,
				overflow: 'auto' as const,
			}
		: {
				flexBasis: `${effectiveSize.value}%`,
				flexGrow: 0,
				flexShrink: 0,
				minHeight: 0,
				overflow: 'auto' as const,
			},
)
</script>

<template>
	<div
		data-panel=""
		:data-orientation="ctx.orientation.value"
		:style="sizeStyle">
		<slot />
	</div>
</template>
