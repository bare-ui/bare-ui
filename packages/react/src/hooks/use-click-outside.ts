import { useEffect, type RefObject } from 'react';

export function useClickOutside(
	elementRef: RefObject<HTMLElement | null>,
	callback: (event: MouseEvent | TouchEvent) => void,
) {
	useEffect(() => {
		function handleClick(event: MouseEvent | TouchEvent) {
			const el = elementRef.current;
			if (el && !el.contains(event.target as Node)) {
				callback(event);
			}
		}

		document.addEventListener('click', handleClick);
		document.addEventListener('touchstart', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
			document.removeEventListener('touchstart', handleClick);
		};
	}, [elementRef, callback]);
}
