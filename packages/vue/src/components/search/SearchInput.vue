<script setup lang="ts">
import { useSearchContext } from './keys'

defineOptions({ name: 'SearchInput' })

const ctx = useSearchContext()

function handleInput(e: Event) {
  ctx.onSearchChange((e.target as HTMLInputElement).value)
}

function handleKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (ctx.itemCount > 0) {
        ctx.setHighlightedIndex(
          ctx.highlightedIndex < ctx.itemCount - 1 ? ctx.highlightedIndex + 1 : 0,
        )
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (ctx.itemCount > 0) {
        ctx.setHighlightedIndex(
          ctx.highlightedIndex > 0 ? ctx.highlightedIndex - 1 : ctx.itemCount - 1,
        )
      }
      break
    case 'Escape':
      ctx.onOpenChange(false)
      ctx.inputRef?.blur()
      break
  }
}
</script>

<template>
  <input
    type="text"
    :value="ctx.searchValue"
    @focus="ctx.onOpenChange(true)"
    @input="handleInput"
    @keydown="handleKeydown"
  >
</template>
