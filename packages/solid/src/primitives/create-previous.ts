import { createSignal, createEffect, type Accessor } from 'solid-js';

/**
 * Returns an accessor for the value `value` held during the previous reactive update.
 * Returns `undefined` before the first update.
 *
 * Pass the input as an accessor so Solid can track changes reactively.
 *
 * @example
 * const prev = createPrevious(() => count())
 * createEffect(() => {
 *   if (prev() !== undefined && prev() !== count()) onChange(prev(), count())
 * })
 */
export function createPrevious<T>(value: Accessor<T>): Accessor<T | undefined> {
	const [previous, setPrevious] = createSignal<T | undefined>(undefined);
	let current: T = value();

	createEffect(() => {
		const next = value();
		setPrevious(() => current);
		current = next;
	});

	return previous;
}
