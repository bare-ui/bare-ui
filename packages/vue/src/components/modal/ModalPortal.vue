<script setup lang="ts">
import { useModalContext } from './keys'
import { useIsMounted } from '@/composables/use-is-mounted'

defineOptions({ name: 'ModalPortal' })

defineProps<{
  /** DOM node to render the modal into. Defaults to `document.body`. */
  container?: string | HTMLElement
}>()

const ctx = useModalContext()
// Teleport has no server-side target, so only mount it on the client. The server
// and first client render then agree (both render nothing) and hydration stays clean.
const mounted = useIsMounted()
</script>

<template>
  <Teleport v-if="mounted && ctx.open" :to="container || 'body'">
    <slot />
  </Teleport>
</template>
