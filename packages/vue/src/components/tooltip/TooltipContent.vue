<script setup lang="ts">
import { computed } from 'vue'
import { useTooltipContext } from './keys'

defineOptions({ name: 'TooltipContent' })

const props = withDefaults(defineProps<{
  side?: 'top' | 'bottom' | 'left' | 'right'
}>(), { side: 'top' })

const ctx = useTooltipContext()

const positionStyle = computed(() => {
  const base: Record<string, string | number> = {
    position: 'absolute',
    zIndex: 50,
    pointerEvents: 'none',
  }

  if (props.side === 'top') {
    base.bottom = '100%'
    base.left = '50%'
    base.transform = 'translateX(-50%)'
    base.marginBottom = '8px'
  } else if (props.side === 'bottom') {
    base.top = '100%'
    base.left = '50%'
    base.transform = 'translateX(-50%)'
    base.marginTop = '8px'
  } else if (props.side === 'left') {
    base.right = '100%'
    base.top = '50%'
    base.transform = 'translateY(-50%)'
    base.marginRight = '8px'
  } else if (props.side === 'right') {
    base.left = '100%'
    base.top = '50%'
    base.transform = 'translateY(-50%)'
    base.marginLeft = '8px'
  }

  return base
})
</script>

<template>
  <span
    :id="ctx.contentId"
    role="tooltip"
    :data-state="ctx.open ? 'open' : 'closed'"
    :data-side="side"
    :style="positionStyle"
  >
    <slot />
  </span>
</template>
