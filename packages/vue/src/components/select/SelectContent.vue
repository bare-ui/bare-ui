<script setup lang="ts">
import { useSelectContext } from './keys'

defineOptions({ name: 'SelectContent' })

const ctx = useSelectContext()
</script>

<template>
  <div v-if="ctx.open" role="listbox" data-state="open">
    <slot />
  </div>
</template>
