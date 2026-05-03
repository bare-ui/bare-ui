<script setup lang="ts">
import { useComboboxContext } from './keys'

defineOptions({ name: 'ComboboxContent' })

const ctx = useComboboxContext()
</script>

<template>
	<div
		v-if="ctx.open.value"
		:id="ctx.listboxId"
		role="listbox"
		data-state="open">
		<slot />
	</div>
</template>
