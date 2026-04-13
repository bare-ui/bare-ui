<script setup lang="ts">
import { useSearchContext } from './keys'

defineOptions({ name: 'SearchEmpty' })

const ctx = useSearchContext()
</script>

<template>
  <div v-if="ctx.itemCount === 0 && !ctx.loading">
    <slot />
  </div>
</template>
