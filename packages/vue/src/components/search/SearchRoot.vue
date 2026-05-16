<script setup lang="ts">
import { provide, reactive, ref, toRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useDebouncedCallback } from '@/composables/use-debounce'
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
const highlightedIndex = ref(-1)
const itemCount = ref(0)
const inputNode = ref<HTMLInputElement | null>(null)

const openState = useControllableState<boolean>({
  value: () => props.open,
  defaultValue: props.defaultOpen,
  onChange: (next) => props.onOpenChange?.(next),
})

const searchValue = useControllableState<string>({
  value: () => props.value,
  defaultValue: props.defaultSearchValue,
  onChange: (next) => props.onSearchChange?.(next),
})

function handleOpenChange(value: boolean) {
  openState.value = value
  if (!value) highlightedIndex.value = -1
}

const debouncedSubmit = useDebouncedCallback(() => {
  props.onSubmitSearch?.()
}, props.searchDelay)

function handleSearchChange(value: string) {
  searchValue.value = value
  debouncedSubmit()
}

function handleSelect(option: SearchOption) {
  props.onSelect?.(option)
  searchValue.value = ''
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
