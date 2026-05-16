<script setup lang="ts">
import { provide, reactive, ref, computed, toRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useDisclosure } from '@/composables/use-disclosure'
import { SelectKey } from './keys'

defineOptions({ name: 'SelectRoot' })

const props = withDefaults(defineProps<{
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
}>(), { value: undefined, defaultValue: '', onChange: undefined, disabled: false })

const rootRef = ref<HTMLElement | null>(null)
const labelMap = ref<Record<string, string>>({})
const persistedLabel = ref('')

const selectedValue = useControllableState<string>({
  value: () => props.value,
  defaultValue: props.defaultValue,
  onChange: (next) => props.onChange?.(next),
})

const { isOpen: open, setOpen, close } = useDisclosure()

const selectedLabel = computed(() => persistedLabel.value || labelMap.value[selectedValue.value] || '')

useClickOutside(rootRef, close)

function select(value: string, label: string) {
  selectedValue.value = value
  persistedLabel.value = label
  close()
}

function registerItem(value: string, label: string) {
  labelMap.value = { ...labelMap.value, [value]: label }
}

function unregisterItem(_value: string) {}

provide(SelectKey, reactive({
  open,
  selectedValue,
  selectedLabel,
  disabled: toRef(props, 'disabled'),
  setOpen,
  select,
  registerItem,
  unregisterItem,
}))
</script>

<template>
  <div
    ref="rootRef"
    :data-open="open ? '' : undefined"
    :data-disabled="props.disabled ? '' : undefined"
  >
    <slot />
  </div>
</template>
