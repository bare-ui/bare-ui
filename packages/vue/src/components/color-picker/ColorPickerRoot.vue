<script setup lang="ts">
import { provide, reactive, computed, watch } from 'vue';
import { hexToHsva, hsvaToHex, hsvaToRgba, hsvToRgb, clamp } from './color-utils';
import { ColorPickerKey } from './keys';
import type { HSVA } from './ColorPicker.types';

defineOptions({ name: 'ColorPickerRoot' })

const props = withDefaults(defineProps<{
	value?: string;
	defaultValue?: string;
	onChange?: (hex: string) => void;
	alpha?: boolean;
}>(), {
	value: undefined,
	defaultValue: '#000000',
	onChange: undefined,
	alpha: true,
});

const DEFAULT: HSVA = { h: 0, s: 0, v: 0, a: 1 };

// Internal HSVA state (uncontrolled)
import { ref } from 'vue';
const hsvaInternal = ref<HSVA>(hexToHsva(props.value ?? props.defaultValue) ?? DEFAULT);

// Sync controlled value changes from parent
watch(
	() => props.value,
	(val) => {
		if (val === undefined) return;
		const next = hexToHsva(val);
		if (next && hsvaToHex(next) !== hsvaToHex(hsvaInternal.value)) {
			hsvaInternal.value = next;
		}
	},
);

function commit(next: HSVA) {
	hsvaInternal.value = next;
	props.onChange?.(hsvaToHex(next, props.alpha));
}

function setSaturationValue(s: number, v: number) {
	commit({ ...hsvaInternal.value, s, v });
}

function setHue(h: number) {
	commit({ ...hsvaInternal.value, h });
}

function setAlpha(a: number) {
	commit({ ...hsvaInternal.value, a: clamp(a, 0, 1) });
}

function setHex(hex: string) {
	const next = hexToHsva(hex);
	if (next) commit(props.alpha ? next : { ...next, a: 1 });
}

const rgba = computed(() => hsvaToRgba(hsvaInternal.value));
const hex = computed(() => hsvaToHex(hsvaInternal.value, props.alpha));
const hueColor = computed(() => {
	const { r, g, b } = hsvToRgb(hsvaInternal.value.h, 100, 100);
	return `rgb(${r}, ${g}, ${b})`;
});

provide(ColorPickerKey, reactive({
	hsva: computed(() => hsvaInternal.value),
	rgba,
	hex,
	hueColor,
	setSaturationValue,
	setHue,
	setAlpha,
	setHex,
}));
</script>

<template>
	<div>
		<slot />
	</div>
</template>
