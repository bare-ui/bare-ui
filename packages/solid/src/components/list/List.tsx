import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { ListProps } from './List.types';

function List(props: ListProps) {
	const [local, rest] = splitProps(props, ['isOrdered', 'type', 'size', 'class', 'children']);
	const tag = () => (local.isOrdered ? 'ol' : 'ul');

	return (
		<Dynamic
			component={tag()}
			class={local.class}
			data-type={local.type}
			data-size={local.size}
			data-striped={local.type === 'striped' ? '' : undefined}
			data-divider={local.type === 'divider' ? '' : undefined}
			{...rest}>
			{local.children}
		</Dynamic>
	);
}

export { List };
