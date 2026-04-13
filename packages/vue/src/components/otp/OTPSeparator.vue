<script setup lang="ts">
defineOptions({ name: 'OTPSeparator' })
</script>

<template>
	<span aria-hidden="true" role="separator">
		<slot>&#8211;</slot>
	</span>
</template>
