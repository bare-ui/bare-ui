<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import { useId } from '@/composables/use-id';
import { useControllableState } from '@/composables/use-controllable-state';
import { useToolbarContext } from './keys';

defineOptions({ name: 'ToolbarToggle', inheritAttrs: false });

const props = withDefaults(defineProps<{
	/** Controlled pressed state. */
	pressed?: boolean;
	/** Initial pressed state (uncontrolled). Default `false`. */
	defaultPressed?: boolean;
	/** Disable the toggle — it is skipped by roving focus. */
	disabled?: boolean;
	/** Called when the pressed state changes. */
	onPressedChange?: (pressed: boolean) => void;
}>(), {
	pressed: undefined,
	defaultPressed: false,
	disabled: false,
	onPressedChange: undefined,
});

const ctx = useToolbarContext();
const id = useId('toolbar-item');
const el = ref<HTMLButtonElement | null>(null);
const attrs = useAttrs();

const pressed = useControllableState<boolean>({
	value: () => props.pressed,
	defaultValue: props.defaultPressed,
	onChange: (value) => props.onPressedChange?.(value),
});

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

function handleClick(e: MouseEvent) {
	if (!props.disabled) pressed.value = !pressed.value;
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}

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
	<button
		ref="el"
		type="button"
		:disabled="disabled"
		:tabindex="tabIndex"
		:aria-pressed="pressed"
		:data-state="pressed ? 'on' : 'off'"
		data-toolbar-item=""
		v-bind="attrs"
		@click="handleClick"
		@focus="handleFocus"
		@keydown="handleKeyDown"
	>
		<slot />
	</button>
</template>
