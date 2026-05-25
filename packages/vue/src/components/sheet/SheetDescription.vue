<script setup lang="ts">
import { useSheetContext } from './keys';

defineOptions({ name: 'SheetDescription' })

const ctx = useSheetContext()
</script>

<template>
	<p :id="ctx.descriptionId">
		<slot />
	</p>
</template>
