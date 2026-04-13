<script setup lang="ts">
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useDrawerContext } from './keys'

defineOptions({ name: 'DrawerClose' })

const ctx = useDrawerContext()
const { handlers, dataAttributes } = useInteractiveState()
</script>

<template>
  <button
    type="button"
    v-bind="dataAttributes"
    @mouseenter="handlers.onMouseenter"
    @mouseleave="handlers.onMouseleave"
    @focus="handlers.onFocus"
    @blur="handlers.onBlur"
    @pointerdown="handlers.onPointerdown"
    @pointerup="handlers.onPointerup"
    @keydown="handlers.onKeydown"
    @keyup="handlers.onKeyup"
    @click="ctx.onOpenChange(false)"
  >
    <slot />
  </button>
</template>
