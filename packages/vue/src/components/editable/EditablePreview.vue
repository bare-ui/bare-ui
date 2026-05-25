<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useEditableContext } from './keys';

defineOptions({ name: 'EditablePreview', inheritAttrs: false });

const attrs = useAttrs();
const ctx = useEditableContext();

const isEmpty = computed(() => ctx.value.length === 0);

function handleClick(e: MouseEvent) {
	ctx.startEdit();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}

function handleKeyDown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (e.defaultPrevented) return;
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		ctx.startEdit();
	}
}
</script>

<template>
	<span
		v-if="!ctx.isEditing"
		v-bind="attrs"
		role="button"
		:tabindex="ctx.disabled ? -1 : 0"
		:aria-disabled="ctx.disabled || undefined"
		:data-empty="isEmpty ? '' : undefined"
		@click="handleClick"
		@keydown="handleKeyDown"
	>
		<slot>{{ isEmpty ? ctx.placeholder : ctx.value }}</slot>
	</span>
</template>
