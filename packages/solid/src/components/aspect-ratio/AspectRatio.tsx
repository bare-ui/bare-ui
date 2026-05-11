import { splitProps, type JSX } from 'solid-js';
import type { AspectRatioProps } from './AspectRatio.types';

function AspectRatio(props: AspectRatioProps) {
	const [local, rest] = splitProps(props, ['ratio', 'children', 'style', 'class']);
	const ratio = () => local.ratio ?? 1;

	const mergedStyle = (): JSX.CSSProperties | string | undefined => {
		const ours: JSX.CSSProperties = { position: 'relative', width: '100%', 'aspect-ratio': String(ratio()) };
		const userStyle = local.style;
		if (typeof userStyle === 'string' || !userStyle) return ours;
		return { ...ours, ...(userStyle as JSX.CSSProperties) };
	};

	return (
		<div
			class={local.class}
			data-ratio={ratio()}
			style={mergedStyle()}
			{...rest}>
			{local.children}
		</div>
	);
}

export { AspectRatio };
