<script setup lang="ts">
import { provide, reactive, ref, computed, toRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { SelectKey } from './keys'

defineOptions({ name: 'SelectRoot' })

const props = withDefaults(defineProps<{
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
}>(), { value: undefined, defaultValue: '', onChange: undefined, disabled: false })

const rootRef = ref<HTMLElement | null>(null)
const uncontrolledValue = ref(props.defaultValue)
const open = ref(false)
const labelMap = ref<Record<string, string>>({})
const persistedLabel = ref('')

const isControlled = computed(() => props.value !== undefined)
const selectedValue = computed(() => isControlled.value ? props.value! : uncontrolledValue.value)
const selectedLabel = computed(() => persistedLabel.value || labelMap.value[selectedValue.value] || '')

useClickOutside(rootRef, () => { open.value = false })

function select(value: string, label: string) {
  if (!isControlled.value) uncontrolledValue.value = value
  persistedLabel.value = label
  props.onChange?.(value)
  open.value = false
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
  setOpen: (v: boolean) => { open.value = v },
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
