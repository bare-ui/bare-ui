import { splitProps } from 'solid-js';
import type { BadgeProps } from './Badge.types';

function Badge(props: BadgeProps) {
	const [local, rest] = splitProps(props, ['count', 'class']);
	const count = () => local.count ?? 0;

	const displayCount = () => {
		const c = count();
		if (c > 0) return c > 9 ? '9+' : c;
		return 0;
	};

	return (
		<span
			class={local.class}
			data-count={count()}
			{...rest}>
			{displayCount()}
		</span>
	);
}

export { Badge };
