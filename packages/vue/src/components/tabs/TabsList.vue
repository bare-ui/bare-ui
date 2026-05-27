<script setup lang="ts">
import { useTabsContext } from './keys';

defineOptions({ name: 'TabsList' })

const ctx = useTabsContext()
</script>

<template>
	<div
		role="tablist"
		:aria-orientation="ctx.orientation"
		:data-orientation="ctx.orientation"
	>
		<slot />
	</div>
</template>
