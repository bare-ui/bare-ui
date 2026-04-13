<script setup lang="ts">
import { useSelectContext } from './keys'

defineOptions({ name: 'SelectValue' })

const props = withDefaults(defineProps<{
  placeholder?: string
}>(), { placeholder: 'Select an option' })

const ctx = useSelectContext()
</script>

<template>
  <span :data-placeholder="!ctx.selectedLabel ? '' : undefined">
    {{ ctx.selectedLabel || props.placeholder }}
  </span>
</template>
