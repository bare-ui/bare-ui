<script setup lang="ts">
import { useCommandContext } from './keys';

defineOptions({ name: 'CommandList' });

const ctx = useCommandContext();
</script>

<template>
	<div
		:id="ctx.listboxId"
		role="listbox"
	>
		<slot />
	</div>
</template>
