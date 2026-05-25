<script setup lang="ts">
import { useAttrs } from 'vue';
import { useEditableContext } from './keys';

defineOptions({ name: 'EditableSubmitTrigger', inheritAttrs: false });

const attrs = useAttrs();
const ctx = useEditableContext();

function handleMouseDown(e: MouseEvent) {
	// Prevent the blur-submit on the input from firing when clicking this button
	e.preventDefault();
	(attrs.onMousedown as ((e: MouseEvent) => void) | undefined)?.(e);
}

function handleClick(e: MouseEvent) {
	ctx.submit();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		v-if="ctx.isEditing"
		v-bind="attrs"
		type="button"
		@mousedown="handleMouseDown"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
