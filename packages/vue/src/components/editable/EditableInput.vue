<script setup lang="ts">
import { ref, watch, nextTick, useAttrs } from 'vue';
import { useEditableContext } from './keys';

defineOptions({ name: 'EditableInput', inheritAttrs: false });

const attrs = useAttrs();
const ctx = useEditableContext();

const inputRef = ref<HTMLInputElement | null>(null);

// Auto-focus and select when entering edit mode
watch(
	() => ctx.isEditing,
	(editing) => {
		if (editing) {
			nextTick(() => {
				inputRef.value?.focus();
				inputRef.value?.select();
			});
		}
	},
);

function handleChange(e: Event) {
	ctx.setDraft((e.target as HTMLInputElement).value);
}

function handleKeyDown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (e.defaultPrevented) return;
	if (e.key === 'Escape') {
		e.preventDefault();
		ctx.cancel();
	} else if (e.key === 'Enter') {
		e.preventDefault();
		ctx.submit();
	}
}

function handleBlur(e: FocusEvent) {
	if (ctx.submitOnBlur) ctx.submit();
	(attrs.onBlur as ((e: FocusEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<input
		v-if="ctx.isEditing"
		ref="inputRef"
		v-bind="attrs"
		type="text"
		:value="ctx.draft"
		:disabled="ctx.disabled"
		:placeholder="ctx.placeholder"
		@change="handleChange"
		@input="handleChange"
		@keydown="handleKeyDown"
		@blur="handleBlur"
	/>
</template>
