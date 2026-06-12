<script setup lang="ts">
import { useTooltipContext } from './keys'

defineOptions({ name: 'TooltipTrigger' })

const ctx = useTooltipContext()
</script>

<template>
  <span
    :aria-describedby="ctx.open ? ctx.contentId : undefined"
    @mouseenter="ctx.setOpen(true)"
    @mouseleave="ctx.setOpen(false)"
    @focus="ctx.setOpen(true)"
    @blur="ctx.setOpen(false)"
    @keydown="(e: KeyboardEvent) => { if (e.key === 'Escape' && ctx.open) ctx.setOpen(false) }"
  >
    <slot />
  </span>
</template>
