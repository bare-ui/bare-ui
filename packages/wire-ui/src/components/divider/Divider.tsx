import React from 'react';
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
 * <Divider className="bg-gray-200" />
 *
 * // Semantic — announced by screen readers
 * <Divider decorative={false} />
 *
 * // Vertical
 * <Divider orientation="vertical" className="h-full bg-gray-200" />
 */
const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
	({ orientation = 'horizontal', decorative = true, ...rest }, ref) => {
		const semanticProps =
			decorative ?
				{ role: 'none' as const, 'aria-hidden': true as const }
			:	{ role: 'separator' as const, 'aria-orientation': orientation };

		return (
			<div
				ref={ref}
				data-orientation={orientation}
				{...semanticProps}
				{...rest}
			/>
		);
	},
);

Divider.displayName = 'Divider';

export { Divider };
