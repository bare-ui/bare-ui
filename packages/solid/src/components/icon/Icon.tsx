import { Show, splitProps } from 'solid-js';
import type { IconProps } from './Icon.types';

function parseSvg(raw: string): { viewBox: string; content: string } {
	const viewBoxMatch = raw.match(/viewBox="([^"]+)"/i);
	const viewBox = viewBoxMatch?.[1] ?? '0 0 24 24';
	const content = raw.replace(/^[\s\S]*?<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
	return { viewBox, content };
}

function Icon(props: IconProps) {
	const [local, rest] = splitProps(props, ['type', 'size', 'label', 'icons', 'class']);

	const rawSvg = () => local.icons?.[local.type];
	const parsed = () => {
		const raw = rawSvg();
		return raw ? parseSvg(raw) : null;
	};
	const isDecorative = () => !local.label;

	return (
		<Show when={parsed()}>
			{(p) => (
				<svg
					class={local.class}
					viewBox={p().viewBox}
					aria-label={local.label}
					aria-hidden={isDecorative() ? 'true' : undefined}
					role='img'
					// `focusable` prevents IE/Edge from putting the SVG in the tab order;
					// it isn't in Solid's SVG attr types so spread it as a generic attribute.
					{...{ focusable: 'false' }}
					data-name={local.type}
					data-size={local.size}
					// Consumer-provided SVG sources are bundled assets, not user input.
					// eslint-disable-next-line solid/no-innerhtml
					innerHTML={p().content}
					{...rest}
				/>
			)}
		</Show>
	);
}

export { Icon };
