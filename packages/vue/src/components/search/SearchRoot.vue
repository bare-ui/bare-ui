<script setup lang="ts">
import { provide, reactive, ref, toRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useDebouncedCallback } from '@/composables/use-debounce'
import { SearchKey } from './keys'
import type { SearchOption } from './Search.types'

defineOptions({ name: 'SearchRoot' })

const props = withDefaults(defineProps<{
  /** Controlled open state of the results popover. */
  open?: boolean
  /** Initial open state of the results popover (uncontrolled). */
  defaultOpen?: boolean
  /** Called when the results popover opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled search input value. */
  value?: string
  /** Initial search input value (uncontrolled). */
  defaultSearchValue?: string
  /** Called when the search text changes, debounced by `searchDelay`. */
  onSearchChange?: (value: string) => void
  /** Called with the option the user chooses from the results. */
  onSelect?: (option: SearchOption) => void
  /** Called when the user submits the search (Enter with no result highlighted). */
  onSubmitSearch?: () => void
  /** Show a loading state while results are being fetched. */
  loading?: boolean
  /** Debounce delay in milliseconds before `onSearchChange` fires. */
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
