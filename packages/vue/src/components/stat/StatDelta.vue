<script setup lang="ts">
import { computed } from 'vue';
import type { StatDirection } from './Stat.types';

defineOptions({ name: 'StatDelta' })

const props = withDefaults(defineProps<{
	value?: number;
	direction?: StatDirection;
}>(), {
	value: undefined,
	direction: undefined,
});

defineSlots<{ default?(): unknown }>();

function resolveDirection(value: number | undefined, direction: StatDirection | undefined): StatDirection {
	if (direction) return direction;
	if (value === undefined) return 'neutral';
	if (value > 0) return 'increase';
	if (value < 0) return 'decrease';
	return 'neutral';
}

const resolved = computed(() => resolveDirection(props.value, props.direction));
</script>

<template>
	<span :data-direction="resolved">
		<slot>{{ value !== undefined ? value : null }}</slot>
	</span>
</template>
