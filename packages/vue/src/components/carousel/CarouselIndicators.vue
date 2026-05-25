<script setup lang="ts">
import { computed } from 'vue';
import { useCarouselContext } from './keys';

defineOptions({ name: 'CarouselIndicators' })

const ctx = useCarouselContext();

const indicators = computed(() =>
	Array.from({ length: ctx.count }, (_, index) => ({
		index,
		selected: index === ctx.current,
	})),
);
</script>

<template>
	<div data-carousel-indicators="" style="display: contents">
		<template v-for="item in indicators" :key="item.index">
			<slot
				:index="item.index"
				:selected="item.selected"
				:scroll-to="() => ctx.scrollTo(item.index)"
			/>
		</template>
	</div>
</template>
