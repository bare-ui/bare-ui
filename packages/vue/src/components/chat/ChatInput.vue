<script setup lang="ts">
import { ref, watch, nextTick, useAttrs } from 'vue';
import { useChatContext } from './keys';

defineOptions({ name: 'ChatInput', inheritAttrs: false })

const props = withDefaults(defineProps<{
	submitOnEnter?: boolean;
	autoResize?: boolean;
}>(), {
	submitOnEnter: true,
	autoResize: true,
});

const ctx = useChatContext();
const attrs = useAttrs();
const textareaEl = ref<HTMLTextAreaElement | null>(null);

// Auto-resize the textarea whenever the value changes
watch(
	() => ctx.value,
	async () => {
		if (!props.autoResize) return;
		await nextTick();
		const el = textareaEl.value;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	},
	{ immediate: true },
);

function handleInput(e: Event) {
	const target = e.target as HTMLTextAreaElement;
	ctx.setValue(target.value);
	(attrs.onChange as ((e: Event) => void) | undefined)?.(e);
}

function handleKeydown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (e.defaultPrevented) return;
	if (
		props.submitOnEnter &&
		e.key === 'Enter' &&
		!e.shiftKey &&
		!(e as KeyboardEvent & { isComposing?: boolean }).isComposing
	) {
		e.preventDefault();
		ctx.submit();
	}
}
</script>

<template>
	<textarea
		ref="textareaEl"
		v-bind="attrs"
		:value="ctx.value"
		:disabled="ctx.disabled"
		:aria-disabled="ctx.disabled || undefined"
		@input="handleInput"
		@keydown="handleKeydown"
	/>
</template>
