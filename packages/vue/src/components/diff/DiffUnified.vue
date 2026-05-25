<script setup lang="ts">
import { useDiffContext } from './keys';

defineOptions({ name: 'DiffUnified' });

const ctx = useDiffContext();
</script>

<template>
	<div data-diff-view="unified">
		<div
			v-for="(line, i) in ctx.lines"
			:key="i"
			data-diff-line
			:data-type="line.type">
			<slot :line="line" />
		</div>
	</div>
</template>
