<script setup lang="ts">
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useModalContext } from './keys'

defineOptions({ name: 'ModalClose' })

const ctx = useModalContext()
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
