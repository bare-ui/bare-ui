<script setup lang="ts">
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useDropdownContext } from './keys'

defineOptions({ name: 'DropdownTrigger' })

const ctx = useDropdownContext()
const { handlers, dataAttributes } = useInteractiveState()

function handleClick() {
  ctx.onOpenChange(!ctx.open)
}

function onKeyDown(e: KeyboardEvent) {
  handlers.onKeydown(e)
  if (!ctx.open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault()
    ctx.onOpenChange(true)
  }
}
</script>

<template>
  <button
    type="button"
    aria-haspopup="menu"
    :aria-expanded="ctx.open"
    :data-state="ctx.open ? 'open' : 'closed'"
    v-bind="dataAttributes"
    @mouseenter="handlers.onMouseenter"
    @mouseleave="handlers.onMouseleave"
    @focus="handlers.onFocus"
    @blur="handlers.onBlur"
    @pointerdown="handlers.onPointerdown"
    @pointerup="handlers.onPointerup"
    @keydown="onKeyDown"
    @keyup="handlers.onKeyup"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
