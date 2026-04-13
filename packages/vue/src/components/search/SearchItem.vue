<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useSearchContext } from './keys'
import type { SearchOption } from './Search.types'

defineOptions({ name: 'SearchItem' })

const props = defineProps<{ option: SearchOption }>()

const ctx = useSearchContext()
const { handlers, dataAttributes } = useInteractiveState()
const itemIndex = ref(-1)

onMounted(() => { itemIndex.value = ctx.registerItem() })
onUnmounted(() => { ctx.unregisterItem() })

const isHighlighted = computed(() => ctx.highlightedIndex === itemIndex.value)

function handleClick() {
  ctx.onSelect(props.option)
}

function handleKeydown(e: KeyboardEvent) {
  handlers.onKeydown(e)
  if (e.key === 'Enter') ctx.onSelect(props.option)
}
</script>

<template>
  <div
    role="option"
    :aria-selected="isHighlighted"
    :data-highlighted="isHighlighted ? '' : undefined"
    :tabindex="-1"
    v-bind="dataAttributes"
    @mouseenter="handlers.onMouseenter"
    @mouseleave="handlers.onMouseleave"
    @focus="handlers.onFocus"
    @blur="handlers.onBlur"
    @pointerdown="handlers.onPointerdown"
    @pointerup="handlers.onPointerup"
    @keydown="handleKeydown"
    @keyup="handlers.onKeyup"
    @click="handleClick"
  >
    <slot />
  </div>
</template>
