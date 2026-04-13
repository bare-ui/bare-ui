<script setup lang="ts">
import { provide, reactive, ref, computed } from 'vue'
import { CheckboxKey } from './keys'
import { Helper } from '@/utils/helper'

defineOptions({ name: 'CheckboxRoot' })

const props = withDefaults(defineProps<{
  value?: (string | number)[]
  defaultValue?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  name?: string
}>(), {
  defaultValue: () => [],
})

const uncontrolledValue = ref([...props.defaultValue])
const groupName = props.name || Helper.generateUUID()
const isControlled = computed(() => props.value !== undefined)
const values = computed(() => isControlled.value ? props.value! : uncontrolledValue.value)

function isChecked(itemValue: string | number) {
  return values.value.some((v) => String(v) === String(itemValue))
}

function toggle(itemValue: string | number) {
  const currentValues = [...values.value]
  const index = currentValues.findIndex((v) => String(v) === String(itemValue))

  if (index === -1) {
    currentValues.push(itemValue)
  } else {
    currentValues.splice(index, 1)
  }

  if (!isControlled.value) uncontrolledValue.value = currentValues
  props.onChange?.(currentValues)
}

provide(CheckboxKey, reactive({ values, name: groupName, toggle, isChecked }))
</script>

<template>
  <div role="group"><slot /></div>
</template>
