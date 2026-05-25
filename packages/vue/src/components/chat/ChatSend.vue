<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useChatContext } from './keys';

defineOptions({ name: 'ChatSend', inheritAttrs: false })

const props = withDefaults(defineProps<{
	disabled?: boolean;
}>(), {
	disabled: undefined,
});

const ctx = useChatContext();
const attrs = useAttrs();

const isDisabled = computed(() => {
	if (props.disabled !== undefined) return props.disabled;
	return ctx.disabled || ctx.isStreaming || (ctx.value ?? '').trim().length === 0;
});

function handleClick(e: MouseEvent) {
	ctx.submit();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		v-bind="attrs"
		type="button"
		:disabled="isDisabled"
		:data-streaming="ctx.isStreaming ? '' : undefined"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
