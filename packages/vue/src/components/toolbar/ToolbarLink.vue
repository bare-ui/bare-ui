<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import { useId } from '@/composables/use-id';
import { useToolbarContext } from './keys';

defineOptions({ name: 'ToolbarLink', inheritAttrs: false });

const ctx = useToolbarContext();
const id = useId('toolbar-item');
const el = ref<HTMLAnchorElement | null>(null);
const attrs = useAttrs();

let unregister: (() => void) | undefined;

onMounted(() => {
	if (el.value) {
		unregister = ctx.register(id, el.value);
	}
});

onBeforeUnmount(() => {
	unregister?.();
});

const tabIndex = computed(() => (ctx.isTabbable(id) ? 0 : -1));

function handleFocus(e: FocusEvent) {
	ctx.onItemFocus(id);
	(attrs.onFocus as ((e: FocusEvent) => void) | undefined)?.(e);
}

function handleKeyDown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (!e.defaultPrevented) ctx.onItemKeyDown(e);
}
</script>

<template>
	<a
		ref="el"
		:tabindex="tabIndex"
		data-toolbar-item=""
		v-bind="attrs"
		@focus="handleFocus"
		@keydown="handleKeyDown"
	>
		<slot />
	</a>
</template>
