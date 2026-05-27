<script setup lang="ts">
import { computed } from 'vue';
import { useTabsContext } from './keys';

defineOptions({ name: 'TabsContent' })

const props = withDefaults(defineProps<{
	value: string;
	forceMount?: boolean;
}>(), { forceMount: false })

const ctx = useTabsContext()

const isActive = computed(() => ctx.value === props.value)
const shouldRender = computed(() => isActive.value || props.forceMount)
const contentId = computed(() => `${ctx.baseId}-content-${props.value}`)
const triggerId = computed(() => `${ctx.baseId}-trigger-${props.value}`)
</script>

<template>
	<div
		v-if="shouldRender"
		:id="contentId"
		role="tabpanel"
		:aria-labelledby="triggerId"
		:tabindex="0"
		:hidden="!isActive && props.forceMount ? true : undefined"
		:data-state="isActive ? 'active' : 'inactive'"
		:data-orientation="ctx.orientation"
	>
		<slot />
	</div>
</template>
