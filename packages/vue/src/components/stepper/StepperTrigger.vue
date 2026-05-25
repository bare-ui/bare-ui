<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useStepperContext, useStepperItemContext } from './keys';

defineOptions({ name: 'StepperTrigger', inheritAttrs: false })

const props = withDefaults(defineProps<{
	disabled?: boolean;
}>(), {
	disabled: undefined,
});

const ctx = useStepperContext();
const itemCtx = useStepperItemContext();

const attrs = useAttrs();

function stepState(index: number, current: number): 'active' | 'completed' | 'inactive' {
	if (index === current) return 'active';
	if (index < current) return 'completed';
	return 'inactive';
}

const state = computed(() => stepState(itemCtx.index, ctx.current));
const isDisabled = computed(() => props.disabled ?? (ctx.linear && itemCtx.index > ctx.current));

function handleClick(e: MouseEvent) {
	ctx.goTo(itemCtx.index);
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		:disabled="isDisabled"
		:aria-current="state === 'active' ? 'step' : undefined"
		:data-state="state"
		v-bind="attrs"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
