<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PopoverAlign, PopoverSide } from './Popover.types';
import { usePopoverContext } from './keys';
import { useFocusTrap } from '@/composables/use-focus-trap';

defineOptions({ name: 'PopoverContent' });

const props = withDefaults(
	defineProps<{
		side?: PopoverSide;
		align?: PopoverAlign;
		forceMount?: boolean;
	}>(),
	{
		side: 'bottom',
		align: 'center',
		forceMount: false,
	},
);

const ctx = usePopoverContext();
const contentRef = ref<HTMLElement | null>(null);
const shouldRender = computed(() => ctx.open || props.forceMount);

// Non-modal dialog: move focus into the popover on open and restore it to
// the trigger on close, but let Tab leave naturally (trap: false).
useFocusTrap(contentRef, { active: () => ctx.open, trap: false });
</script>

<template>
	<div
		v-if="shouldRender"
		:id="ctx.contentId"
		ref="contentRef"
		role="dialog"
		:aria-labelledby="ctx.triggerId"
		:tabindex="-1"
		:hidden="!ctx.open && props.forceMount ? true : undefined"
		:data-state="ctx.open ? 'open' : 'closed'"
		:data-side="side"
		:data-align="align">
		<slot />
	</div>
</template>
