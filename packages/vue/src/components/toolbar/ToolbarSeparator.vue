<script setup lang="ts">
import { computed } from 'vue';
import { useToolbarContext } from './keys';
import type { ToolbarOrientation } from './Toolbar.types';

defineOptions({ name: 'ToolbarSeparator' });

const props = defineProps<{
	orientation?: ToolbarOrientation;
}>();

const ctx = useToolbarContext();

// A separator's visual orientation is perpendicular to the toolbar's axis.
const separatorOrientation = computed<ToolbarOrientation>(() =>
	props.orientation ?? (ctx.orientation === 'horizontal' ? 'vertical' : 'horizontal'),
);
</script>

<template>
	<div
		role="separator"
		:aria-orientation="separatorOrientation"
		:data-orientation="separatorOrientation"
	/>
</template>
