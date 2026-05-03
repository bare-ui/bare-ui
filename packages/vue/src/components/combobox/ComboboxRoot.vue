<script setup lang="ts">
import { computed, provide, ref, useId, watch } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
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
		defaultValue: null,
		defaultOpen: false,
		disabled: false,
	},
)

function defaultFilter(option: ComboboxOption, input: string) {
	return option.label.toLowerCase().includes(input.trim().toLowerCase())
}

// --- selected ---
const uncontrolledValue = ref<string | null>(props.defaultValue ?? null)
const isValueControlled = computed(() => props.value !== undefined)
const selected = computed<string | null>(() =>
	isValueControlled.value ? (props.value as string | null) : uncontrolledValue.value,
)

// --- input text ---
const initialInput =
	props.defaultInputValue ??
	(selected.value ? props.options.find((o) => o.value === selected.value)?.label ?? '' : '')
const uncontrolledInput = ref<string>(initialInput)
const isInputControlled = computed(() => props.inputValue !== undefined)
const inputValue = computed<string>(() =>
	isInputControlled.value ? (props.inputValue as string) : uncontrolledInput.value,
)

// --- open ---
const uncontrolledOpen = ref<boolean>(props.defaultOpen)
const isOpenControlled = computed(() => props.open !== undefined)
const open = computed<boolean>(() =>
	isOpenControlled.value ? (props.open as boolean) : uncontrolledOpen.value,
)

const options = computed(() => props.options)
const disabled = computed(() => props.disabled)

function setOpen(next: boolean) {
	if (!isOpenControlled.value) uncontrolledOpen.value = next
	props.onOpenChange?.(next)
}

function setInputValue(text: string) {
	if (!isInputControlled.value) uncontrolledInput.value = text
	props.onInputChange?.(text)
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
	if (!isValueControlled.value) uncontrolledValue.value = option.value
	if (!isInputControlled.value) uncontrolledInput.value = option.label
	props.onChange?.(option.value, option)
	props.onInputChange?.(option.label)
	setOpen(false)
}

const rootRef = ref<HTMLDivElement | null>(null)
useClickOutside(rootRef, () => {
	if (open.value) setOpen(false)
})

// Sync input text with selected option label when selection changes externally and input not focused.
const inputFocused = ref(false)
function registerInputFocus(focused: boolean) {
	inputFocused.value = focused
}

watch(
	[selected, options],
	([s, opts]) => {
		if (isInputControlled.value || inputFocused.value) return
		const opt = opts.find((o) => o.value === s) ?? null
		uncontrolledInput.value = opt ? opt.label : ''
	},
)

const baseId = useId() ?? 'combobox'
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
