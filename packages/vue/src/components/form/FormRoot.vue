<script setup lang="ts">
defineOptions({ name: 'FormRoot' })
</script>

<template>
	<form novalidate>
		<slot />
	</form>
</template>
