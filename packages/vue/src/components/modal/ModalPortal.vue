<script setup lang="ts">
import { useModalContext } from './keys'

defineOptions({ name: 'ModalPortal' })

defineProps<{
  /** DOM node to render the modal into. Defaults to `document.body`. */
  container?: string | HTMLElement
}>()

const ctx = useModalContext()
</script>

<template>
  <Teleport v-if="ctx.open" :to="container || 'body'">
    <slot />
  </Teleport>
</template>
