<script setup lang="ts">
import { ref, computed } from 'vue'
import { getDirection } from '@/composables/use-direction'

defineOptions({ name: 'Rating' })

const props = withDefaults(
	defineProps<{
		value?: number
		defaultValue?: number
		onChange?: (value: number) => void
		max?: number
		disabled?: boolean
		readOnly?: boolean
		starClassName?: string
	}>(),
	{
		defaultValue: 0,
		max: 5,
		disabled: false,
		readOnly: false,
	},
)

const uncontrolledValue = ref(props.defaultValue)
const hoverValue = ref(0)

const isControlled = computed(() => props.value !== undefined)
const selectedValue = computed(() => (isControlled.value ? props.value! : uncontrolledValue.value))
const displayValue = computed(() => hoverValue.value || selectedValue.value)
const interactive = computed(() => !props.disabled && !props.readOnly)

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

// Roving tabindex: the group is a single tab stop. The selected star (or the
// first when nothing is selected) is the one tabbable star; arrow keys then
// move focus and selection between stars.
const tabbableStar = computed(() => (selectedValue.value >= 1 ? selectedValue.value : 1))

function handleSelect(star: number) {
	if (!interactive.value) return
	if (!isControlled.value) uncontrolledValue.value = star
	props.onChange?.(star)
}

function handleKeyDown(e: KeyboardEvent, star: number) {
	if (!interactive.value) return
	// RTL mirrors the horizontal arrows; vertical arrows are unaffected.
	const rtl = getDirection(e.currentTarget as Element) === 'rtl'
	const incKey = rtl ? 'ArrowLeft' : 'ArrowRight'
	const decKey = rtl ? 'ArrowRight' : 'ArrowLeft'
	let next: number | null = null
	if (e.key === incKey || e.key === 'ArrowUp') next = Math.min(props.max, star + 1)
	else if (e.key === decKey || e.key === 'ArrowDown') next = Math.max(1, star - 1)
	else if (e.key === 'Home') next = 1
	else if (e.key === 'End') next = props.max
	if (next === null) return
	e.preventDefault()
	if (!isControlled.value) uncontrolledValue.value = next
	props.onChange?.(next)
	// Move focus to the star the arrow keys landed on (roving tabindex).
	const buttons = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('button')
	buttons?.[next - 1]?.focus()
}
</script>

<template>
	<div
		:role="readOnly ? 'img' : 'group'"
		:aria-label="readOnly ? `Rating: ${selectedValue} out of ${max}` : 'Rating'"
		:data-disabled="disabled ? '' : undefined"
		:data-readonly="readOnly ? '' : undefined"
	>
		<button
			v-for="star in stars"
			:key="star"
			type="button"
			:disabled="disabled || readOnly"
			:tabindex="readOnly ? -1 : star === tabbableStar ? 0 : -1"
			:class="starClassName"
			:aria-pressed="readOnly ? undefined : star <= selectedValue"
			:data-filled="star <= selectedValue ? '' : undefined"
			:data-highlighted="star <= displayValue ? '' : undefined"
			:data-disabled="disabled ? '' : undefined"
			:aria-label="`${star} out of ${max} stars`"
			@click="handleSelect(star)"
			@keydown="(e: KeyboardEvent) => handleKeyDown(e, star)"
			@mouseenter="interactive && (hoverValue = star)"
			@mouseleave="hoverValue = 0"
		>
			<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-full">
				<path
					d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
				/>
			</svg>
		</button>
	</div>
</template>
