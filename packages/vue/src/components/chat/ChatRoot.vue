<script setup lang="ts">
import { provide, reactive, computed } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { ChatKey } from './keys';

defineOptions({ name: 'ChatRoot' })

const props = withDefaults(defineProps<{
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	isStreaming?: boolean;
	disabled?: boolean;
}>(), {
	value: undefined,
	defaultValue: '',
	onValueChange: undefined,
	onSubmit: undefined,
	isStreaming: false,
	disabled: false,
});

const composerValue = useControllableState<string>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? '',
	onChange: props.onValueChange,
});

function setValue(next: string) {
	composerValue.value = next;
}

function submit() {
	if (props.disabled || props.isStreaming) return;
	const v = composerValue.value ?? '';
	if (!v.trim()) return;
	props.onSubmit?.(v);
	composerValue.value = '';
}

provide(ChatKey, reactive({
	value: computed(() => composerValue.value ?? ''),
	setValue,
	submit,
	isStreaming: computed(() => props.isStreaming),
	disabled: computed(() => props.disabled),
}));
</script>

<template>
	<div :data-streaming="isStreaming ? '' : undefined">
		<slot />
	</div>
</template>
