<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useFocusTrap } from '@/composables/use-focus-trap'
import { useDrawerContext } from './keys'

defineOptions({ name: 'DrawerContent' })

const ctx = useDrawerContext()
const contentRef = useTemplateRef<HTMLDivElement>('contentRef')

useFocusTrap(contentRef, { active: computed(() => ctx.open) })
</script>

<template>
  <div ref="contentRef" role="dialog" aria-modal="true" tabindex="-1" :data-state="ctx.open ? 'open' : 'closed'" @click.stop>
    <slot />
  </div>
</template>
