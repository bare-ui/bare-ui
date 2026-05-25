<script setup lang="ts">
import { useAttrs } from 'vue';
import { useEditableContext } from './keys';

defineOptions({ name: 'EditableEditTrigger', inheritAttrs: false });

const attrs = useAttrs();
const ctx = useEditableContext();

function handleClick(e: MouseEvent) {
	ctx.startEdit();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		v-if="!ctx.isEditing"
		v-bind="attrs"
		type="button"
		:disabled="ctx.disabled"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
