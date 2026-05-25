<script setup lang="ts">
import { useAttrs, type ComponentPublicInstance } from 'vue';
import { useRichTextContext } from './keys';

defineOptions({ name: 'RichTextEditor', inheritAttrs: false })

const attrs = useAttrs();
const ctx = useRichTextContext();

// Function ref: re-runs whenever the textarea mounts (and with null when it
// unmounts), so editorEl stays in sync as `v-if` adds/removes the element
// across mode switches. A component-level onMounted would capture it once and
// go stale after toggling through preview mode.
function setRef(el: Element | ComponentPublicInstance | null) {
	ctx.setEditorEl(el as HTMLTextAreaElement | null);
}

function handleChange(e: Event) {
	ctx.setValue((e.target as HTMLTextAreaElement).value);
}
</script>

<template>
	<textarea
		v-if="ctx.mode !== 'preview'"
		:ref="setRef"
		v-bind="attrs"
		:value="ctx.value"
		:data-mode="ctx.mode"
		@change="handleChange"
		@input="handleChange"
	/>
</template>
