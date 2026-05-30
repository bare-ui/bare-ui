<script setup lang="ts">
import { useDrawerContext } from './keys'

defineOptions({ name: 'DrawerPortal' })

defineProps<{
  /** DOM node to render the drawer into. Defaults to `document.body`. */
  container?: string | HTMLElement
}>()

const ctx = useDrawerContext()
</script>

<template>
  <Teleport v-if="ctx.open" :to="container || 'body'">
    <slot />
  </Teleport>
</template>
