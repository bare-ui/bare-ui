<script setup lang="ts">
import { provide, reactive, computed } from 'vue';
import { useCopyToClipboard } from '@/composables/use-copy-to-clipboard';
import { CodeBlockKey } from './keys';
import type { CodeBlockLine } from './CodeBlock.types';

defineOptions({ name: 'CodeBlockRoot' })

const props = withDefaults(defineProps<{
	code: string;
	language?: string;
	diff?: Record<number, 'add' | 'remove'>;
	highlightLines?: number[];
	startLine?: number;
	copyResetAfter?: number;
}>(), {
	language: undefined,
	diff: undefined,
	highlightLines: undefined,
	startLine: 1,
	copyResetAfter: 2000,
});

const { copy: copyText, copied } = useCopyToClipboard({
	resetAfter: props.copyResetAfter,
});

const lines = computed<CodeBlockLine[]>(() => {
	const highlightSet = new Set(props.highlightLines ?? []);
	// Split on newlines but drop a single trailing empty line so a code
	// string ending in "\n" doesn't render a phantom blank row.
	const raw = props.code.split('\n');
	if (raw.length > 1 && raw[raw.length - 1] === '') raw.pop();
	return raw.map((content, i) => {
		const number = props.startLine + i;
		return {
			number,
			content,
			diff: props.diff?.[number],
			highlighted: highlightSet.has(number),
		};
	});
});

function copy() {
	void copyText(props.code);
}

provide(CodeBlockKey, reactive({
	code: computed(() => props.code),
	language: computed(() => props.language),
	lines: computed(() => lines.value),
	copied: computed(() => copied.value),
	copy,
}));
</script>

<template>
	<div :data-language="language || undefined">
		<slot />
	</div>
</template>
