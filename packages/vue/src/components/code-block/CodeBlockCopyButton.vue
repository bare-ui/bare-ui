<script setup lang="ts">
import { useAttrs } from 'vue';
import { useCodeBlockContext } from './keys';

defineOptions({ name: 'CodeBlockCopyButton', inheritAttrs: false })

const ctx = useCodeBlockContext();
const attrs = useAttrs();

function handleClick(e: MouseEvent) {
	ctx.copy();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		:aria-label="ctx.copied ? 'Copied' : 'Copy code'"
		:data-copied="ctx.copied ? '' : undefined"
		v-bind="attrs"
		@click="handleClick"
	>
		<slot :copied="ctx.copied" />
	</button>
</template>
