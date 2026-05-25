<script setup lang="ts">
import { useAttrs } from 'vue';
import { useHoverCardContext } from './keys';

defineOptions({ name: 'HoverCardTrigger', inheritAttrs: false });

const ctx = useHoverCardContext();
const attrs = useAttrs();

function handleMouseEnter(e: MouseEvent) {
	ctx.scheduleOpen();
	(attrs.onMouseenter as ((e: MouseEvent) => void) | undefined)?.(e);
}

function handleMouseLeave(e: MouseEvent) {
	ctx.scheduleClose();
	(attrs.onMouseleave as ((e: MouseEvent) => void) | undefined)?.(e);
}

function handleFocus(e: FocusEvent) {
	ctx.openNow();
	(attrs.onFocus as ((e: FocusEvent) => void) | undefined)?.(e);
}

function handleBlur(e: FocusEvent) {
	ctx.closeNow();
	(attrs.onBlur as ((e: FocusEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<span
		:data-state="ctx.open ? 'open' : 'closed'"
		v-bind="attrs"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
		@focus="handleFocus"
		@blur="handleBlur"
	>
		<slot />
	</span>
</template>
