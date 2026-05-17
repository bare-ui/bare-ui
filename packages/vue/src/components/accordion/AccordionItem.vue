<script setup lang="ts">
import { provide, reactive, computed, toRef } from 'vue';
import { AccordionItemKey } from './keys';
import { useAccordionContext } from './keys';

defineOptions({ name: 'AccordionItem' })

const props = withDefaults(defineProps<{
	value: string;
	disabled?: boolean;
}>(), {
	disabled: false,
});

const ctx = useAccordionContext();

const isOpen = computed(() => ctx.isOpen(props.value));
const isDisabled = computed(() => props.disabled || ctx.disabled);

provide(AccordionItemKey, reactive({
	value: toRef(props, 'value'),
	isOpen,
	disabled: isDisabled,
}));
</script>

<template>
	<div
		:data-state="isOpen ? 'open' : 'closed'"
		:data-disabled="isDisabled ? '' : undefined"
	>
		<slot />
	</div>
</template>
