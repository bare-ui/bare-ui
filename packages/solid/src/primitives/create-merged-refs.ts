/**
 * Merges multiple ref setters into a single callback ref.
 *
 * Useful when a component receives an external ref prop but also needs its own internal ref
 * on the same element. All setters receive the latest element.
 *
 * In Solid, refs are set once via the `ref` attribute. Pass a signal setter, a variable
 * setter `(el) => (localEl = el)`, or `undefined`/`null` to skip.
 *
 * @example
 * function Component(props: { ref?: (el: HTMLDivElement) => void }) {
 *   let localEl: HTMLDivElement | undefined;
 *   const mergedRef = createMergedRefs((el) => (localEl = el), props.ref);
 *   return <div ref={mergedRef} />;
 * }
 */
export function createMergedRefs<T>(
	...refs: (((el: T) => void | unknown) | null | undefined)[]
): (el: T) => void {
	return (el: T) => {
		for (const ref of refs) {
			if (typeof ref === 'function') ref(el);
		}
	};
}
