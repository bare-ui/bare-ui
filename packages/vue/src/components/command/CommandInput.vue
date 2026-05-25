<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useCommandContext } from './keys';

defineOptions({ name: 'CommandInput', inheritAttrs: false });

const ctx = useCommandContext();
const attrs = useAttrs();

const activeDescendant = computed(() =>
	ctx.activeValue ? ctx.getItemId(ctx.activeValue) : undefined,
);

function handleChange(e: Event) {
	ctx.setQuery((e.target as HTMLInputElement).value);
}

function handleKeyDown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (e.defaultPrevented) return;
	if (e.key === 'ArrowDown') {
		e.preventDefault();
		ctx.moveActive(1);
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		ctx.moveActive(-1);
	} else if (e.key === 'Enter' && ctx.activeValue) {
		e.preventDefault();
		ctx.selectItem(ctx.activeValue);
	} else if (e.key === 'Escape') {
		e.preventDefault();
		ctx.close();
	}
}
</script>

<template>
	<input
		type="text"
		role="combobox"
		autocomplete="off"
		autocorrect="off"
		spellcheck="false"
		aria-expanded="true"
		:aria-controls="ctx.listboxId"
		:aria-activedescendant="activeDescendant"
		:value="ctx.query"
		v-bind="attrs"
		@change="handleChange"
		@input="handleChange"
		@keydown="handleKeyDown"
	/>
</template>
