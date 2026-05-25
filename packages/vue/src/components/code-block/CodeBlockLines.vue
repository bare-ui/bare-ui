<script setup lang="ts">
import { useCodeBlockContext } from './keys';

defineOptions({ name: 'CodeBlockLines' })

const ctx = useCodeBlockContext();
</script>

<template>
	<template v-for="line in ctx.lines" :key="line.number">
		<span
			data-line=""
			:data-line-number="line.number"
			:data-diff="line.diff"
			:data-highlighted="line.highlighted ? '' : undefined"
			style="display: block"
		>
			<slot :line="line" />
		</span>
	</template>
</template>
