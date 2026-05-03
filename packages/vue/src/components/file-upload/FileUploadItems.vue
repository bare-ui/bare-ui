<script setup lang="ts">
import { useFileUploadContext } from './keys'

defineOptions({ name: 'FileUploadItems' })

defineSlots<{
	default(props: { file: File; index: number; remove: () => void }): unknown
}>()

const ctx = useFileUploadContext()
</script>

<template>
	<template
		v-for="(file, index) in ctx.files.value"
		:key="index">
		<slot
			:file="file"
			:index="index"
			:remove="() => ctx.removeFile(index)" />
	</template>
</template>
