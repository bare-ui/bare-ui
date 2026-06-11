<script setup lang="ts">
import { provide, reactive, computed, toRef } from 'vue';
import { AccordionItemKey } from './keys';
import { useAccordionContext } from './keys';
import { useId } from '@/composables/use-id';

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

const baseId = useId('accordion-item');
const triggerId = `${baseId}-trigger`;
const contentId = `${baseId}-content`;

provide(AccordionItemKey, reactive({
	value: toRef(props, 'value'),
	isOpen,
	disabled: isDisabled,
	triggerId,
	contentId,
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
