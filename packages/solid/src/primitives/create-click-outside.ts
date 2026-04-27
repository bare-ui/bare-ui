import { onCleanup, onMount, type Accessor } from 'solid-js';

/**
 * Fires `callback` when a click or touchstart occurs outside the referenced
 * element. Pass an accessor that returns the element so the listener picks up
 * ref changes.
 *
 * @example
 * let rootEl: HTMLDivElement | undefined;
 * createClickOutside(() => rootEl, () => setOpen(false));
 * return <div ref={rootEl}>...</div>;
 */
export function createClickOutside(
	elementRef: Accessor<HTMLElement | undefined | null>,
	callback: (event: MouseEvent | TouchEvent) => void,
) {
	onMount(() => {
		const handleClick = (event: MouseEvent | TouchEvent) => {
			const el = elementRef();
			if (el && !el.contains(event.target as Node)) {
				callback(event);
			}
		};

		document.addEventListener('click', handleClick);
		document.addEventListener('touchstart', handleClick);

		onCleanup(() => {
			document.removeEventListener('click', handleClick);
			document.removeEventListener('touchstart', handleClick);
		});
	});
}
