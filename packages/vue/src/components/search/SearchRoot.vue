<script setup lang="ts">
import { provide, reactive, ref, computed, onUnmounted, toRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { SearchKey } from './keys'
import type { SearchOption } from './Search.types'

defineOptions({ name: 'SearchRoot' })

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  value?: string
  defaultSearchValue?: string
  onSearchChange?: (value: string) => void
  onSelect?: (option: SearchOption) => void
  onSubmitSearch?: () => void
  loading?: boolean
  searchDelay?: number
}>(), { open: undefined, defaultOpen: false, onOpenChange: undefined, value: undefined, defaultSearchValue: '', onSearchChange: undefined, onSelect: undefined, onSubmitSearch: undefined, loading: false, searchDelay: 1000 })

const rootRef = ref<HTMLElement | null>(null)
const uncontrolledOpen = ref(props.defaultOpen)
const uncontrolledValue = ref(props.defaultSearchValue)
const highlightedIndex = ref(-1)
const itemCount = ref(0)
const inputNode = ref<HTMLInputElement | null>(null)
let typingTimeout: ReturnType<typeof setTimeout> | null = null

const isOpenControlled = computed(() => props.open !== undefined)
const openState = computed(() => isOpenControlled.value ? props.open! : uncontrolledOpen.value)

const isValueControlled = computed(() => props.value !== undefined)
const searchValue = computed(() => isValueControlled.value ? props.value! : uncontrolledValue.value)

function handleOpenChange(value: boolean) {
  if (!isOpenControlled.value) uncontrolledOpen.value = value
  props.onOpenChange?.(value)
  if (!value) highlightedIndex.value = -1
}

function handleSearchChange(value: string) {
  if (!isValueControlled.value) uncontrolledValue.value = value
  props.onSearchChange?.(value)

  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => { props.onSubmitSearch?.() }, props.searchDelay)
}

function handleSelect(option: SearchOption) {
  if (typingTimeout) clearTimeout(typingTimeout)
  props.onSelect?.(option)
  if (!isValueControlled.value) uncontrolledValue.value = ''
  props.onSearchChange?.('')
  handleOpenChange(false)
}

function registerItem() {
  const index = itemCount.value
  itemCount.value += 1
  return index
}

function unregisterItem() {
  itemCount.value = Math.max(0, itemCount.value - 1)
}

useClickOutside(rootRef, () => { if (openState.value) handleOpenChange(false) })

onUnmounted(() => { if (typingTimeout) clearTimeout(typingTimeout) })

provide(SearchKey, reactive({
  open: openState,
  onOpenChange: handleOpenChange,
  searchValue,
  onSearchChange: handleSearchChange,
  onSelect: handleSelect,
  loading: toRef(props, 'loading'),
  highlightedIndex,
  setHighlightedIndex: (index: number) => { highlightedIndex.value = index },
  itemCount,
  registerItem,
  unregisterItem,
  inputRef: inputNode,
  setInputNode: (node: HTMLInputElement | null) => { inputNode.value = node },
}))
</script>

<template>
  <div ref="rootRef" :data-loading="props.loading ? '' : undefined">
    <slot />
  </div>
</template>
