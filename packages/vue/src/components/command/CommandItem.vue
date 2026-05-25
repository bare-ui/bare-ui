<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useAttrs, watch } from 'vue';
import { useCommandContext, useCommandGroupContext } from './keys';
import type { CommandRegistryEntry } from './Command.types';

defineOptions({ name: 'CommandItem', inheritAttrs: false });

const props = withDefaults(defineProps<{
	value: string;
	keywords?: string[];
	disabled?: boolean;
	onSelect?: (value: string) => void;
}>(), {
	keywords: undefined,
	disabled: false,
	onSelect: undefined,
});

const ctx = useCommandContext();
const group = useCommandGroupContext();
const attrs = useAttrs();

// Registration
let unregister: (() => void) | undefined;

function doRegister() {
	unregister?.();
	unregister = ctx.registerItem(props.value, {
		keywords: props.keywords ?? [],
		disabled: props.disabled,
		groupId: group?.groupId,
		onSelect: props.onSelect,
	});
}

onMounted(() => {
	doRegister();
});

// Re-register when key properties change
watch(
	[() => props.value, () => (props.keywords ?? []).join('\0'), () => props.disabled],
	() => doRegister(),
);

// Keep onSelect up-to-date without re-registering (avoids visible list churn)
watch(() => props.onSelect, (newFn) => {
	const entry = (ctx as { _registry?: Map<string, CommandRegistryEntry> })._registry?.get(props.value);
	if (entry) entry.onSelect = newFn;
});

onBeforeUnmount(() => {
	unregister?.();
});

const isVisible = computed(() => ctx.isVisible(props.value));
const isActive = computed(() => ctx.isActive(props.value));

function handlePointerMove() {
	if (!props.disabled) ctx.setActiveValue(props.value);
}

function handleClick(e: MouseEvent) {
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
	if (!props.disabled) ctx.selectItem(props.value);
}
</script>

<template>
	<div
		v-if="isVisible"
		:id="ctx.getItemId(value)"
		role="option"
		:aria-selected="isActive"
		:aria-disabled="disabled || undefined"
		:data-active="isActive ? '' : undefined"
		:data-disabled="disabled ? '' : undefined"
		v-bind="attrs"
		@pointermove="handlePointerMove"
		@click="handleClick"
	>
		<slot />
	</div>
</template>
