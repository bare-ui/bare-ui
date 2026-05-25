<script setup lang="ts">
import { useAttrs } from 'vue';
import { useChatContext } from './keys';

defineOptions({ name: 'ChatComposer', inheritAttrs: false })

const ctx = useChatContext();
const attrs = useAttrs();

function handleSubmit(e: Event) {
	e.preventDefault();
	ctx.submit();
	(attrs.onSubmit as ((e: Event) => void) | undefined)?.(e);
}
</script>

<template>
	<form
		v-bind="attrs"
		@submit="handleSubmit"
	>
		<slot />
	</form>
</template>
