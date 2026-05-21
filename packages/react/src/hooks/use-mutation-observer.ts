import { useEffect, useRef, type RefObject } from 'react';

export interface UseMutationObserverOptions extends MutationObserverInit {
	/** Skip observation while false. */
	enabled?: boolean;
}

const DEFAULT_INIT: MutationObserverInit = {
	attributes: true,
	childList: true,
	subtree: false,
	characterData: false,
};

/**
 * Observes DOM mutations on `ref` and calls `callback` with the mutation records.
 *
 * Defaults to watching `attributes` and `childList` on the target only. Pass
 * `subtree: true` to watch descendants, plus the standard MutationObserverInit fields.
 *
 * @example
 * useMutationObserver(ref, (records) => {
 *   for (const r of records) console.log(r.type, r.target)
 * }, { childList: true, subtree: true })
 */
export function useMutationObserver<T extends Node>(
	ref: RefObject<T | null>,
	callback: MutationCallback,
	options: UseMutationObserverOptions = {},
): void {
	const { enabled = true, ...init } = options;
	const callbackRef = useRef(callback);
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// Serialize init so option changes are detectable without identity churn.
	const initKey = JSON.stringify(init);

	useEffect(() => {
		if (!enabled || typeof MutationObserver === 'undefined') return;
		const target = ref.current;
		if (!target) return;

		const observer = new MutationObserver((records, obs) => callbackRef.current(records, obs));
		observer.observe(target, Object.keys(init).length > 0 ? init : DEFAULT_INIT);
		return () => observer.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref, enabled, initKey]);
}
