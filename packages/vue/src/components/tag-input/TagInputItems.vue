<script setup lang="ts">
import { useTagInputContext } from './keys'

defineOptions({ name: 'TagInputItems' })

defineSlots<{
	default(props: { tag: string; index: number; remove: () => void }): unknown
}>()

const ctx = useTagInputContext()
</script>

<template>
	<template
		v-for="(tag, index) in ctx.tags.value"
		:key="`${tag}-${index}`">
		<slot
			:tag="tag"
			:index="index"
			:remove="() => ctx.removeTag(index)" />
	</template>
</template>
