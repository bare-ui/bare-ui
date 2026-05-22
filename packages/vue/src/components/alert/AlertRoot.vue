<script setup lang="ts">
import { provide, reactive, ref, toRef } from 'vue';
import { useTimeout } from '@/composables/use-timeout';
import { AlertKey } from './keys';

defineOptions({ name: 'AlertRoot' })

const props = withDefaults(defineProps<{
	status?: string;
	isAutoDismissable?: boolean;
	dismissCountdown?: number;
	onDismiss?: () => void;
}>(), {
	status: undefined,
	isAutoDismissable: false,
	dismissCountdown: 3000,
	onDismiss: undefined,
});

const dismissed = ref(false);

const dismiss = () => {
	dismissed.value = true;
	props.onDismiss?.();
};

provide(AlertKey, reactive({ status: toRef(props, 'status'), dismiss }));

useTimeout(dismiss, () => props.dismissCountdown, { autoStart: props.isAutoDismissable });
</script>

<template>
	<div
		v-if="!dismissed"
		role="alert"
		:data-status="status"
	>
		<slot />
	</div>
</template>
