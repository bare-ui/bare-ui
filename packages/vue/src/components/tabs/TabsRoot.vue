<script setup lang="ts">
import { provide, reactive, toRef } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { useId } from '@/composables/use-id';
import { TabsKey } from './keys';
import type { TabsActivationMode, TabsOrientation } from './Tabs.types';

defineOptions({ name: 'TabsRoot' })

const props = withDefaults(defineProps<{
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	orientation?: TabsOrientation;
	activationMode?: TabsActivationMode;
}>(), {
	value: undefined,
	defaultValue: undefined,
	onChange: undefined,
	orientation: 'horizontal',
	activationMode: 'automatic',
})

const selected = useControllableState<string>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? '',
	onChange: (v) => props.onChange?.(v),
})

function setValue(next: string) {
	selected.value = next
}

const triggers = new Map<string, HTMLButtonElement | null>()
let order: string[] = []

function registerTrigger(triggerValue: string, el: HTMLButtonElement | null) {
	if (el) {
		triggers.set(triggerValue, el)
		if (!order.includes(triggerValue)) order.push(triggerValue)
	} else {
		triggers.delete(triggerValue)
		order = order.filter((v) => v !== triggerValue)
	}
}

function getTriggerOrder() {
	return order.slice()
}

const baseId = useId('tabs')

provide(TabsKey, reactive({
	value: selected,
	setValue,
	orientation: toRef(props, 'orientation'),
	activationMode: toRef(props, 'activationMode'),
	registerTrigger,
	getTriggerOrder,
	baseId,
}))
</script>

<template>
	<div :data-orientation="orientation">
		<slot />
	</div>
</template>
