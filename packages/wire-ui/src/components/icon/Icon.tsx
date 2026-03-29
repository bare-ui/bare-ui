import React from 'react';
import type { IconProps } from './Icon.types';

function parseSvg(raw: string): { viewBox: string; content: string } {
	const viewBoxMatch = raw.match(/viewBox="([^"]+)"/i);
	const viewBox = viewBoxMatch?.[1] ?? '0 0 24 24';
	const content = raw.replace(/^[\s\S]*?<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
	return { viewBox, content };
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ type, size, label, icons, className, ...rest }, ref) => {
	const rawSvg = icons?.[type];

	if (!rawSvg) {
		return null;
	}

	const { viewBox, content } = parseSvg(rawSvg);
	const isDecorative = !label;

	return (
		<svg
			ref={ref}
			className={className}
			viewBox={viewBox}
			aria-label={label}
			aria-hidden={isDecorative ? 'true' : undefined}
			role='img'
			focusable='false'
			data-name={type}
			data-size={size}
			dangerouslySetInnerHTML={{ __html: content }}
			{...rest}
		/>
	);
});

Icon.displayName = 'Icon';

export { Icon };
