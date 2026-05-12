<script setup lang="ts">
import { usePaginationContext } from './keys'
import type { PaginationItemValue } from './Pagination.types'

defineOptions({ name: 'PaginationItems' })

defineSlots<{
	default(props: { item: PaginationItemValue; index: number }): unknown
}>()

const ctx = usePaginationContext()
</script>

<template>
	<template
		v-for="(item, index) in ctx.items.value"
		:key="`${typeof item === 'string' ? item : item}-${index}`">
		<slot
			:item="item"
			:index="index" />
	</template>
</template>
