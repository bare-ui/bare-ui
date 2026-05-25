<script setup lang="ts">
import { provide, reactive, computed } from 'vue';
import { useStepperContext, StepperItemKey } from './keys';

defineOptions({ name: 'StepperItem' })

const props = defineProps<{
	index: number;
}>();

const ctx = useStepperContext();

function stepState(index: number, current: number): 'active' | 'completed' | 'inactive' {
	if (index === current) return 'active';
	if (index < current) return 'completed';
	return 'inactive';
}

const state = computed(() => stepState(props.index, ctx.current));

provide(StepperItemKey, reactive({
	index: computed(() => props.index),
}));
</script>

<template>
	<div
		role="listitem"
		:data-state="state"
		:data-index="index"
	>
		<slot />
	</div>
</template>
