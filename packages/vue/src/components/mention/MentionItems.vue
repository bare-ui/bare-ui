<script setup lang="ts">
import { useMentionContext } from './keys'

defineOptions({ name: 'MentionItems' })

const ctx = useMentionContext()
</script>

<template>
	<template
		v-for="(option, index) in ctx.filtered.value"
		:key="option.id">
		<div
			:id="ctx.getOptionId(index)"
			role="option"
			:aria-selected="index === ctx.activeIndex.value"
			:aria-disabled="option.disabled || undefined"
			:data-active="index === ctx.activeIndex.value ? '' : undefined"
			:data-disabled="option.disabled ? '' : undefined"
			@mouseenter="ctx.setActiveIndex(index)"
			@mousedown.prevent
			@click="() => { if (!option.disabled) ctx.select(option) }">
			<slot
				:option="option"
				:active="index === ctx.activeIndex.value"
				:index="index" />
		</div>
	</template>
</template>
