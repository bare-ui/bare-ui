<script setup lang="ts">
import { useMentionContext } from './keys'

defineOptions({ name: 'MentionEmpty' })

const ctx = useMentionContext()
</script>

<template>
	<div
		v-if="ctx.open.value && ctx.filtered.value.length === 0"
		role="presentation">
		<slot />
	</div>
</template>
