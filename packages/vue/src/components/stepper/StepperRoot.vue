<script setup lang="ts">
import { provide, reactive, computed } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { StepperKey } from './keys';
import type { StepperOrientation } from './Stepper.types';

defineOptions({ name: 'StepperRoot' })

const props = withDefaults(defineProps<{
	count: number;
	value?: number;
	defaultValue?: number;
	onChange?: (index: number) => void;
	orientation?: StepperOrientation;
	linear?: boolean;
}>(), {
	value: undefined,
	defaultValue: 0,
	onChange: undefined,
	orientation: 'horizontal',
	linear: false,
});

const current = useControllableState<number>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? 0,
	onChange: props.onChange,
});

function goTo(index: number) {
	const clamped = Math.min(Math.max(index, 0), props.count - 1);
	if (props.linear && clamped > current.value) return;
	current.value = clamped;
}

function next() {
	current.value = Math.min(current.value + 1, props.count - 1);
}

function prev() {
	current.value = Math.max(current.value - 1, 0);
}

provide(StepperKey, reactive({
	current: computed(() => current.value),
	count: computed(() => props.count),
	orientation: computed(() => props.orientation),
	linear: computed(() => props.linear),
	goTo,
	next,
	prev,
	isActive: (i: number) => i === current.value,
	isCompleted: (i: number) => i < current.value,
}));
</script>

<template>
	<div :data-orientation="orientation">
		<slot />
	</div>
</template>
