import React, { useState } from 'react';
import type { ImageProps } from './Image.types';

const Image = React.forwardRef<HTMLDivElement, ImageProps>(
	({ src, alt, position, onImageLoaded, className, ...rest }, ref) => {
		const [loaded, setLoaded] = useState(false);

		const handleLoad = () => {
			setLoaded(true);
			onImageLoaded?.();
		};

		const handleError = () => {
			setLoaded(true);
			onImageLoaded?.();
		};

		return (
			<div
				ref={ref}
				className={className}
				data-position={position}
				{...rest}>
				{!loaded && <div data-part='loader' />}
				<img
					src={src}
					alt={alt}
					data-part='image'
					data-loaded={loaded || undefined}
					style={!loaded ? { display: 'none' } : undefined}
					onLoad={handleLoad}
					onError={handleError}
				/>
			</div>
		);
	},
);

Image.displayName = 'Image';

export { Image };
