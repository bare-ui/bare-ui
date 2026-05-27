<script setup lang="ts">
import { computed } from 'vue';
import type { PopoverAlign, PopoverSide } from './Popover.types';
import { usePopoverContext } from './keys';

defineOptions({ name: 'PopoverContent' })

const props = withDefaults(defineProps<{
	side?: PopoverSide;
	align?: PopoverAlign;
	forceMount?: boolean;
}>(), {
	side: 'bottom',
	align: 'center',
	forceMount: false,
})

const ctx = usePopoverContext()

const shouldRender = computed(() => ctx.open || props.forceMount)
</script>

<template>
	<div
		v-if="shouldRender"
		:id="ctx.contentId"
		role="dialog"
		:aria-labelledby="ctx.triggerId"
		:hidden="!ctx.open && props.forceMount ? true : undefined"
		:data-state="ctx.open ? 'open' : 'closed'"
		:data-side="side"
		:data-align="align"
	>
		<slot />
	</div>
</template>
