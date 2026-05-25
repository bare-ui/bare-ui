<script setup lang="ts">
import { computed, inject } from 'vue';
import { useStepperContext, StepperItemKey } from './keys';

defineOptions({ name: 'StepperSeparator' })

const ctx = useStepperContext();
const itemCtx = inject(StepperItemKey);

// When inside an Item, the separator is "complete" once that step is done.
const separatorState = computed(() => {
	if (itemCtx === undefined) return undefined;
	return itemCtx.index < ctx.current ? 'completed' : 'inactive';
});
</script>

<template>
	<div
		role="separator"
		aria-hidden="true"
		:data-orientation="ctx.orientation"
		:data-state="separatorState"
	/>
</template>
