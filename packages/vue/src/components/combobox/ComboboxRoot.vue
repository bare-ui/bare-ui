<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'
import { ComboboxKey } from './keys'
import type { ComboboxOption } from './Combobox.types'

defineOptions({ name: 'ComboboxRoot' })

const props = withDefaults(
	defineProps<{
		options: ComboboxOption[]
		value?: string | null
		defaultValue?: string | null
		onChange?: (value: string | null, option: ComboboxOption | null) => void
		inputValue?: string
		defaultInputValue?: string
		onInputChange?: (value: string) => void
		filter?: (option: ComboboxOption, inputValue: string) => boolean
		disabled?: boolean
		open?: boolean
		defaultOpen?: boolean
		onOpenChange?: (open: boolean) => void
	}>(),
	{
		value: undefined,
		defaultValue: null,
		inputValue: undefined,
		open: undefined,
		defaultOpen: false,
		disabled: false,
	},
)

function defaultFilter(option: ComboboxOption, input: string) {
	return option.label.toLowerCase().includes(input.trim().toLowerCase())
}

const selected = useControllableState<string | null>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? null,
	onChange: (next) => {
		const opt = props.options.find((o) => o.value === next) ?? null
		props.onChange?.(next, opt)
	},
})

const initialInput =
	props.defaultInputValue ??
	(selected.value ? props.options.find((o) => o.value === selected.value)?.label ?? '' : '')

const inputValue = useControllableState<string>({
	value: () => props.inputValue,
	defaultValue: initialInput,
	onChange: (next) => props.onInputChange?.(next),
})

const open = useControllableState<boolean>({
	value: () => props.open,
	defaultValue: props.defaultOpen,
	onChange: (next) => props.onOpenChange?.(next),
})

const options = computed(() => props.options)
const disabled = computed(() => props.disabled)

function setOpen(next: boolean) {
	open.value = next
}

function setInputValue(text: string) {
	inputValue.value = text
}

const filtered = computed(() => {
	if (!inputValue.value) return options.value
	const filterFn = props.filter ?? defaultFilter
	return options.value.filter((o) => filterFn(o, inputValue.value))
})

const highlightedIndex = ref<number>(-1)

function setHighlightedIndex(index: number) {
	highlightedIndex.value = index
}

watch([open, filtered, selected], ([isOpen, currentFiltered]) => {
	if (!isOpen) {
		highlightedIndex.value = -1
		return
	}
	if (highlightedIndex.value >= currentFiltered.length) {
		highlightedIndex.value = currentFiltered.length === 0 ? -1 : 0
	} else if (highlightedIndex.value === -1 && currentFiltered.length > 0) {
		const selectedIdx = currentFiltered.findIndex((o) => o.value === selected.value)
		highlightedIndex.value = selectedIdx >= 0 ? selectedIdx : 0
	}
})

function moveHighlight(delta: number) {
	if (filtered.value.length === 0) return
	const len = filtered.value.length
	let i = highlightedIndex.value
	for (let attempt = 0; attempt < len; attempt++) {
		i = (i + delta + len) % len
		if (!filtered.value[i].disabled) {
			highlightedIndex.value = i
			return
		}
	}
}

function commitOption(option: ComboboxOption) {
	if (option.disabled) return
	selected.value = option.value
	inputValue.value = option.label
	setOpen(false)
}

const rootRef = ref<HTMLDivElement | null>(null)
useClickOutside(rootRef, () => {
	if (open.value) setOpen(false)
})

const inputFocused = ref(false)
function registerInputFocus(focused: boolean) {
	inputFocused.value = focused
}

watch(
	[selected, options],
	([s, opts]) => {
		if (props.inputValue !== undefined || inputFocused.value) return
		const opt = opts.find((o) => o.value === s) ?? null
		inputValue.value = opt ? opt.label : ''
	},
)

const baseId = useId('combobox')
const listboxId = `${baseId}-listbox`
function getOptionId(v: string) {
	return `${baseId}-opt-${v}`
}

provide(ComboboxKey, {
	options,
	filtered,
	selected,
	inputValue,
	open,
	highlightedIndex,
	disabled,
	listboxId,
	getOptionId,
	setOpen,
	setInputValue,
	commitOption,
	setHighlightedIndex,
	moveHighlight,
	registerInputFocus,
})
</script>

<template>
	<div
		ref="rootRef"
		:data-state="open ? 'open' : 'closed'"
		:data-disabled="props.disabled ? '' : undefined">
		<slot />
	</div>
</template>
