<script setup lang="ts">
import { computed } from 'vue';
import { useInteractiveState } from '@/composables/use-interactive-state';

defineOptions({ name: 'Button', inheritAttrs: false })

const props = withDefaults(defineProps<{
	asChild?: boolean;
	disabled?: boolean;
	autoFocus?: boolean;
	type?: 'button' | 'submit' | 'reset';
}>(), {
	asChild: false,
	disabled: false,
	autoFocus: false,
	type: 'button',
});

const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled });

const autoFocusAttr = computed(() => props.autoFocus ? '' : undefined);
</script>

<template>
	<slot v-if="asChild" />
	<button
		v-else
		v-bind="{ ...$attrs, ...dataAttributes }"
		:type="type"
		:disabled="disabled"
		:autofocus="autoFocus"
		:data-autofocus="autoFocusAttr"
		@mouseenter="handlers.onMouseenter"
		@mouseleave="handlers.onMouseleave"
		@focus="handlers.onFocus"
		@blur="handlers.onBlur"
		@pointerdown="handlers.onPointerdown"
		@pointerup="handlers.onPointerup"
		@keydown="handlers.onKeydown"
		@keyup="handlers.onKeyup"
	>
		<slot />
	</button>
</template>
