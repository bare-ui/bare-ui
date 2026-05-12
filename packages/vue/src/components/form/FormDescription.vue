<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useFormFieldContext } from './keys'

defineOptions({ name: 'FormDescription' })

const ctx = useFormFieldContext()

onMounted(() => ctx.registerDescription(true))
onUnmounted(() => ctx.registerDescription(false))
</script>

<template>
	<div :id="ctx.descriptionId">
		<slot />
	</div>
</template>
