<script setup lang="ts">
import { computed, provide } from 'vue';
import { useId } from '@/composables/use-id';
import { useCommandContext, CommandGroupKey } from './keys';

defineOptions({ name: 'CommandGroup' });

withDefaults(defineProps<{
	heading?: string;
}>(), {
	heading: undefined,
});

const ctx = useCommandContext();
const groupId = useId('command-group');
const headingId = `${groupId}-heading`;

const hasVisible = computed(() => ctx.groupHasVisible(groupId));

provide(CommandGroupKey, { groupId });
</script>

<template>
	<div
		role="group"
		:aria-labelledby="heading ? headingId : undefined"
		:hidden="!hasVisible ? true : undefined"
	>
		<div
			v-if="heading != null"
			:id="headingId"
			data-command-group-heading=""
			aria-hidden="true"
		>
			{{ heading }}
		</div>
		<slot />
	</div>
</template>
