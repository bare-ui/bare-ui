<script setup lang="ts">
import { provide, reactive, ref, toRef } from 'vue';
import { AccordionKey } from './keys';

defineOptions({ name: 'AccordionRoot' })

const props = withDefaults(defineProps<{
	type: 'single' | 'multiple';
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
	collapsible?: boolean;
	disabled?: boolean;
}>(), {
	value: undefined,
	defaultValue: undefined,
	onChange: undefined,
	collapsible: false,
	disabled: false,
});

if (props.type === 'single') {
	const uncontrolledValue = ref<string>((props.defaultValue as string) ?? '');
	const isControlled = () => props.value !== undefined;
	const openValue = () => (isControlled() ? (props.value as string) : uncontrolledValue.value);

	const isOpen = (v: string) => openValue() === v;

	const toggle = (v: string) => {
		const next =
			openValue() === v ?
				props.collapsible ? ''
				:	openValue()
			:	v;
		if (!isControlled()) uncontrolledValue.value = next;
		(props.onChange as ((v: string) => void) | undefined)?.(next);
	};

	provide(AccordionKey, reactive({ isOpen, toggle, disabled: toRef(props, 'disabled') }));
} else {
	const uncontrolledValues = ref<string[]>((props.defaultValue as string[]) ?? []);
	const isControlled = () => props.value !== undefined;
	const openValues = () => (isControlled() ? (props.value as string[]) : uncontrolledValues.value);

	const isOpen = (v: string) => openValues().includes(v);

	const toggle = (v: string) => {
		const current = openValues();
		const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
		if (!isControlled()) uncontrolledValues.value = next;
		(props.onChange as ((v: string[]) => void) | undefined)?.(next);
	};

	provide(AccordionKey, reactive({ isOpen, toggle, disabled: toRef(props, 'disabled') }));
}
</script>

<template>
	<div>
		<slot />
	</div>
</template>
