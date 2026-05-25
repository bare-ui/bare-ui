<script setup lang="ts">
import { useCodeBlockContext } from './keys';

defineOptions({ name: 'CodeBlockCode' })

const ctx = useCodeBlockContext();
</script>

<template>
	<pre :data-language="ctx.language || undefined">
		<code :data-language="ctx.language || undefined"><slot /></code>
	</pre>
</template>
