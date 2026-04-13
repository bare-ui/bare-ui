import { onMounted, onUnmounted, type Ref } from 'vue';

export function useClickOutside(
	elementRef: Ref<HTMLElement | null>,
	callback: (event: MouseEvent | TouchEvent) => void,
) {
	function handleClick(event: MouseEvent | TouchEvent) {
		const el = elementRef.value;
		if (el && !el.contains(event.target as Node)) {
			callback(event);
		}
	}

	onMounted(() => {
		document.addEventListener('click', handleClick);
		document.addEventListener('touchstart', handleClick);
	});

	onUnmounted(() => {
		document.removeEventListener('click', handleClick);
		document.removeEventListener('touchstart', handleClick);
	});
}
