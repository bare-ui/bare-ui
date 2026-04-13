<script setup lang="ts">
import { useSwitchContext } from './keys';

defineOptions({ name: 'SwitchThumb' })

const ctx = useSwitchContext();
</script>

<template>
	<span
		:data-checked="ctx.checked ? '' : undefined"
		:data-disabled="ctx.disabled ? '' : undefined"
	/>
</template>
