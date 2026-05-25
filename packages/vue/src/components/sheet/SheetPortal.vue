<script setup lang="ts">
import { useSheetContext } from './keys';

defineOptions({ name: 'SheetPortal' })

defineProps<{ container?: string | HTMLElement }>()

const ctx = useSheetContext()
</script>

<template>
	<Teleport v-if="ctx.open" :to="container || 'body'">
		<slot />
	</Teleport>
</template>
