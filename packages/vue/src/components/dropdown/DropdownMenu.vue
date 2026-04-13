<script setup lang="ts">
import { useDropdownContext } from './keys'
import type { DropdownPosition } from './Dropdown.types'

defineOptions({ name: 'DropdownMenu' })

defineProps<{ position?: DropdownPosition }>()

const ctx = useDropdownContext()
</script>

<template>
  <div v-if="ctx.open" role="menu" :data-state="ctx.open ? 'open' : 'closed'" :data-position="position">
    <slot />
  </div>
</template>
