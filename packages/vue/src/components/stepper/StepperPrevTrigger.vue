<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useStepperContext } from './keys';

defineOptions({ name: 'StepperPrevTrigger', inheritAttrs: false })

const props = withDefaults(defineProps<{
	disabled?: boolean;
}>(), {
	disabled: undefined,
});

const ctx = useStepperContext();
const attrs = useAttrs();

const isDisabled = computed(() => props.disabled ?? ctx.current === 0);

function handleClick(e: MouseEvent) {
	ctx.prev();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		:disabled="isDisabled"
		v-bind="attrs"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
