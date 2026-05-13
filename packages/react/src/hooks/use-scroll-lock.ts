import { useLayoutEffect } from 'react';

let lockCount = 0;
let originalBodyOverflow = '';
let originalBodyPaddingRight = '';

function getScrollbarWidth(): number {
	return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Locks document scrolling while `active` is true.
 *
 * Multiple consumers may call this at once (e.g. nested modals); scrolling is restored
 * only after the last lock is released. Compensates for the disappearing scrollbar by
 * adding equivalent padding to `<body>` to prevent layout shift.
 *
 * @example
 * useScrollLock(open)
 */
export function useScrollLock(active: boolean) {
	useLayoutEffect(() => {
		if (!active) return;

		if (lockCount === 0) {
			const scrollbarWidth = getScrollbarWidth();
			originalBodyOverflow = document.body.style.overflow;
			originalBodyPaddingRight = document.body.style.paddingRight;
			document.body.style.overflow = 'hidden';
			if (scrollbarWidth > 0) {
				const currentPadding = parseInt(window.getComputedStyle(document.body).paddingRight, 10) || 0;
				document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
			}
		}
		lockCount += 1;

		return () => {
			lockCount -= 1;
			if (lockCount === 0) {
				document.body.style.overflow = originalBodyOverflow;
				document.body.style.paddingRight = originalBodyPaddingRight;
			}
		};
	}, [active]);
}
