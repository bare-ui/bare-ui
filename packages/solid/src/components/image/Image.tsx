import { createSignal, Show, splitProps } from 'solid-js';
import type { ImageProps } from './Image.types';

function Image(props: ImageProps) {
	const [local, rest] = splitProps(props, ['src', 'alt', 'position', 'onImageLoaded', 'class']);
	const [loaded, setLoaded] = createSignal(false);

	const handleLoad = () => {
		setLoaded(true);
		local.onImageLoaded?.();
	};

	const handleError = () => {
		setLoaded(true);
		local.onImageLoaded?.();
	};

	return (
		<div
			class={local.class}
			data-position={local.position}
			{...rest}>
			<Show when={!loaded()}>
				<div data-part='loader' />
			</Show>
			<img
				src={local.src}
				alt={local.alt}
				data-part='image'
				data-loaded={loaded() ? '' : undefined}
				style={!loaded() ? { display: 'none' } : undefined}
				onLoad={handleLoad}
				onError={handleError}
			/>
		</div>
	);
}

export { Image };
