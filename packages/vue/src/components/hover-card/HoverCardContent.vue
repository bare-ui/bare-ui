<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { HoverCardSide } from './HoverCard.types';
import { useHoverCardContext } from './keys';

defineOptions({ name: 'HoverCardContent', inheritAttrs: false });

const props = withDefaults(defineProps<{
	side?: HoverCardSide;
	sideOffset?: number;
	forceMount?: boolean;
}>(), {
	side: 'bottom',
	sideOffset: 8,
	forceMount: false,
});

const ctx = useHoverCardContext();
const attrs = useAttrs();

const shouldRender = computed(() => props.forceMount || ctx.open);

function positionFor(side: HoverCardSide, offset: number): Record<string, string | number> {
	switch (side) {
		case 'top':
			return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: `${offset}px` };
		case 'bottom':
			return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: `${offset}px` };
		case 'left':
			return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: `${offset}px` };
		case 'right':
			return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: `${offset}px` };
	}
}

const style = computed(() => ({
	position: 'absolute' as const,
	zIndex: 50,
	...positionFor(props.side, props.sideOffset),
}));

function handleMouseEnter(e: MouseEvent) {
	ctx.scheduleOpen();
	(attrs.onMouseenter as ((e: MouseEvent) => void) | undefined)?.(e);
}

function handleMouseLeave(e: MouseEvent) {
	ctx.scheduleClose();
	(attrs.onMouseleave as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<div
		v-if="shouldRender"
		role="dialog"
		:hidden="props.forceMount && !ctx.open ? true : undefined"
		:data-state="ctx.open ? 'open' : 'closed'"
		:data-side="side"
		:style="style"
		v-bind="attrs"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<slot />
	</div>
</template>
