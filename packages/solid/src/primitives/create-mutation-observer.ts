import { createEffect, onCleanup, type Accessor } from 'solid-js';

export interface CreateMutationObserverOptions extends MutationObserverInit {
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
 * Observes DOM mutations on the target node and calls `callback` with the mutation records.
 *
 * Defaults to watching `attributes` and `childList` on the target only. Pass
 * `subtree: true` to watch descendants, plus the standard MutationObserverInit fields.
 *
 * Pass `options` with getters to make `enabled` reactive:
 * `{ get enabled() { return shouldObserve() } }`
 *
 * @example
 * let el: HTMLDivElement | undefined;
 * createMutationObserver(() => el, (records) => {
 *   for (const r of records) console.log(r.type, r.target)
 * }, { childList: true, subtree: true })
 */
export function createMutationObserver<T extends Node>(
	target: Accessor<T | null | undefined>,
	callback: MutationCallback,
	options: CreateMutationObserverOptions = {},
): void {
	createEffect(() => {
		const { enabled = true, ...init } = options;
		if (!enabled || typeof MutationObserver === 'undefined') return;
		const node = target();
		if (!node) return;

		const observer = new MutationObserver((records, obs) => callback(records, obs));
		observer.observe(node, Object.keys(init).length > 0 ? init : DEFAULT_INIT);
		onCleanup(() => observer.disconnect());
	});
}
