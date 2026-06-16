import type { ComputedRef } from 'vue'

export type PanelOrientation = 'horizontal' | 'vertical'

export interface PanelGroupProps {
	orientation?: PanelOrientation
	/** Controlled sizes (percentages, summing to ~100). One per Panel. */
	sizes?: number[]
	/** Initial sizes (uncontrolled). */
	defaultSizes?: number[]
	/** Called whenever sizes change. */
	onSizesChange?: (sizes: number[]) => void
}

export interface PanelProps {
	/** Default size in percent of the group. */
	defaultSize?: number
	/** Minimum size in percent. */
	minSize?: number
	/** Maximum size in percent. */
	maxSize?: number
}

export interface PanelHandleProps {
	disabled?: boolean
	'aria-label'?: string
}

export interface PanelConfig {
	defaultSize?: number
	minSize?: number
	maxSize?: number
}

export interface InternalGroupContext {
	orientation: ComputedRef<PanelOrientation>
	getPanelSize: (id: string) => number
	getPanelIndex: (id: string) => number
	getHandleValues: (id: string) => { now: number; min: number; max: number } | null
	registerPanel: (id: string, config: PanelConfig) => void
	updatePanel: (id: string, config: PanelConfig) => void
	unregisterPanel: (id: string) => void
	registerHandle: (id: string) => void
	unregisterHandle: (id: string) => void
	startDrag: (handleId: string, pointer: { x: number; y: number }) => void
}

export interface PanelGroupContextValue extends InternalGroupContext {
	sizes: ComputedRef<number[]>
}
