<script setup lang="ts">
import { computed } from 'vue'
import type { IconName, IconSize } from './Icon.types'

defineOptions({ name: 'Icon' })

const props = defineProps<{
	type: IconName
	size?: IconSize
	label?: string
	icons?: Partial<Record<IconName, string>>
}>()

function parseSvg(raw: string): { viewBox: string; content: string } {
	const viewBoxMatch = raw.match(/viewBox="([^"]+)"/i)
	const viewBox = viewBoxMatch?.[1] ?? '0 0 24 24'
	const content = raw.replace(/^[\s\S]*?<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '')
	return { viewBox, content }
}

const rawSvg = computed(() => props.icons?.[props.type])
const parsed = computed(() => (rawSvg.value ? parseSvg(rawSvg.value) : null))
const isDecorative = computed(() => !props.label)
</script>

<template>
	<svg
		v-if="parsed"
		:viewBox="parsed.viewBox"
		:aria-label="label"
		:aria-hidden="isDecorative ? 'true' : undefined"
		role="img"
		focusable="false"
		:data-name="type"
		:data-size="size"
		v-html="parsed.content"
	/>
</template>
