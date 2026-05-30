<script setup lang="ts">
import { provide, reactive, computed } from 'vue'
import { RadioKey } from './keys'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'

defineOptions({ name: 'RadioRoot' })

const props = withDefaults(defineProps<{
  /** Controlled selected value. */
  value?: string | number
  /** Initially selected value (uncontrolled). */
  defaultValue?: string | number
  /** Called with the newly selected value. */
  onChange?: (value: string | number) => void
  /** Form field name shared by every radio in the group. */
  name?: string
}>(), {})

const selectedValue = useControllableState<string | number | undefined>({
  value: () => props.value,
  defaultValue: props.defaultValue,
  onChange: (next) => {
    if (next !== undefined) props.onChange?.(next)
  },
})
const groupName = useId('radio-group', props.name)
const selectedValueView = computed(() => selectedValue.value)

function isSelected(itemValue: string | number) {
  const sv = selectedValue.value
  if (sv === undefined || sv === null) return false
  return String(sv) === String(itemValue)
}

function select(itemValue: string | number) {
  selectedValue.value = itemValue
}

provide(RadioKey, reactive({ selectedValue: selectedValueView, name: groupName, select, isSelected }))
</script>

<template>
  <div role="radiogroup"><slot /></div>
</template>
