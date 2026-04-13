<script setup lang="ts">
import { useDrawerContext } from './keys'

defineOptions({ name: 'DrawerPortal' })

defineProps<{ container?: string | HTMLElement }>()

const ctx = useDrawerContext()
</script>

<template>
  <Teleport v-if="ctx.open" :to="container || 'body'">
    <slot />
  </Teleport>
</template>
