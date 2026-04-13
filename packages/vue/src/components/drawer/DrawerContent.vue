<script setup lang="ts">
import { useDrawerContext } from './keys'

defineOptions({ name: 'DrawerContent' })

const ctx = useDrawerContext()
</script>

<template>
  <div role="dialog" aria-modal="true" :data-state="ctx.open ? 'open' : 'closed'" @click.stop>
    <slot />
  </div>
</template>
