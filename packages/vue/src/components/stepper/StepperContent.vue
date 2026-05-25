<script setup lang="ts">
import { computed } from 'vue';
import { useStepperContext } from './keys';

defineOptions({ name: 'StepperContent' })

const props = withDefaults(defineProps<{
	index: number;
	forceMount?: boolean;
}>(), {
	forceMount: false,
});

const ctx = useStepperContext();

const active = computed(() => ctx.current === props.index);
const shouldRender = computed(() => props.forceMount || active.value);
</script>

<template>
	<div
		v-if="shouldRender"
		role="tabpanel"
		:hidden="forceMount && !active ? true : undefined"
		:data-state="active ? 'active' : 'inactive'"
		:data-index="index"
	>
		<slot />
	</div>
</template>
