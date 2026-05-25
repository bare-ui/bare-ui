<script setup lang="ts">
import { provide, reactive, computed } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { RichTextKey } from './keys';
import type { RichTextMode } from './RichText.types';
import type { MarkdownComponents, MarkdownNode } from '../markdown/Markdown.types';

defineOptions({ name: 'RichTextRoot' })

const props = withDefaults(defineProps<{
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	mode?: RichTextMode;
	defaultMode?: RichTextMode;
	onModeChange?: (mode: RichTextMode) => void;
	parse?: (content: string) => MarkdownNode[];
	components?: MarkdownComponents;
}>(), {
	value: undefined,
	defaultValue: '',
	onChange: undefined,
	mode: undefined,
	defaultMode: 'edit',
	onModeChange: undefined,
	parse: undefined,
	components: undefined,
});

const textValue = useControllableState<string>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? '',
	onChange: props.onChange,
});

const modeValue = useControllableState<RichTextMode>({
	value: () => props.mode,
	defaultValue: props.defaultMode ?? 'edit',
	onChange: props.onModeChange,
});

function setValue(next: string) {
	textValue.value = next;
}

function setMode(next: RichTextMode) {
	modeValue.value = next;
}

// Ref to the editor textarea element — stored in context so Action can access it
let editorEl: HTMLTextAreaElement | null = null;

function setEditorEl(el: HTMLTextAreaElement | null) {
	editorEl = el;
}

function wrapSelection(before: string, after = before) {
	const el = editorEl;
	const current = textValue.value ?? '';
	const start = el?.selectionStart ?? current.length;
	const end = el?.selectionEnd ?? current.length;
	const selected = current.slice(start, end);
	const next = current.slice(0, start) + before + selected + after + current.slice(end);
	setValue(next);
	globalThis.requestAnimationFrame(() => {
		if (!el) return;
		el.focus();
		el.setSelectionRange(start + before.length, end + before.length);
	});
}

function insert(text: string) {
	const el = editorEl;
	const current = textValue.value ?? '';
	const start = el?.selectionStart ?? current.length;
	const end = el?.selectionEnd ?? current.length;
	const next = current.slice(0, start) + text + current.slice(end);
	setValue(next);
	globalThis.requestAnimationFrame(() => {
		if (!el) return;
		el.focus();
		const caret = start + text.length;
		el.setSelectionRange(caret, caret);
	});
}

provide(RichTextKey, reactive({
	value: computed(() => textValue.value ?? ''),
	setValue,
	mode: computed(() => modeValue.value ?? 'edit'),
	setMode,
	get editorEl() { return editorEl; },
	setEditorEl,
	wrapSelection,
	insert,
	parse: computed(() => props.parse),
	components: computed(() => props.components),
}));
</script>

<template>
	<div :data-mode="modeValue">
		<slot />
	</div>
</template>
