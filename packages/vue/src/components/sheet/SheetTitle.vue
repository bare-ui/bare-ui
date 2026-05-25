<script setup lang="ts">
import { useSheetContext } from './keys';

defineOptions({ name: 'SheetTitle' })

const ctx = useSheetContext()
</script>

<template>
	<h2 :id="ctx.titleId">
		<slot />
	</h2>
</template>
