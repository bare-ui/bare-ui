<script setup lang="ts">
import { useDrawerContext } from './keys'

defineOptions({ name: 'DrawerOverlay' })

const ctx = useDrawerContext()
</script>

<template>
  <div :data-state="ctx.open ? 'open' : 'closed'" @click="ctx.onOpenChange(false)">
    <slot />
  </div>
</template>
