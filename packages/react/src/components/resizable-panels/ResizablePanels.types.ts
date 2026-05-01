import React from 'react';

export type PanelOrientation = 'horizontal' | 'vertical';

export interface PanelGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	orientation?: PanelOrientation;
	/** Controlled sizes (percentages, summing to ~100). One per Panel. */
	sizes?: number[];
	/** Initial sizes (uncontrolled). */
	defaultSizes?: number[];
	/** Called whenever sizes change. */
	onSizesChange?: (sizes: number[]) => void;
}

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Default size in percent of the group. */
	defaultSize?: number;
	/** Minimum size in percent. */
	minSize?: number;
	/** Maximum size in percent. */
	maxSize?: number;
}

export interface PanelHandleProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Disable resizing on this handle. */
	disabled?: boolean;
}

export interface PanelGroupContextValue {
	orientation: PanelOrientation;
	sizes: number[];
	registerPanel: (config: PanelConfig) => number;
	unregisterPanel: (index: number) => void;
	startDrag: (handleIndex: number, pointer: { x: number; y: number }) => void;
	getContainerRect: () => DOMRect | null;
}

export interface PanelConfig {
	defaultSize?: number;
	minSize?: number;
	maxSize?: number;
}
