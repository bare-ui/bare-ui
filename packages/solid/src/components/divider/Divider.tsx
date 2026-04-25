import { splitProps } from 'solid-js';
import type { DividerProps } from './Divider.types';

/**
 * A headless visual or semantic divider.
 *
 * Exposes `data-orientation` so consumers can style horizontal vs vertical
 * variants purely via CSS:
 *
 * ```css
 * [data-orientation="horizontal"] { width: 100%; height: 1px; }
 * [data-orientation="vertical"]   { width: 1px;   height: 100%; }
 * ```
 *
 * @example
 * // Decorative (default) — screen readers skip it
 * <Divider class="bg-gray-200" />
 *
 * // Semantic — announced by screen readers
 * <Divider decorative={false} />
 *
 * // Vertical
 * <Divider orientation="vertical" class="h-full bg-gray-200" />
 */
function Divider(props: DividerProps) {
	const [local, rest] = splitProps(props, ['orientation', 'decorative']);
	const orientation = () => local.orientation ?? 'horizontal';
	const decorative = () => local.decorative ?? true;

	return (
		<div
			data-orientation={orientation()}
			role={decorative() ? 'none' : 'separator'}
			aria-hidden={decorative() ? true : undefined}
			aria-orientation={!decorative() ? orientation() : undefined}
			{...rest}
		/>
	);
}

export { Divider };
