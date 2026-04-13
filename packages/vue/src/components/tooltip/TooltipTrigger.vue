<script setup lang="ts">
import { useTooltipContext } from './keys'

defineOptions({ name: 'TooltipTrigger' })

const ctx = useTooltipContext()
</script>

<template>
  <span
    @mouseenter="ctx.setOpen(true)"
    @mouseleave="ctx.setOpen(false)"
    @focus="ctx.setOpen(true)"
    @blur="ctx.setOpen(false)"
  >
    <slot />
  </span>
</template>
