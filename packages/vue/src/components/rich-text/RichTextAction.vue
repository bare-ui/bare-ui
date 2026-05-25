<script setup lang="ts">
import { useAttrs } from 'vue';
import { useRichTextContext } from './keys';

defineOptions({ name: 'RichTextAction', inheritAttrs: false })

const props = defineProps<{
	wrap?: string | [string, string];
	insert?: string;
}>();

const attrs = useAttrs();
const ctx = useRichTextContext();

function handleClick(e: MouseEvent) {
	if (props.wrap !== undefined) {
		if (Array.isArray(props.wrap)) {
			ctx.wrapSelection(props.wrap[0], props.wrap[1]);
		} else {
			ctx.wrapSelection(props.wrap);
		}
	}
	if (props.insert !== undefined) {
		ctx.insert(props.insert);
	}
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}

function handleMouseDown(e: MouseEvent) {
	// Keep the editor's selection — buttons would otherwise steal focus.
	e.preventDefault();
	(attrs.onMousedown as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		v-bind="attrs"
		type="button"
		@mousedown="handleMouseDown"
		@click="handleClick">
		<slot />
	</button>
</template>
