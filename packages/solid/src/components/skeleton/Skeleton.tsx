import { Show, splitProps } from 'solid-js';
import type { SkeletonProps } from './Skeleton.types';

function Skeleton(props: SkeletonProps) {
	const [local, rest] = splitProps(props, ['loading', 'class', 'children', 'aria-label']);
	const loading = () => local.loading ?? true;
	const ariaLabel = () => local['aria-label'] ?? 'Loading';

	return (
		<Show
			when={loading()}
			fallback={local.children}>
			<div
				role='status'
				aria-busy='true'
				aria-live='polite'
				aria-label={ariaLabel()}
				class={local.class}
				data-loading=''
				{...rest}
			/>
		</Show>
	);
}

export { Skeleton };
