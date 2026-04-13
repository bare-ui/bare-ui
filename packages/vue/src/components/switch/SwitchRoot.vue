<script setup lang="ts">
import { provide, reactive, ref, computed, useAttrs, toRef } from 'vue';
import { useInteractiveState } from '@/composables/use-interactive-state';
import { SwitchKey } from './keys';

defineOptions({ name: 'SwitchRoot' })

const props = withDefaults(defineProps<{
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
}>(), {
	checked: undefined,
	defaultChecked: false,
	onChange: undefined,
	disabled: false,
});

const uncontrolledChecked = ref(props.defaultChecked);
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled });

const isControlled = computed(() => props.checked !== undefined);
const checkedValue = computed(() => (isControlled.value ? props.checked! : uncontrolledChecked.value));

provide(SwitchKey, reactive({
	checked: checkedValue,
	disabled: toRef(props, 'disabled'),
}));

const attrs = useAttrs();

function toggle() {
	if (props.disabled) return;
	const next = !checkedValue.value;
	if (!isControlled.value) uncontrolledChecked.value = next;
	props.onChange?.(next);
}

function handleClick(e: MouseEvent) {
	toggle();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		role="switch"
		:aria-checked="checkedValue"
		:disabled="disabled"
		:data-checked="checkedValue ? '' : undefined"
		v-bind="dataAttributes"
		@mouseenter="handlers.onMouseenter"
		@mouseleave="handlers.onMouseleave"
		@focus="handlers.onFocus"
		@blur="handlers.onBlur"
		@pointerdown="handlers.onPointerdown"
		@pointerup="handlers.onPointerup"
		@keydown="handlers.onKeydown"
		@keyup="handlers.onKeyup"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
