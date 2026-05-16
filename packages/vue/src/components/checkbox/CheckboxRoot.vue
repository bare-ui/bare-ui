<script setup lang="ts">
import { provide, reactive, computed } from 'vue'
import { CheckboxKey } from './keys'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'

defineOptions({ name: 'CheckboxRoot' })

const props = withDefaults(defineProps<{
  value?: (string | number)[]
  defaultValue?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  name?: string
}>(), {
  defaultValue: () => [],
})

const values = useControllableState<(string | number)[]>({
  value: () => props.value,
  defaultValue: [...props.defaultValue],
  onChange: (next) => props.onChange?.(next),
})
const groupName = useId('checkbox-group', props.name)
const valuesView = computed(() => values.value)

function isChecked(itemValue: string | number) {
  return values.value.some((v) => String(v) === String(itemValue))
}

function toggle(itemValue: string | number) {
  const currentValues = [...values.value]
  const index = currentValues.findIndex((v) => String(v) === String(itemValue))

  if (index === -1) currentValues.push(itemValue)
  else currentValues.splice(index, 1)

  values.value = currentValues
}

provide(CheckboxKey, reactive({ values: valuesView, name: groupName, toggle, isChecked }))
</script>

<template>
  <div role="group"><slot /></div>
</template>
