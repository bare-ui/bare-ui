<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'WireImage' })

const props = defineProps<{
	src: string
	alt?: string
	position?: string
	onImageLoaded?: () => void
}>()

const loaded = ref(false)

function handleLoad() {
	loaded.value = true
	props.onImageLoaded?.()
}

function handleError() {
	loaded.value = true
	props.onImageLoaded?.()
}
</script>

<template>
	<div :data-position="position">
		<div v-if="!loaded" data-part="loader" />
		<img
			:src="src"
			:alt="alt"
			:role="alt === '' ? 'presentation' : undefined"
			data-part="image"
			:data-loaded="loaded || undefined"
			:style="!loaded ? { display: 'none' } : undefined"
			@load="handleLoad"
			@error="handleError"
		/>
	</div>
</template>
