<script setup lang="ts">
import { useTypewriterContext } from './keys';

defineOptions({ name: 'TypewriterText' });

const ctx = useTypewriterContext();
</script>

<template>
	<span :data-state="ctx.isTyping ? 'typing' : 'done'">{{ ctx.displayed }}</span>
</template>
