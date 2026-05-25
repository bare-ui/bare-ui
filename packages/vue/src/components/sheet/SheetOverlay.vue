<script setup lang="ts">
import { useSheetContext } from './keys';

defineOptions({ name: 'SheetOverlay' })

const ctx = useSheetContext()
</script>

<template>
	<div
		:data-state="ctx.open ? 'open' : 'closed'"
		@click="ctx.dismissible && ctx.setOpen(false)"
	>
		<slot />
	</div>
</template>
