<script setup lang="ts">
import { useComboboxContext } from './keys'

defineOptions({ name: 'ComboboxEmpty' })

const ctx = useComboboxContext()
</script>

<template>
	<div
		v-if="ctx.filtered.value.length === 0"
		role="presentation">
		<slot />
	</div>
</template>
