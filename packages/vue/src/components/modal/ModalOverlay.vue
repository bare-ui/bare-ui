<script setup lang="ts">
import { useModalContext } from './keys'

defineOptions({ name: 'ModalOverlay' })

const ctx = useModalContext()
</script>

<template>
  <div :data-state="ctx.open ? 'open' : 'closed'" @click="ctx.onOpenChange(false)">
    <slot />
  </div>
</template>
