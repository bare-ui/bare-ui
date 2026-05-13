import { useCallback, type MutableRefObject, type Ref, type RefCallback } from 'react';

type AnyRef<T> = Ref<T> | MutableRefObject<T | null> | undefined | null;

function assignRef<T>(ref: AnyRef<T>, value: T | null) {
	if (!ref) return;
	if (typeof ref === 'function') {
		ref(value);
	} else {
		(ref as MutableRefObject<T | null>).current = value;
	}
}

/**
 * Merges multiple refs into a single callback ref.
 *
 * Useful when a component receives a forwarded ref but also needs its own internal ref
 * on the same element. Both refs receive the latest value. The callback's identity depends
 * on each passed ref — since `useRef`/`forwardRef` refs are stable across renders, the
 * resulting callback is also stable in normal usage.
 *
 * @example
 * const Component = forwardRef<HTMLDivElement>((props, forwardedRef) => {
 *   const localRef = useRef<HTMLDivElement>(null)
 *   const mergedRef = useMergedRefs(localRef, forwardedRef)
 *   return <div ref={mergedRef} />
 * })
 */
export function useMergedRefs<T>(...refs: AnyRef<T>[]): RefCallback<T> {
	return useCallback(
		(value: T | null) => {
			for (const ref of refs) assignRef(ref, value);
		},
		// Each ref identity is stable across renders in normal usage; depending on the
		// spread keeps the callback stable when those identities don't change.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs,
	);
}
