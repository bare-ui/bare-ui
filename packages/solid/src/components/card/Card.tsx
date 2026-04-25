import { splitProps } from 'solid-js';
import type { CardProps } from './Card.types';

function Card(props: CardProps) {
	const [local, rest] = splitProps(props, ['color', 'size', 'class', 'children']);

	return (
		<div
			class={local.class}
			data-color={local.color}
			data-size={local.size}
			{...rest}>
			{local.children}
		</div>
	);
}

export { Card };
