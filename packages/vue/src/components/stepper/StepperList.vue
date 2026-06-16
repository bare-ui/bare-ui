<script setup lang="ts">
import { useStepperContext } from './keys';

defineOptions({ name: 'StepperList' })

const ctx = useStepperContext();
</script>

<template>
	<div
		role="list"
		:data-orientation="ctx.orientation"
	>
		<slot />
	</div>
</template>
