import { watch, onUnmounted, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

export interface UseMutationObserverOptions extends MutationObserverInit {
	/** Skip observation while false. */
	enabled?: MaybeRefOrGetter<boolean>;
}

const DEFAULT_INIT: MutationObserverInit = {
	attributes: true,
	childList: true,
	subtree: false,
	characterData: false,
};

/**
 * Observes DOM mutations on `targetRef` and calls `callback` with the mutation records.
 *
 * Defaults to watching `attributes` and `childList` on the target only. Pass
 * `subtree: true` to watch descendants, plus the standard MutationObserverInit fields.
 *
 * @example
 * useMutationObserver(el, (records) => {
 *   for (const r of records) console.log(r.type, r.target)
 * }, { childList: true, subtree: true })
 */
export function useMutationObserver<T extends Node>(
	targetRef: Ref<T | null>,
	callback: MutationCallback,
	options: UseMutationObserverOptions = {},
): void {
	const { enabled, ...init } = options;
	const observerInit = Object.keys(init).length > 0 ? init : DEFAULT_INIT;
	let observer: MutationObserver | null = null;

	function disconnect() {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	}

	watch(
		[targetRef, () => toValue(enabled) ?? true],
		([target, isEnabled]) => {
			disconnect();
			if (!isEnabled || !target || typeof MutationObserver === 'undefined') return;
			observer = new MutationObserver((records, obs) => callback(records, obs));
			observer.observe(target, observerInit);
		},
		{ immediate: true, flush: 'post' },
	);

	onUnmounted(disconnect);
}
