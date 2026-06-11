<script setup lang="ts">
import { computed } from 'vue';
import { useAccordionItemContext } from './keys';

defineOptions({ name: 'AccordionContent' })

const props = withDefaults(defineProps<{
	forceMount?: boolean;
}>(), {
	forceMount: false,
});

const itemCtx = useAccordionItemContext();

const isOpen = computed(() => itemCtx.isOpen);
const shouldRender = computed(() => props.forceMount || isOpen.value);
</script>

<template>
	<div
		v-if="shouldRender"
		:id="itemCtx.contentId"
		role="region"
		:aria-labelledby="itemCtx.triggerId"
		:hidden="props.forceMount && !isOpen ? true : undefined"
		:data-state="isOpen ? 'open' : 'closed'"
	>
		<slot />
	</div>
</template>
