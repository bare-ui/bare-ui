import React from 'react';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Width-to-height ratio. e.g. 16/9 (≈1.777) or just 1 for a square. */
	ratio?: number;
}
