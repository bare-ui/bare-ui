<script setup lang="ts">
import { useAttrs } from 'vue';
import { useCodeBlockContext } from './keys';
import { useWireUIMessages } from '@/context/wire-ui-context';

defineOptions({ name: 'CodeBlockCopyButton', inheritAttrs: false })

const ctx = useCodeBlockContext();
const messages = useWireUIMessages();
const attrs = useAttrs();

function handleClick(e: MouseEvent) {
	ctx.copy();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		:aria-label="ctx.copied ? messages.codeBlock.copied : messages.codeBlock.copy"
		:data-copied="ctx.copied ? '' : undefined"
		v-bind="attrs"
		@click="handleClick"
	>
		<slot :copied="ctx.copied" />
	</button>
</template>
