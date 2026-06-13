<script setup lang="ts">
import { ref, watch, useAttrs } from 'vue';
import { useColorPickerContext } from './keys';
import { useWireUIMessages } from '@/context/wire-ui-context';
import { hexToHsva } from './color-utils';

defineOptions({ name: 'ColorPickerInput', inheritAttrs: false })

const ctx = useColorPickerContext();
const messages = useWireUIMessages();
const attrs = useAttrs();

const draft = ref(ctx.hex);
let focused = false;

// Keep the field in sync with the color unless the user is editing it.
watch(
	() => ctx.hex,
	(hex) => {
		if (!focused) draft.value = hex;
	},
);

function onFocus(e: FocusEvent) {
	focused = true;
	(attrs.onFocus as ((e: FocusEvent) => void) | undefined)?.(e);
}

function onChange(e: Event) {
	const val = (e.target as HTMLInputElement).value;
	draft.value = val;
	if (hexToHsva(val) !== null) ctx.setHex(val);
}

function onKeyDown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (e.key === 'Enter') ctx.setHex(draft.value);
}

function onBlur(e: FocusEvent) {
	focused = false;
	draft.value = ctx.hex;
	(attrs.onBlur as ((e: FocusEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<input
		type="text"
		:spellcheck="false"
		:value="draft"
		:aria-label="messages.colorPicker.hexColor"
		v-bind="attrs"
		@focus="onFocus"
		@change="onChange"
		@input="onChange"
		@keydown="onKeyDown"
		@blur="onBlur"
	/>
</template>
