<script setup lang="ts">
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useSelectContext } from './keys'

defineOptions({ name: 'SelectTrigger' })

const ctx = useSelectContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => ctx.disabled })

function handleClick() {
  if (!ctx.disabled) ctx.setOpen(!ctx.open)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') ctx.setOpen(false)
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    ctx.setOpen(true)
  }
  handlers.onKeydown(e)
}
</script>

<template>
  <button
    type="button"
    aria-haspopup="listbox"
    :aria-expanded="ctx.open"
    :disabled="ctx.disabled"
    :data-state="ctx.open ? 'open' : 'closed'"
    v-bind="dataAttributes"
    @mouseenter="handlers.onMouseenter"
    @mouseleave="handlers.onMouseleave"
    @focus="handlers.onFocus"
    @blur="handlers.onBlur"
    @pointerdown="handlers.onPointerdown"
    @pointerup="handlers.onPointerup"
    @keydown="handleKeydown"
    @keyup="handlers.onKeyup"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
