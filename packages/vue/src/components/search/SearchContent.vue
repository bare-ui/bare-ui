<script setup lang="ts">
import { useSearchContext } from './keys'

defineOptions({ name: 'SearchContent' })

const ctx = useSearchContext()
</script>

<template>
  <div v-if="ctx.open" role="listbox" :data-state="ctx.open ? 'open' : 'closed'">
    <slot />
  </div>
</template>
