<script setup lang="ts">
import { provide, reactive, ref } from 'vue';
import { AvatarKey } from './keys';
import type { AvatarImageStatus } from './Avatar.types';

defineOptions({ name: 'AvatarRoot' })

const imageStatus = ref<AvatarImageStatus>('loading');

const setImageStatus = (status: AvatarImageStatus) => {
	imageStatus.value = status;
};

provide(AvatarKey, reactive({ imageStatus, setImageStatus }));
</script>

<template>
	<div :data-status="imageStatus">
		<slot />
	</div>
</template>
