<script setup lang="ts">
import { useModalContext } from './keys'

defineOptions({ name: 'ModalContent' })

const ctx = useModalContext()
</script>

<template>
  <div role="dialog" aria-modal="true" :data-state="ctx.open ? 'open' : 'closed'" @click.stop>
    <slot />
  </div>
</template>
