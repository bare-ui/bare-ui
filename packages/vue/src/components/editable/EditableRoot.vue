<script setup lang="ts">
import { provide, reactive, ref, computed } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { EditableKey } from './keys';

defineOptions({ name: 'EditableRoot' });

const props = withDefaults(defineProps<{
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	editing?: boolean;
	defaultEditing?: boolean;
	onEditingChange?: (editing: boolean) => void;
	onSubmit?: (value: string) => void;
	onCancel?: () => void;
	onEdit?: () => void;
	submitOnBlur?: boolean;
	disabled?: boolean;
	placeholder?: string;
}>(), {
	value: undefined,
	defaultValue: '',
	onChange: undefined,
	editing: undefined,
	defaultEditing: false,
	onEditingChange: undefined,
	onSubmit: undefined,
	onCancel: undefined,
	onEdit: undefined,
	submitOnBlur: true,
	disabled: false,
	placeholder: undefined,
});

const committedValue = useControllableState<string>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? '',
	onChange: props.onChange,
});

const isEditing = useControllableState<boolean>({
	value: () => props.editing,
	defaultValue: props.defaultEditing ?? false,
	onChange: props.onEditingChange,
});

// In-progress edit buffer — starts as a ref, synced when editing starts
const draft = ref<string>(committedValue.value ?? '');

function startEdit() {
	if (props.disabled) return;
	draft.value = committedValue.value ?? '';
	isEditing.value = true;
	props.onEdit?.();
}

function submit() {
	committedValue.value = draft.value;
	isEditing.value = false;
	props.onSubmit?.(draft.value);
}

function cancel() {
	draft.value = committedValue.value ?? '';
	isEditing.value = false;
	props.onCancel?.();
}

function setDraft(value: string) {
	draft.value = value;
}

provide(EditableKey, reactive({
	value: computed(() => committedValue.value ?? ''),
	draft: computed(() => draft.value),
	isEditing: computed(() => isEditing.value ?? false),
	disabled: computed(() => props.disabled),
	placeholder: computed(() => props.placeholder),
	submitOnBlur: computed(() => props.submitOnBlur),
	setDraft,
	startEdit,
	submit,
	cancel,
}));
</script>

<template>
	<div
		:data-editing="(isEditing ?? false) ? '' : undefined"
		:data-disabled="disabled ? '' : undefined"
	>
		<slot />
	</div>
</template>
