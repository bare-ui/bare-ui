<script setup lang="ts">
import { useModalContext } from './keys'

defineOptions({ name: 'ModalPortal' })

defineProps<{ container?: string | HTMLElement }>()

const ctx = useModalContext()
</script>

<template>
  <Teleport v-if="ctx.open" :to="container || 'body'">
    <slot />
  </Teleport>
</template>
