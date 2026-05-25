<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, useAttrs } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { useId } from '@/composables/use-id';
import { useInteractiveState } from '@/composables/use-interactive-state';
import { useToggleGroupContext } from './keys';

defineOptions({ name: 'Toggle', inheritAttrs: false })

const props = withDefaults(defineProps<{
	pressed?: boolean;
	defaultPressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	value?: string;
	disabled?: boolean;
}>(), {
	pressed: undefined,
	defaultPressed: false,
	onPressedChange: undefined,
	value: undefined,
	disabled: false,
});

const attrs = useAttrs();
const group = useToggleGroupContext();
const inGroup = computed(() => group !== null && props.value !== undefined);

const standalonePressed = useControllableState({
	value: () => props.pressed,
	defaultValue: props.defaultPressed ?? false,
	onChange: props.onPressedChange,
});

const id = useId('toggle');
const elRef = ref<HTMLButtonElement | null>(null);

// Register with the group for roving focus when mounted.
let unregister: (() => void) | undefined;

onMounted(() => {
	if (inGroup.value && group && elRef.value) {
		unregister = group.register(id, elRef.value);
	}
});

onBeforeUnmount(() => {
	unregister?.();
});

const pressed = computed<boolean>(() => {
	if (inGroup.value && group) return group.isPressed(props.value!);
	return standalonePressed.value ?? false;
});

const disabled = computed<boolean>(() => {
	if (inGroup.value && group) return group.disabled || props.disabled;
	return props.disabled;
});

const tabIndex = computed<number | undefined>(() => {
	if (inGroup.value && group && group.rovingFocus) {
		return group.isTabbable(id) ? 0 : -1;
	}
	return undefined;
});

const { handlers, dataAttributes } = useInteractiveState({ disabled });

function handleClick() {
	if (disabled.value) return;
	if (inGroup.value && group) {
		group.toggle(props.value!);
	} else {
		standalonePressed.value = !standalonePressed.value;
	}
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.({} as MouseEvent);
}

function handleFocus() {
	if (inGroup.value && group) {
		group.onItemFocus(id);
	}
	handlers.onFocus({} as FocusEvent);
}

function handleKeyDown(e: KeyboardEvent) {
	if (inGroup.value && group && !e.defaultPrevented) {
		group.onItemKeyDown(e);
	}
	handlers.onKeydown(e);
}
</script>

<template>
	<button
		ref="elRef"
		type="button"
		:aria-pressed="pressed"
		:disabled="disabled"
		:tabindex="tabIndex"
		:data-state="pressed ? 'on' : 'off'"
		v-bind="{ ...dataAttributes, ...attrs }"
		@mouseenter="handlers.onMouseenter"
		@mouseleave="handlers.onMouseleave"
		@focus="handleFocus"
		@blur="handlers.onBlur"
		@pointerdown="handlers.onPointerdown"
		@pointerup="handlers.onPointerup"
		@keydown="handleKeyDown"
		@keyup="handlers.onKeyup"
		@click.self="handleClick"
	>
		<slot />
	</button>
</template>
