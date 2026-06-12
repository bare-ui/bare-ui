<script setup lang="ts">
import { ref } from 'vue'
import { useDropdownContext } from './keys'
import { useMenuNavigation } from '@/composables/use-menu-navigation'
import type { DropdownPosition } from './Dropdown.types'

defineOptions({ name: 'DropdownMenu' })

defineProps<{
  /** Horizontal alignment of the menu relative to the trigger. */
  position?: DropdownPosition
}>()

const ctx = useDropdownContext()
const menuRef = ref<HTMLElement | null>(null)
const { onKeyDown } = useMenuNavigation(menuRef, {
  open: () => ctx.open,
  onClose: () => ctx.onOpenChange(false),
})
</script>

<template>
  <div
    v-if="ctx.open"
    ref="menuRef"
    role="menu"
    :data-state="ctx.open ? 'open' : 'closed'"
    :data-position="position"
    @keydown="onKeyDown"
  >
    <slot />
  </div>
</template>
