<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue'
import { PaginationKey, getPaginationItems } from './keys'
import { useWireUIMessages } from '@/context/wire-ui-context'

defineOptions({ name: 'PaginationRoot' })

const props = withDefaults(
	defineProps<{
		totalPages: number
		page?: number
		defaultPage?: number
		onChange?: (page: number) => void
		siblingCount?: number
		boundaryCount?: number
	}>(),
	{
		defaultPage: 1,
		siblingCount: 1,
		boundaryCount: 1,
	},
)

// `aria-label` arrives as a fall-through attribute (kebab attribute names don't
// bind to a declared prop). An explicit value wins; otherwise the localized
// default. It still falls through to the <nav>, where our binding matches it.
const attrs = useAttrs()
const messages = useWireUIMessages()
const ariaLabel = computed(
	() => (attrs['aria-label'] as string | undefined) ?? messages.value.pagination.label,
)

const uncontrolled = ref<number>(props.defaultPage)
const isControlled = computed(() => props.page !== undefined)
const page = computed<number>(() => (isControlled.value ? (props.page as number) : uncontrolled.value))
const totalPages = computed(() => props.totalPages)

function goTo(next: number) {
	const clamped = Math.min(Math.max(next, 1), Math.max(totalPages.value, 1))
	if (clamped === page.value) return
	if (!isControlled.value) uncontrolled.value = clamped
	props.onChange?.(clamped)
}

function prev() {
	goTo(page.value - 1)
}

function next() {
	goTo(page.value + 1)
}

const items = computed(() =>
	getPaginationItems(totalPages.value, page.value, props.siblingCount, props.boundaryCount),
)

const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value < totalPages.value)

provide(PaginationKey, {
	page,
	totalPages,
	items,
	canPrev,
	canNext,
	goTo,
	prev,
	next,
})
</script>

<template>
	<nav :aria-label="ariaLabel">
		<slot />
	</nav>
</template>
