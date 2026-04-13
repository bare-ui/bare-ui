<script setup lang="ts">
import { provide, reactive, ref, onMounted, onUnmounted, toRef } from 'vue';
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
let timeout: ReturnType<typeof setTimeout> | null = null;

const dismiss = () => {
	dismissed.value = true;
	props.onDismiss?.();
};

provide(AlertKey, reactive({ status: toRef(props, 'status'), dismiss }));

onMounted(() => {
	if (props.isAutoDismissable) {
		timeout = setTimeout(dismiss, props.dismissCountdown);
	}
});

onUnmounted(() => {
	if (timeout) clearTimeout(timeout);
});
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
