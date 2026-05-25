<script setup lang="ts">
import { useTypewriterContext } from './keys';

defineOptions({ name: 'TypewriterCursor' });

// `class` is intentionally NOT declared here — declaring it would remove it
// from Vue's attribute fallthrough and silently drop the consumer's class.
// The public `class?: string` type lives in Typewriter.types.ts.
withDefaults(defineProps<{ keepMounted?: boolean }>(), {
	keepMounted: false,
});

const ctx = useTypewriterContext();
</script>

<template>
	<span
		v-if="keepMounted || ctx.isTyping"
		aria-hidden="true"
		:data-state="ctx.isTyping ? 'typing' : 'done'"
	>
		<slot />
	</span>
</template>
