<script setup lang="ts">
import { useDiffContext } from './keys';

defineOptions({ name: 'DiffSplit' });

const ctx = useDiffContext();
</script>

<template>
	<div data-diff-view="split">
		<div
			v-for="(row, i) in ctx.rows"
			:key="i"
			data-diff-row
			:data-left="row.left?.type"
			:data-right="row.right?.type">
			<slot
				:left="row.left"
				:right="row.right" />
		</div>
	</div>
</template>
